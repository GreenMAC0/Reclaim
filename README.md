# ReClaim Waste

Two distinct experiences sharing a local prototype model:

- `/app`: personal iPhone companion, with a blue-and-mint exploration map, place filters, challenges, personal journey and material destinations.
- `/`: shared tablet station, with a deep blue community canvas, mint disposal guidance and collective progress.
- `/impact`: community impact reporting.
- `/operator`: prototype station settings.

## Presenting the artwork

The station's Artwork studio is entirely manual. Choose any of six stages to display it immediately without awarding personal or community participation. Drop-off records one anonymous contribution and shows brief feedback. Next milestone moves the artwork to just before its next threshold, then records one drop-off to reveal that stage. There is no automatic drop-off loop. Hide controls removes the presenter panel; Show controls restores it. Reset demo clears the local demonstration state.

Stage selection and progress persist locally. Existing stage-one version-two saves are supported. Data is stored in this browser; live cross-device or cross-tab synchronization is not implemented. The map is illustrative and is not navigation. Scanning, weights and impact reports remain demonstration data.

## Artwork

The supplied artist originals replace all placeholder stages: Space → First Light → Taking Shape → New Life → Big Bang Baby → Mother Earth. Four consecutive segments are extracted from the 26-frame GIF (frames 0–5, 6–12, 13–18, 19–25). Each plays once and holds its last frame; Replay reveal repeats only that segment. Reduced-motion viewers see the held frame. No automatic stage advancement is enabled.

The two original 2160 × 1620 PNGs and original GIF are included in public/artwork. The GIF is only 181 × 136, so intermediate reveals are lower resolution. The paintings are shown uncropped, with captions outside the image and the signature intact. Stage labels describe the prototype sequence; no artist name has been invented.

## Run

Install Bun, then run:

```sh
bun install --frozen-lockfile
bun run dev --host 127.0.0.1 --port 4173
```

Open http://127.0.0.1:4173/app for the phone companion, or http://127.0.0.1:4173/ for the shared station.

```sh
bun test
bun run typecheck
bun run lint
bun run build
```

The downloadable archive excludes dependencies and generated build files. Install dependencies before running it.

## Tablet camera and contamination demo

The tablet now includes an explicit camera item-check panel. The camera is off in this prototype; no footage is captured and no live recognition is performed. Use Simulate contamination in the presenter controls to show a full-screen amber plastic-cup warning. Item removed · resume clears the warning. The alert blocks drop-off interaction and adds no contribution or artwork progress.

## Simulated camera view

Open camera scanner on the tablet or use sorting practice on the phone. Choose Banana peel, Apple core, or Plastic cup. An illustrated camera scene shows the selected item, framing brackets and a moving scan line for 2.2 seconds. The item remains visible with its accepted or contamination result. This is an illustrated simulation, not live camera footage or visual recognition. Text-based questions still support the full demo item policy.


## Connected participation journey
Start at /app and choose Start my station visit at Livernois & Curtis. Check an item, then confirm an accepted simulated drop-off. Rejected and unknown items cannot complete the visit. Shared artwork and personal progress update together; return to the phone for the next invitation. Visits persist in this browser only: this is not cross-device pairing or hardware verification. Public presenter controls start collapsed. Practice and physical processor records remain separate from artwork credit.

## View navigation
The prominent Switch view bar connects Station, Personal companion, Operator dashboard and Community impact. The station also includes a visible Simulate food-waste drop button, which adds one anonymous shared contribution.
