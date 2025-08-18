package com.bodyguardapp2;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import com.facebook.react.HeadlessJsTaskService;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingEvent;

public class GeofenceBroadcastReceiver extends BroadcastReceiver {
    private static final String TAG = "GeofenceReceiver";
    private static final String CHANNEL_ID = "GeofenceChannel";

    @Override
    public void onReceive(Context context, Intent intent) {
        GeofencingEvent geofencingEvent = GeofencingEvent.fromIntent(intent);
        if (geofencingEvent.hasError()) {
            Log.e(TAG, "Geofencing event error: " + geofencingEvent.getErrorCode());
            return;
        }

        int geofenceTransition = geofencingEvent.getGeofenceTransition();

        if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_EXIT) {
            Log.i(TAG, "User has EXITED the geofence area.");
            
            // [기존 로직] 로컬 푸시 알림 보내기
            sendNotification(context, "안전 지역 이탈", "피보호자가 설정된 안전 지역을 벗어났습니다.");

            // --- [핵심 수정 부분] ---
            // [새로운 로직] Headless JS 서비스를 시작하여 JS로 이벤트를 전달합니다.
            Intent serviceIntent = new Intent(context, GeofenceHeadlessTaskService.class);
            // 이벤트 데이터를 Intent에 담아 전달합니다.
            serviceIntent.putExtra("identifier", geofencingEvent.getTriggeringGeofences().get(0).getRequestId());
            serviceIntent.putExtra("action", "EXIT");
            
            context.startService(serviceIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
            // -------------------------
        }
    }

    // 로컬 알림을 보내는 메소드 (기존과 동일)
    private void sendNotification(Context context, String title, String message) {
        // ... (이하 코드는 수정할 필요 없음)
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Geofence Notifications", NotificationManager.IMPORTANCE_HIGH);
            notificationManager.createNotificationChannel(channel);
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true);

        notificationManager.notify(1, builder.build());
    }
}