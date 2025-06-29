import { urlBase64ToUint8Array } from './web-push-utils';

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

const PushInitiator = {
  async init() {
    if (!('serviceWorker' in navigator)) {
      console.warn('❌ Browser tidak mendukung Service Worker.');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      console.log('✅ Service Worker siap digunakan.');

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('⚠️ Izin notifikasi tidak diberikan.');
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      console.log('✅ Subscription berhasil:', subscription);

      const { endpoint, keys } = subscription.toJSON();
      if (!keys?.p256dh || !keys?.auth) {
        console.error('❌ Gagal mengambil keys dari subscription');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('⚠️ Tidak ada token login, skip push subscription.');
        return;
      }

      const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint,
          keys,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('❌ Gagal subscribe ke server:', errText);
      } else {
        console.log('✅ Berhasil subscribe push notification!');
      }
    } catch (error) {
      console.error('❌ Gagal inisialisasi push notification:', error.message);
    }
  },
};

export default PushInitiator;
