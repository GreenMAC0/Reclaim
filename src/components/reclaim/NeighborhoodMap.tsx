import { MapPin, Leaf, Sparkles, Navigation, Trees } from "lucide-react";
import type { Place } from "@/lib/reclaim/catalog";
import { cn } from "@/lib/utils";

type Props = { places: Place[]; selectedId: string; onSelect: (id: string) => void };
/** An illustrative neighborhood, not a geographic or navigational map. */
export function NeighborhoodMap({ places, selectedId, onSelect }: Props) {
  return (
    <div className="map-canvas relative aspect-[1/1.02] overflow-hidden rounded-[28px] border border-[#cce2e6]">
      <svg viewBox="0 0 400 410" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern
            id="map-blocks"
            width="84"
            height="70"
            patternTransform="rotate(-16 200 205)"
            patternUnits="userSpaceOnUse"
          >
            <rect width="84" height="70" fill="#deebec" />
            <rect x="5" y="5" width="68" height="54" rx="8" fill="#eaf3f0" />
            <path d="M0 66H84M80 0V70" stroke="#fff" strokeWidth="9" />
            <path d="M14 16h18v16H14zM42 16h20v12H42zM15 39h45v10H15z" fill="#d4e3e2" />
          </pattern>
          <linearGradient id="river" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#a8d4ed" />
            <stop offset="1" stopColor="#65b8d1" />
          </linearGradient>
        </defs>
        <rect width="400" height="410" fill="url(#map-blocks)" />
        <path d="M297 410C290 352 347 344 346 285S381 220 420 220V420Z" fill="url(#river)" />
        <path
          d="M288 416C280 350 336 341 336 283S377 208 421 208"
          fill="none"
          stroke="#c2eee1"
          strokeWidth="9"
        />
        <path
          d="M26 228Q56 214 104 239L124 288 66 329 22 299Z"
          fill="#aad9c0"
          stroke="#ecf9ef"
          strokeWidth="5"
        />
        <path
          d="M225 46L293 27 320 97 259 119 232 88Z"
          fill="#c2e2bd"
          stroke="#eff9ed"
          strokeWidth="5"
        />
        <path d="M-30 140L425 266M151-30L235 442" fill="none" stroke="#c5d9e0" strokeWidth="18" />
        <path d="M-30 140L425 266M151-30L235 442" fill="none" stroke="#fff" strokeWidth="12" />
        <path
          d="M-30 140L425 266M151-30L235 442"
          fill="none"
          stroke="#d2e3e7"
          strokeWidth="1.5"
          strokeDasharray="7 8"
        />
        <g fill="#86bdaa">
          <circle cx="43" cy="252" r="8" />
          <circle cx="56" cy="284" r="9" />
          <circle cx="89" cy="266" r="7" />
          <circle cx="83" cy="298" r="8" />
          <circle cx="264" cy="69" r="9" />
          <circle cx="291" cy="82" r="7" />
        </g>
        <text
          x="48"
          y="181"
          fill="#78979d"
          fontSize="9"
          letterSpacing="2"
          transform="rotate(16 48 181)"
        >
          YOUR NEIGHBORHOOD
        </text>
        <text
          x="339"
          y="352"
          fill="#468ba5"
          fontSize="9"
          letterSpacing="2"
          transform="rotate(-60 339 352)"
        >
          WATERFRONT
        </text>
      </svg>
      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-[10px] font-semibold text-[#24526a] shadow-sm">
        <Navigation className="size-3" /> Detroit discoveries
      </div>
      <span
        className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/95 text-[10px] font-bold text-[#24526a] shadow-sm"
        aria-label="North"
      >
        N ↑
      </span>
      {places.map((place) => {
        const Icon =
          place.kind === "station"
            ? MapPin
            : place.kind === "garden"
              ? Trees
              : place.kind === "project"
                ? Leaf
                : Sparkles;
        return (
          <button
            type="button"
            key={place.id}
            aria-label={place.name}
            aria-pressed={selectedId === place.id}
            onClick={() => onSelect(place.id)}
            style={{ left: `${place.x}%`, top: `${place.y}%` }}
            className={cn(
              "map-pin absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl transition-transform",
              place.kind === "station"
                ? "bg-[#156493] text-white"
                : place.kind === "garden" || place.kind === "project"
                  ? "bg-[#20866a] text-white"
                  : "bg-[#e2f5ef] text-[#267274]",
              selectedId === place.id && "scale-110",
            )}
          >
            <Icon className="size-5" />
          </button>
        );
      })}
      <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1.5 text-[9px] font-medium text-[#557f89]">
        Illustrated demo map · not for navigation
      </p>
    </div>
  );
}
