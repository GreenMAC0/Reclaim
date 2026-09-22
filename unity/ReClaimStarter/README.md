# ReClaim Unity starter
Open this folder through Unity Hub: Add → Add project from disk. Installed editor: 6000.6.2f1.
After import, choose ReClaim → Create starter scene, then press Play.
This starter uses the supplied scene as a background with clickable exploration spots. It does not contain a rigged character, 3D room, or movement system.
For web export install Web Build Support in Unity Hub, select Web in Build Profiles, and build. Test on the intended phone/tablet before shipping.
Browser bridge: unityInstance.SendMessage("ReclaimRoom", "SetContributions", "250"). Server-authoritative progress must eventually replace demo counts; this method only displays progress.
