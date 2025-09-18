package com.bodyguardapp2;

import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.content.Intent;
import android.os.Build;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable; 

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap; 
import com.facebook.react.bridge.Arguments;   
import com.facebook.react.modules.core.DeviceEventManagerModule; 

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
    private FusedLocationProviderClient fusedLocationClient;
    private LocationCallback locationCallback;
    private static final String TAG = "GeofencingModule";

    GeofencingModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        geofencingClient = LocationServices.getGeofencingClient(context);
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(context);
    }

    @Override
    public String getName() {
        return "GeofencingModule";
    }

    // GeofenceBroadcastReceiver에서 호출하여 JS로 이벤트를 전송하는 메소드
    public void sendGeofenceEvent(String eventName, WritableMap params) {
        try {
            if (reactContext.hasActiveCatalystInstance()) {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
                Log.d(TAG, "Event " + eventName + " sent to JS.");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error sending event to JS: ", e);
        }
    }
    // -------------------------

    @SuppressLint("MissingPermission")
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

        Intent intent = new Intent(reactContext, GeofenceBroadcastReceiver.class);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            flags |= PendingIntent.FLAG_MUTABLE;
        }

        // requestCode를 고유하게 만들기 위해 id의 해시코드를 사용하거나, 0으로 고정하는 것이 좋습니다.
        // System.currentTimeMillis()는 앱을 재시작할 때마다 바뀌어 의도치 않은 동작을 유발할 수 있습니다.
        int requestCode = id.hashCode(); 
        PendingIntent geofencePendingIntent = PendingIntent.getBroadcast(
        reactContext,
        requestCode, // requestCode 수정
        intent,
        flags
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
    
    @SuppressLint("MissingPermission")
    @ReactMethod
    public void startLocationUpdates() {
        LocationRequest locationRequest = new LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 10000)
                .setWaitForAccurateLocation(false)
                .setMinUpdateIntervalMillis(5000)
                .setMaxUpdateDelayMillis(15000)
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
