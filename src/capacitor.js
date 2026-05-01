import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export async function initNative() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: '#1565C0' });
  } catch (_) { /* web fallback */ }

  try {
    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch (_) { /* web fallback */ }
}
