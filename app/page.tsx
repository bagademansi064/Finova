"use client";
import Splash from "@/component/splash";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const isWeb = Capacitor.getPlatform() === 'web';
  const isLogged = false;

  useEffect(() => {
    const initializeApp = async () => {
      if (isWeb) {
        // On web: show custom splash for 2 seconds, then navigate
        setTimeout(() => {
          router.replace(isLogged ? '/home' : '/login');
        }, 2000);
      } else {
        // On native: Capacitor splash is already showing.
        // Hide it and navigate immediately.
        try {
          await SplashScreen.hide();
        } catch (error) {
          console.error("SplashScreen hide failed:", error);
        }
        router.replace(isLogged ? '/home' : '/login');
      }
    };

    initializeApp();
  }, [isWeb, isLogged, router]);

  // Web: show our custom React splash screen
  // Native: show a blank screen with matching background (Capacitor's native splash is on top)
  if (isWeb) {
    return <Splash />;
  }

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: '#E4FCF0' }} />
  );
}
