import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import RNFS from "react-native-fs";
import Sound from "react-native-sound";

export default function CameraScreen() {
    const cameraRef = useRef<Camera>(null);
    const device = useCameraDevice("back");
    const soundRef = useRef<Sound | null>(null); // ✨ 1. useState를 useRef로 변경

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    // const [currentSound, setCurrentSound] = useState<Sound | null>(null); // ❌ 제거
    const [isActive, setIsActive] = useState(true);
    const [recognizedText, setRecognizedText] = useState<string | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);

    const cameraConfig = useMemo(() => {
        if (device?.formats == null) return undefined;
        const targetFps = 1;
        const supportingFormats = device.formats.filter(
            (f) => f.minFps <= targetFps && f.maxFps >= targetFps
        );
        if (supportingFormats.length > 0) {
            return {
                format: supportingFormats.sort((a, b) => b.photoWidth - a.photoWidth)[0],
                fps: targetFps,
            };
        }
        const lowestFpsFormat = device.formats.sort((a, b) => a.minFps - b.minFps)[0];
        return { format: lowestFpsFormat, fps: lowestFpsFormat.minFps };
    }, [device?.formats]);

    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === "granted");
        })();
    }, []);

    const captureAndSend = useCallback(async () => {
        if (!isCameraReady || isProcessing || cameraRef.current == null) return;
        setIsProcessing(true);

        try {
            const photo = await cameraRef.current.takePhoto({});
            const fileData = await RNFS.readFile(photo.path, "base64");

            const resp = await fetch("http://192.168.219.110:8000/ocr-frame", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: fileData }),
            });

            if (resp.status === 204) return;
            if (!resp.ok) throw new Error(`서버 오류: ${resp.status}`);

            const data = await resp.json();
            console.log("📖 인식된 텍스트:", data.text);

            setRecognizedText(data.text);
            setTimeout(() => setRecognizedText(null), 3000);

            const outPath = `${RNFS.CachesDirectoryPath}/ocr_tts.mp3`;
            await RNFS.writeFile(outPath, data.audio, "base64");
            
            // ✨ 2. soundRef.current를 사용하여 기존 음성 중단 및 새 음성 할당
            if (soundRef.current) {
                soundRef.current.stop(() => soundRef.current?.release());
            }

            const sound = new Sound(outPath, "", (error) => {
                if (!error) {
                    sound.play(() => sound.release());
                }
            });
            soundRef.current = sound;
        } catch (err: any) {
            if (String(err).includes("Camera is closed")) {
                console.log("📷 Camera already closed, ignore");
            } else {
                console.error("캡처 및 전송 오류:", err);
            }
        } finally {
            setIsProcessing(false);
        }
    }, [isProcessing, isCameraReady]);

    useEffect(() => {
        let cancelled = false;
        const loop = async () => {
            if (!device || hasPermission !== true || cancelled) return;
            await captureAndSend();
            if (!cancelled) setTimeout(loop, 3000);
        };
        loop();

        return () => {
            cancelled = true;
            // ✨ 3. soundRef.current를 사용하여 정리
            if (soundRef.current) {
                soundRef.current.stop(() => soundRef.current?.release());
            }
        };
    }, [device, hasPermission, captureAndSend]);

    if (hasPermission === null || !device || !cameraConfig) {
        return <View style={styles.center}><Text>카메라 로딩 중...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.center}><Text>카메라 권한이 없습니다</Text></View>;
    }

    return (
        <View style={{ flex: 1 }}>
            <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive}
                photo={true}
                format={cameraConfig.format}
                fps={cameraConfig.fps}
                onInitialized={() => {
                    console.log("Camera ready!");
                    setIsCameraReady(true);
                }}
            />
            {isProcessing && (
                <View style={styles.overlay}>
                    <Text style={styles.processingText}>인식중...</Text>
                </View>
            )}
            {recognizedText && (
                <View style={styles.textOverlay}>
                    <Text style={styles.textDisplay}>{recognizedText}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  processingText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  textOverlay: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  textDisplay: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});