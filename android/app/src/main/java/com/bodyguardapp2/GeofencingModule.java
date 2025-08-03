package com.bodyguardapp2;

import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.Priority;

public class GeofencingModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private GeofencingClient geofencingClient;
    private FusedLocationProviderClient fusedLocationClient; // ✅ 위치 클라이언트 추가
    private LocationCallback locationCallback; // ✅ 위치 콜백 추가
    private static final String TAG = "GeofencingModule";

    GeofencingModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        geofencingClient = LocationServices.getGeofencingClient(context);
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(context); // ✅ 클라이언트 초기화
    }

    @Override
    public String getName() {
        return "GeofencingModule";
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void addGeofence(String id, double latitude, double longitude, float radius, Promise promise) {
        // ... 기존 addGeofence 코드는 그대로 둡니다 ...
        Geofence geofence = new Geofence.Builder()
                .setRequestId(id)
                .setCircularRegion(latitude, longitude, radius)
                .setExpirationDuration(Geofence.NEVER_EXPIRE)
                .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_ENTER | Geofence.GEOFENCE_TRANSITION_EXIT)
                .build();

        GeofencingRequest geofencingRequest = new GeofencingRequest.Builder()
                .setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_ENTER)
                .addGeofence(geofence)
                .build();

        Intent intent = new Intent(reactContext, GeofenceBroadcastReceiver.class);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent geofencePendingIntent = PendingIntent.getBroadcast(
                reactContext, (int) System.currentTimeMillis(), intent, flags
        );

        geofencingClient.addGeofences(geofencingRequest, geofencePendingIntent)
                .addOnSuccessListener(aVoid -> {
                    Log.d(TAG, "Geofence added: " + id);
                    promise.resolve("Geofence added successfully.");
                    Intent serviceIntent = new Intent(reactContext, GeofenceForegroundService.class);
                    reactContext.startService(serviceIntent);
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to add geofence", e);
                    promise.reject("GEOFENCE_ERROR", e.getMessage());
                });
    }

    // ✅ 위치 정보 갱신을 시작하는 메소드 추가
    @SuppressLint("MissingPermission")
    @ReactMethod
    public void startLocationUpdates() {
        LocationRequest locationRequest = new LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 10000) // 10초 간격
                .setWaitForAccurateLocation(false)
                .setMinUpdateIntervalMillis(5000) // 최소 5초 간격
                .setMaxUpdateDelayMillis(15000) // 최대 15초
                .build();

        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(@NonNull LocationResult locationResult) {
                if (locationResult == null) {
                    return;
                }
                for (android.location.Location location : locationResult.getLocations()) {
                    if (location != null) {
                        Log.d(TAG, "✅ Location Update Received: Lat " + location.getLatitude() + ", Lng " + location.getLongitude());
                    }
                }
            }
        };

        fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, Looper.getMainLooper());
        Log.d(TAG, "Requesting location updates...");
    }
}