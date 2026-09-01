import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Network } from '@capacitor/network';
import { Preferences } from '@capacitor/preferences';
import { Device } from '@capacitor/device';
import { Dialog } from '@capacitor/dialog';
import { Browser } from '@capacitor/browser';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { PushNotifications } from '@capacitor/push-notifications';
import { NativeBiometric } from 'capacitor-native-biometric';

/**
 * OfferDesk Capacitor Native Mobile Bridge Service
 */
export const CapacitorService = {
  isNativePlatform: () => {
    return Capacitor.isNativePlatform();
  },

  getPlatform: () => {
    return Capacitor.getPlatform();
  },

  /**
   * Initialize native UI elements for web rendering on launch
   */
  initializeAppNativeUI: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        // Status bar dark theme styling
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#0f172a' });

        // Hide splash screen after React mounts
        await SplashScreen.hide();
      } catch (e) {
        console.warn('Native UI initialization error:', e);
      }
    }
  },

  /**
   * Handle Android Hardware Back Button
   */
  initBackButtonListener: (onBackNavigate) => {
    if (Capacitor.isNativePlatform()) {
      App.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else if (onBackNavigate) {
          onBackNavigate();
        } else {
          App.exitApp();
        }
      });
    }
  },

  triggerHapticPulse: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } catch (e) {
        console.warn('Haptics error:', e);
      }
    }
  },

  captureDocumentPhoto: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri
        });
        return image.webPath;
      } catch (e) {
        console.warn('Camera capture error:', e);
      }
    }
    return "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80";
  },

  registerPushNotifications: async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        let perm = await PushNotifications.checkPermissions();
        if (perm.receive === 'prompt') {
          perm = await PushNotifications.requestPermissions();
        }
        if (perm.receive === 'granted') {
          await PushNotifications.register();
        }
      } catch (e) {
        console.warn('Push registration error:', e);
      }
    }
  },

  getNetworkStatus: async () => {
    try {
      return await Network.getStatus();
    } catch (e) {
      return { connected: true, connectionType: 'wifi' };
    }
  },

  onNetworkStatusChange: (callback) => {
    if (Capacitor.isNativePlatform()) {
      return Network.addListener('networkStatusChange', callback);
    }
    return null;
  },

  getDeviceInfo: async () => {
    try {
      return await Device.getInfo();
    } catch (e) {
      return { platform: 'web', model: 'Browser' };
    }
  },

  openExternalUrl: async (url) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Browser.open({ url });
      } catch (e) {
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  },

  showAlert: async (title, message) => {
    if (Capacitor.isNativePlatform()) {
      await Dialog.alert({ title, message });
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  },

  showConfirm: async (title, message) => {
    if (Capacitor.isNativePlatform()) {
      const { value } = await Dialog.confirm({ title, message });
      return value;
    } else {
      return window.confirm(`${title}\n\n${message}`);
    }
  },

  setStorage: async (key, value) => {
    try {
      await Preferences.set({ key, value: JSON.stringify(value) });
    } catch (e) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  getStorage: async (key) => {
    try {
      const res = await Preferences.get({ key });
      return res.value ? JSON.parse(res.value) : null;
    } catch (e) {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    }
  },

  /**
   * Request Native Device Biometric (Fingerprint / Face ID / Phone Passcode) Verification
   */
  verifyBiometricOrPasscode: async (reason = 'Security verification required') => {
    if (Capacitor.isNativePlatform()) {
      try {
        const available = await NativeBiometric.isAvailable();
        if (available.isAvailable) {
          await NativeBiometric.verifyIdentity({
            reason: reason,
            title: 'Native Device Verification',
            subtitle: 'Use your fingerprint, Face ID, or phone PIN/passcode',
            description: reason,
            useFallback: true
          });
          return { success: true };
        }
      } catch (e) {
        console.warn('Native biometric verification failed/canceled:', e);
        return { success: false, error: e.message || '' };
      }
    }
    // Web Fallback: System Prompt
    const confirm = window.confirm(`[Native Security Prompt Simulator]\n\n${reason}\n\nPress OK to simulate successful phone fingerprint/passcode verification.`);
    return { success: confirm };
  }
};
