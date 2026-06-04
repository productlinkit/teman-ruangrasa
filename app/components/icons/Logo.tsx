export function LogoIcon({
  size = 40,
  filled = true,
  className = "",
}: {
  size?: number;
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 ${className}`}
    >
      {/* House outline */}
      <path
        d="M32 8 L54 26 L54 54 L10 54 L10 26 Z"
        stroke="#7DD3FC"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill={filled ? "white" : "transparent"}
      />

      {/* Sparkle stars */}
      <g fill="#BAE6FD">
        <path d="M18 22 L19 24 L21 25 L19 26 L18 28 L17 26 L15 25 L17 24 Z" />
        <path d="M46 22 L47 24 L49 25 L47 26 L46 28 L45 26 L43 25 L45 24 Z" />
        <path d="M22 16 L23 18 L25 19 L23 20 L22 22 L21 20 L19 19 L21 18 Z" />
        <path d="M42 16 L43 18 L45 19 L43 20 L42 22 L41 20 L39 19 L41 18 Z" />
      </g>

      {/* Center lotus / leaves */}
      <g transform="translate(32 38)">
        {/* Bottom rounded leaves */}
        <ellipse
          cx="-10"
          cy="6"
          rx="6"
          ry="4"
          fill="#7DD3FC"
          transform="rotate(-25 -10 6)"
        />
        <ellipse
          cx="10"
          cy="6"
          rx="6"
          ry="4"
          fill="#7DD3FC"
          transform="rotate(25 10 6)"
        />
        <ellipse cx="0" cy="8" rx="7" ry="4.5" fill="#93C5FD" />

        {/* Center pointed leaves (3 of them, fanned) */}
        <path d="M0 6 Q-8 -4 -5 -12 Q0 -6 0 6 Z" fill="#60A5FA" />
        <path d="M0 6 Q8 -4 5 -12 Q0 -6 0 6 Z" fill="#60A5FA" />
        <path d="M0 8 Q-3 -6 0 -16 Q3 -6 0 8 Z" fill="#3B82F6" />

        {/* Stem */}
        <line
          x1="0"
          y1="8"
          x2="0"
          y2="14"
          stroke="#7DD3FC"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export default function Logo({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={40} filled={!isDark} />
      <p
        className={`font-extrabold text-[18px] sm:text-[19px] tracking-tight leading-none ${
          isDark ? "text-white" : "text-[#0f172a]"
        }`}
      >
        Ruang
        <span className={isDark ? "text-[#93C5FD]" : "text-[#2563eb]"}>
          {" "}
          Rasa
        </span>
      </p>
    </div>
  );
}
