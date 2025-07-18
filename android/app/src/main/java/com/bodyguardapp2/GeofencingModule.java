// GeofencingModule.java
package com.bodyguardapp2;

import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationServices;

public class GeofencingModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private GeofencingClient geofencingClient;
    private static final String TAG = "GeofencingModule";

    GeofencingModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        geofencingClient = LocationServices.getGeofencingClient(context);
    }

    @Override
    public String getName() {
        return "GeofencingModule";
    }

    // JS에서 호출할 메소드
    @SuppressLint("MissingPermission") // 권한 체크는 JS단에서 이미 처리했다고 가정
    @ReactMethod
    public void addGeofence(String id, double latitude, double longitude, float radius, Promise promise) {
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

        // 지오펜스 이벤트를 처리할 PendingIntent 생성
        Intent intent = new Intent(reactContext, GeofenceBroadcastReceiver.class);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent geofencePendingIntent = PendingIntent.getBroadcast(
                reactContext, 0, intent, flags
        );

        geofencingClient.addGeofences(geofencingRequest, geofencePendingIntent)
                .addOnSuccessListener(aVoid -> {
                    Log.d(TAG, "Geofence added: " + id);
                    promise.resolve("Geofence added successfully.");
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to add geofence", e);
                    promise.reject("GEOFENCE_ERROR", e.getMessage());
                });
    }
}