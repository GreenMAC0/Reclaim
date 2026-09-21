import { Camera } from "lucide-react";

export const CAMERA_SAMPLES = ["Banana peel", "Apple core", "Plastic cup"];
export function CameraView({
  item,
  scanning = false,
  accepted,
}: {
  item: string;
  scanning?: boolean;
  accepted?: boolean | undefined;
}) {
  return (
    <div
      className={`camera-simulation ${accepted === false ? "camera-rejected" : ""}`}
      aria-label={`Simulated camera view of ${item}`}
    >
      <div className="camera-hud">
        <span>
          <Camera className="inline size-3.5" /> TABLET CAMERA
        </span>
        <span>SIMULATED VIEW</span>
      </div>
      <svg viewBox="0 0 640 360" role="img" aria-label={`${item} on the scanning surface`}>
        <defs>
          <linearGradient id="scan-surface" x2="1" y2="1">
            <stop stopColor="#728c8d" />
            <stop offset="1" stopColor="#253f44" />
          </linearGradient>
          <linearGradient id="scan-banana" x2="0.7" y2="1">
            <stop stopColor="#fff1a1" />
            <stop offset="1" stopColor="#d49b26" />
          </linearGradient>
          <linearGradient id="scan-cup" x2="1" y2="1">
            <stop stopColor="#e1fbff" stopOpacity=".8" />
            <stop offset=".5" stopColor="#86b8c9" stopOpacity=".3" />
            <stop offset="1" stopColor="#e1fbff" stopOpacity=".7" />
          </linearGradient>
          <filter id="scan-shadow">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <path fill="url(#scan-surface)" d="M0 0h640v360H0z" />
        <path
          d="M0 285L640 240M100 0L30 360M580 0L620 360"
          stroke="#d8eeee"
          strokeOpacity=".08"
          strokeWidth="2"
        />
        <ellipse
          cx="325"
          cy="270"
          rx="112"
          ry="22"
          fill="#071a20"
          opacity=".55"
          filter="url(#scan-shadow)"
        />
        {item === "Plastic cup" ? (
          <g transform="rotate(-9 320 180)">
            <path
              d="M248 100L269 261Q320 286 371 261L392 100Z"
              fill="url(#scan-cup)"
              stroke="#d3f5ff"
              strokeWidth="3"
            />
            <ellipse
              cx="320"
              cy="100"
              rx="72"
              ry="19"
              fill="#28424d"
              stroke="#d3f5ff"
              strokeWidth="5"
            />
            <path
              d="M270 129L284 248M372 135L360 251M261 179Q320 199 381 179M265 207Q320 226 377 207"
              fill="none"
              stroke="#e4fbff"
              strokeOpacity=".5"
              strokeWidth="3"
            />
          </g>
        ) : item === "Apple core" ? (
          <g>
            <path d="M310 99l10-29" stroke="#614221" strokeWidth="9" strokeLinecap="round" />
            <path
              d="M271 104Q240 130 280 158Q310 194 279 230Q248 247 275 266Q320 284 364 264Q385 244 359 228Q334 190 359 158Q399 117 365 103Z"
              fill="#f2deb0"
              stroke="#b69a68"
              strokeWidth="3"
            />
            <path
              d="M271 104Q250 113 262 135Q320 147 378 132Q388 109 365 103Q326 119 271 104M277 244Q319 262 365 243L364 264Q320 284 275 266Z"
              fill="#b83932"
            />
            <ellipse cx="312" cy="183" rx="5" ry="10" fill="#714728" />
            <ellipse cx="335" cy="196" rx="5" ry="10" fill="#714728" />
          </g>
        ) : (
          <g>
            <path
              d="M320 99Q350 171 428 230Q373 247 324 194Q310 231 226 260Q230 211 294 165Q245 192 203 185Q227 157 303 135L307 97Z"
              fill="url(#scan-banana)"
              stroke="#bd8c30"
              strokeWidth="3"
            />
            <path
              d="M318 110Q319 183 232 250M313 145Q360 213 412 227"
              fill="none"
              stroke="#fff4b9"
              strokeWidth="8"
            />
            <path d="M307 97L305 82L320 79L324 99" fill="#785235" />
          </g>
        )}
        <path
          d="M200 116V80H238M402 80H440V116M440 252V288H402M238 288H200V252"
          fill="none"
          stroke={accepted === false ? "#ffc15b" : "#9affda"}
          strokeWidth="3"
        />
      </svg>
      {scanning && <div className="camera-scan-line" />}
      <div className="camera-status" role="status">
        {scanning
          ? `Scanning ${item.toLowerCase()}…`
          : accepted === undefined
            ? `${item} · ready to scan`
            : accepted
              ? `${item} · accepted`
              : `${item} · contamination detected`}
      </div>
    </div>
  );
}
