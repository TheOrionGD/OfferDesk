import { LocalNotifications } from '@capacitor/local-notifications';
import { CapacitorService } from './capacitorService';

/**
 * OfferDesk In-App Native Notification Service (Non-Firebase)
 * Handles native Android system notifications and channels completely in-app.
 */
export const LocalNotificationService = {
  /**
   * Initialize Notification Channels on Android
   */
  initNotificationChannels: async () => {
    if (CapacitorService.isNativePlatform()) {
      try {
        await LocalNotifications.createChannel({
          id: 'campus_updates',
          name: 'Campus Placement & Drives',
          description: 'Notifications for new job drives, shortlist updates, and eligibility status',
          importance: 5, // High
          visibility: 1, // Public
          vibration: true,
          sound: 'default'
        });

        await LocalNotifications.createChannel({
          id: 'interview_alerts',
          name: 'Interview Schedule Alerts',
          description: 'Instant alerts for upcoming interview rounds and evaluator feedback',
          importance: 5,
          visibility: 1,
          vibration: true,
          sound: 'default'
        });

        await LocalNotifications.createChannel({
          id: 'wellness_reminders',
          name: 'Student Wellness & Support',
          description: 'Daily mental wellness check-ins and support resources',
          importance: 3,
          visibility: 1,
          vibration: true,
          sound: 'default'
        });
      } catch (e) {
        console.warn('Channel creation error:', e);
      }
    }
  },

  /**
   * Request Runtime Notification Permissions (Android 13+)
   */
  requestNotificationPermission: async () => {
    if (CapacitorService.isNativePlatform()) {
      try {
        const check = await LocalNotifications.checkPermissions();
        if (check.display !== 'granted') {
          const req = await LocalNotifications.requestPermissions();
          return req.display === 'granted';
        }
        return true;
      } catch (e) {
        console.warn('Permission request error:', e);
        return false;
      }
    } else if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission();
      return res === 'granted';
    }
    return true;
  },

  /**
   * Trigger Immediate Native Push Notification
   */
  sendNotification: async ({ title, body, channelId = 'campus_updates', extraData = {} }) => {
    const notificationId = Math.floor(Math.random() * 100000);

    if (CapacitorService.isNativePlatform()) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: notificationId,
              title: title,
              body: body,
              channelId: channelId,
              schedule: { at: new Date(Date.now() + 500) }, // Trigger immediately
              sound: 'default',
              extra: extraData
            }
          ]
        });
        return { success: true, id: notificationId };
      } catch (e) {
        console.error('Local notification schedule error:', e);
      }
    }

    // Web Fallback
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.png', data: extraData });
      return { success: true, id: notificationId };
    }

    return { success: false, id: notificationId };
  },

  /**
   * Schedule Future Native Push Notification
   */
  scheduleNotification: async ({ title, body, delaySeconds = 10, channelId = 'campus_updates', extraData = {} }) => {
    const notificationId = Math.floor(Math.random() * 100000);

    if (CapacitorService.isNativePlatform()) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              id: notificationId,
              title: title,
              body: body,
              channelId: channelId,
              schedule: { at: new Date(Date.now() + delaySeconds * 1000) },
              sound: 'default',
              extra: extraData
            }
          ]
        });
        return { success: true, id: notificationId };
      } catch (e) {
        console.error('Scheduled notification error:', e);
      }
    }

    return { success: false, id: notificationId };
  },

  /**
   * Register Action & Click Listener when User Taps Notification Banner
   */
  registerClickListener: (onNotificationClick) => {
    if (CapacitorService.isNativePlatform()) {
      return LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
        if (onNotificationClick) {
          onNotificationClick(action.notification.extra);
        }
      });
    }
    return null;
  }
};
