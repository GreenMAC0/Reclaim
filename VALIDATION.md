# Stage Two validation

- 25 tests, 113 assertions passed, including manual stage selection without participation rewards, milestone reveal, persistence, older-save compatibility and invalid-stage handling.
- TypeScript check passed.
- ESLint passed with zero errors; six existing fast-refresh warnings remain in shared UI components.
- Production build passed.
- Browser checked at iPhone 390 × 844, landscape tablet 1024 × 768 and portrait tablet 768 × 1024.
- Phone: no horizontal overflow; Gardens and Stations filters correctly change map pins and place results.
- Station: all six stages selectable; stage changes leave community participation unchanged; Next milestone reveals the next artwork after one contribution.
- Landscape tablet: artwork, help and presenter panel fit without overlap or scrolling.
- Portrait tablet: public display fits with controls hidden; expanded presenter controls add a small amount of vertical scrolling (16 pixels at the checked size).
- Artist-supplied Space and Mother Earth originals replace placeholders. Four sequential GIF segments provide the middle reveals; Mother Earth was visually checked with its full composition and signature visible.

This validates the local demonstration, not hardware integration, real-world navigation or live multi-device synchronization.

Camera alert update: TypeScript and production build passed. Browser verified the amber alert, removal/resume flow, and unchanged contribution count.

Scanner update: TypeScript and production build passed. Browser verified the selected plastic cup remains visible during scanning and in the amber contamination result.

Connected journey: 27 tests pass; typecheck and production build pass. Browser verified plastic-cup rejection, accepted-item confirmation, personal progress, and Big Bang Baby milestone at 250 contributions.
