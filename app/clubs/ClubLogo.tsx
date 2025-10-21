// app/components/ClubFallbackLogo.tsx
"use client";

import { useDictionary } from "@/app/components/LanguageProvider";

type Props = {
  title?: string;
  className?: string;
};

export function ClubFallbackLogo({
  title,
  className,
}: Props) {
  const { clubs } = useDictionary();
  const resolvedTitle = title ?? clubs.logoFallback;
  const racketStroke = "currentColor";
  const gripFill = "currentColor";
  const stringsStroke = "rgba(255,255,255,0.4)";
  const ballFill = "#ccff66";
  const ballStroke = "#0d0f10";

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        role="img"
        aria-label={resolvedTitle}
      >
        <title>{resolvedTitle}</title>

        {/* левая ракетка */}
        <g transform="translate(10,6) rotate(-25,16,20)">
          <ellipse
            cx="16"
            cy="20"
            rx="10"
            ry="13"
            fill="none"
            stroke={racketStroke}
            strokeWidth="2"
          />
          {[...Array(4)].map((_, i) => {
            const x = 16 - 6 + i * 4;
            return (
              <line
                key={"lv" + i}
                x1={x}
                y1={8}
                x2={x}
                y2={32}
                stroke={stringsStroke}
                strokeWidth="1"
              />
            );
          })}
          {[...Array(4)].map((_, i) => {
            const y = 20 - 8 + i * 4;
            return (
              <line
                key={"lh" + i}
                x1={6}
                y1={y}
                x2={26}
                y2={y}
                stroke={stringsStroke}
                strokeWidth="1"
              />
            );
          })}
          <path d="M16 32 L16 44" stroke={racketStroke} strokeWidth="2" />
          <rect x="13" y="44" width="6" height="10" rx="2" fill={gripFill} />
        </g>

        {/* правая ракетка */}
        <g transform="translate(34,6) rotate(25,12,20)">
          <ellipse
            cx="12"
            cy="20"
            rx="10"
            ry="13"
            fill="none"
            stroke={racketStroke}
            strokeWidth="2"
          />
          {[...Array(4)].map((_, i) => {
            const x = 12 - 6 + i * 4;
            return (
              <line
                key={"rv" + i}
                x1={x}
                y1={8}
                x2={x}
                y2={32}
                stroke={stringsStroke}
                strokeWidth="1"
              />
            );
          })}
          {[...Array(4)].map((_, i) => {
            const y = 20 - 8 + i * 4;
            return (
              <line
                key={"rh" + i}
                x1={2}
                y1={y}
                x2={22}
                y2={y}
                stroke={stringsStroke}
                strokeWidth="1"
              />
            );
          })}
          <path d="M12 32 L12 44" stroke={racketStroke} strokeWidth="2" />
          <rect x="9" y="44" width="6" height="10" rx="2" fill={gripFill} />
        </g>

        {/* мяч */}
        <g transform="translate(26,40)">
          <circle
            cx="6"
            cy="6"
            r="6"
            fill={ballFill}
            stroke={ballStroke}
            strokeWidth="1"
          />
          <path
            d="M1.5,4.5 C3,2.5 9,2.5 10.5,4.5"
            fill="none"
            stroke={ballStroke}
            strokeWidth="0.8"
          />
          <path
            d="M1.5,7.5 C3,9.5 9,9.5 10.5,7.5"
            fill="none"
            stroke={ballStroke}
            strokeWidth="0.8"
          />
        </g>
      </svg>
    </div>
  );
}
