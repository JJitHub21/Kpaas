package com.bodyguardapp2;

import android.content.Intent;
import android.os.Bundle;
import androidx.annotation.Nullable;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

public class GeofenceHeadlessTaskService extends HeadlessJsTaskService {

    @Override
    protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        Bundle extras = intent.getExtras();
        if (extras != null) {
            return new HeadlessJsTaskConfig(
                "GeofenceEvent", // index.js에 등록한 태스크 이름
                Arguments.fromBundle(extras),
                5000, // 타임아웃 (ms)
                true  // 포그라운드에서 실행 허용
            );
        }
        return null;
    }
}
