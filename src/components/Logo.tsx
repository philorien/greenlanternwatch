/** Original site mark: concentric rings with a bright core. */
export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" stroke="#35e8a0" strokeWidth="2" />
      <circle
        cx="24"
        cy="24"
        r="15"
        stroke="#35e8a0"
        strokeWidth="2"
        opacity="0.7"
      />
      <circle cx="24" cy="24" r="8" fill="#0b1f17" stroke="#35e8a0" strokeWidth="2" />
      <circle cx="24" cy="24" r="3.5" fill="#35e8a0" />
      <path
        d="M24 2v7M24 39v7M2 24h7M39 24h7"
        stroke="#35e8a0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
