/**
 * OfferDesk Consent-First GPS Location Service
 * Full GPS access model for drive training, drive attendance tracking, and route navigation with explicit user consent.
 */

const STORAGE_KEY = 'OFFERDESK_GPS_CONSENT';

export const GPSConsentStatus = {
  GRANTED: 'GRANTED',
  DENIED: 'DENIED',
  UNPROMPTED: 'UNPROMPTED'
};

export const GpsLocationService = {
  /**
   * Get persistent user consent status
   */
  getConsentStatus: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === GPSConsentStatus.GRANTED) return GPSConsentStatus.GRANTED;
    if (saved === GPSConsentStatus.DENIED) return GPSConsentStatus.DENIED;
    return GPSConsentStatus.UNPROMPTED;
  },

  /**
   * Update consent status
   */
  setConsentStatus: (status) => {
    if (Object.values(GPSConsentStatus).includes(status)) {
      localStorage.setItem(STORAGE_KEY, status);
      window.dispatchEvent(new CustomEvent('gpsConsentChanged', { detail: status }));
    }
  },

  /**
   * Revoke consent
   */
  revokeConsent: () => {
    localStorage.setItem(STORAGE_KEY, GPSConsentStatus.DENIED);
    window.dispatchEvent(new CustomEvent('gpsConsentChanged', { detail: GPSConsentStatus.DENIED }));
  },

  /**
   * Check browser / device GPS support
   */
  isGpsSupported: () => {
    return 'geolocation' in navigator;
  },

  /**
   * Acquire current GPS location (Requires prior user consent)
   */
  getCurrentPosition: (options = {}) => {
    return new Promise((resolve, reject) => {
      const consent = GpsLocationService.getConsentStatus();
      if (consent !== GPSConsentStatus.GRANTED) {
        return reject(new Error('GPS access not granted by user. Location consent required.'));
      }

      if (!GpsLocationService.isGpsSupported()) {
        return reject(new Error('GPS / Geolocation is not supported by this browser/device.'));
      }

      const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          });
        },
        (error) => {
          console.warn('GPS position acquisition error:', error.message);
          // Fallback to simulated campus default if permission/timeout issues occur in dev
          reject(error);
        },
        defaultOptions
      );
    });
  },

  /**
   * Start continuous position tracking (Navigation & Drive Attendance mode)
   */
  watchPosition: (onSuccess, onError, options = {}) => {
    const consent = GpsLocationService.getConsentStatus();
    if (consent !== GPSConsentStatus.GRANTED) {
      if (onError) onError(new Error('GPS access not granted.'));
      return null;
    }

    if (!GpsLocationService.isGpsSupported()) {
      if (onError) onError(new Error('Geolocation not supported.'));
      return null;
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 2000,
      ...options
    };

    return navigator.geolocation.watchPosition(
      (position) => {
        onSuccess({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        });
      },
      (error) => {
        if (onError) onError(error);
      },
      defaultOptions
    );
  },

  /**
   * Stop position tracking
   */
  clearWatch: (watchId) => {
    if (watchId !== null && watchId !== undefined && GpsLocationService.isGpsSupported()) {
      navigator.geolocation.clearWatch(watchId);
    }
  },

  /**
   * Calculate distance between two lat/lon points in meters using Haversine formula
   */
  calculateDistanceMeters: (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371000; // Earth radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  },

  /**
   * Check if user is inside a target geofence radius
   */
  checkGeofenceStatus: (userLat, userLon, targetLat, targetLon, radiusMeters = 200) => {
    const distance = GpsLocationService.calculateDistanceMeters(userLat, userLon, targetLat, targetLon);
    const inside = distance <= radiusMeters;
    return {
      inside,
      distanceMeters: distance,
      radiusMeters,
      deltaMeters: distance - radiusMeters
    };
  },

  /**
   * Format lat/lon coordinates for display
   */
  formatCoordinates: (lat, lon) => {
    if (lat === undefined || lon === undefined || lat === null || lon === null) return 'N/A';
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(5)}° ${latDir}, ${Math.abs(lon).toFixed(5)}° ${lonDir}`;
  }
};

export default GpsLocationService;
