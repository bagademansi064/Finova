

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.finova.app',
  appName: 'Finova',
  webDir: 'out',
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