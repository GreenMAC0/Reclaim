# Legacy ReClaim Web Wrapper — archived fallback

For active Apple development, open `native/ReClaimApple/ReClaimApple.xcodeproj`.

# ReClaim iPhone app

Open `archive/ReClaimWebWrapper/App/App.xcodeproj` in Xcode. The app identifier is `com.reclaimwaste.app` (provisional; confirm ownership before distribution).

## Refresh the bundled app

From the repository root, with Node 22+ and Bun available:

```
bun install
bun run legacy:ios:sync
bun run legacy:ios:open
```

The mobile build uses `vite.mobile.config.ts` and `mobile/main.tsx`. It bundles the existing routes, original art, saved demo progress and on-demand 3D energy center. It does not load the local web server or Cloudflare website. Progress is local to this app installation and is separate from browser progress. External science links need a connection. The normal Cloudflare build remains unchanged.

## Run in Xcode

1. Wait for the Capacitor Swift package to resolve.
2. Choose the App scheme and an installed iPhone simulator, then click Run.
3. If no simulator is available, install an iOS simulator runtime in Xcode Settings → Components.
4. For a physical iPhone, choose your Apple development team under Signing & Capabilities, connect the phone, and select it as the destination. Complete any Apple account/device prompts yourself.

## Validation checklist

- Home opens to the playable world, clear of the camera island and home indicator.
- Move the character; open Energy center; rotate and zoom the equipment.
- Complete a sorting question and simulated drop; finish the energy mission.
- Restart the app and verify the earned reward persists.
- Visit Station, Personal companion, Operator and Community impact, then return home.
- Check portrait and landscape on a phone and tablet.

## Current status

The mobile web bundle and TypeScript checks pass. The native Xcode project and bundled assets have been generated. Native compilation and simulator execution are not verified: the automation session could not write Xcode's compiler caches or connect to CoreSimulator. Run the project in Xcode to complete this check.

This is a development prototype. App Store/TestFlight distribution, signing, app icon, privacy declarations, camera/location features and production backend are not configured.
