# ReClaim — native SwiftUI prototype

Open **ReClaimApple.xcodeproj**, choose the **ReClaimApple** scheme and an iPhone simulator, then Run. This project is independent of the Capacitor app in ../../archive/ReClaimWebWrapper. It has no third-party package dependencies. Minimum deployment: iOS/iPadOS 17. The bundle ID com.reclaimwaste.native is provisional.

## What's here

- Original neighborhood artwork with tappable destinations and a movable system-symbol explorer. The original artwork may include painted characters; full animated character sprites are not implemented.
- Native SwiftUI energy mission: sorting → simulated drop → digestion → energy → saved neighborhood light.
- Responsive, width-constrained layouts for iPhone and iPad, system text styles, accessibility labels and movement buttons.
- Local progress persistence, and a confirmed reset through Options.
- No verified real-world deposits, production measurements, cloud synchronization or 3D engine yet.

## Learn the code

1. **MissionProgress.swift**: a Codable value model; guards prevent skipped steps and repeated drop credit.
2. **MissionStore.swift**: the observable owner of progress. Actions update the model, then save it in UserDefaults.
3. **ReClaimApp.swift**: creates one store for the app.
4. **NeighborhoodView.swift**: reads progress, moves the explorer and opens the mission.
5. **EnergyMissionView.swift**: renders the current step and sends actions to the store.

When you tap Simulate my drop, the view calls store.drop(). The model checks the current step, records one simulated drop and advances. The store saves the new value. SwiftUI observes the change and updates both views.

## Validation

The standalone Swift mission checks were compiled and executed successfully: step gating, incorrect sorting, duplicate prevention, reward completion, JSON round-trip and invalid saved-state recovery.

Run from this directory:

```
xcrun swiftc -module-cache-path /tmp/reclaim-swift-cache Sources/MissionProgress.swift Tests/main.swift -o /tmp/reclaim-native-tests
/tmp/reclaim-native-tests
```

Native Xcode build attempted on September 30, 2026. Compilation was blocked by the Xcode Swift macro plugin service returning malformed responses in the restricted automation environment. Simulator service access also failed. The full app build, visual layout and launch therefore remain unverified; run in Xcode to complete those checks. No signing team or distribution setup has been configured.

Before sharing: verify phone/tablet layout, complete the mission, close/reopen to check persistence, confirm reset, test large text, and select your development team for physical-device installation.
