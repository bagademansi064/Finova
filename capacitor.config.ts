

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.finova.app.dev',
  appName: 'Finova',
  webDir: 'out',
  server: {
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: false,
      backgroundColor: "#E4FCF0",
      showSpinner: false,
      androidSplashResourceName: "splash"
    }
  }
};

export default config;