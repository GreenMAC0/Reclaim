import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.reclaimwaste.app",
  appName: "ReClaim Web Wrapper",
  webDir: "dist-mobile",
  ios: { path: "archive/ReClaimWebWrapper", contentInset: "never", backgroundColor: "#080d19" },
};
export default config;
