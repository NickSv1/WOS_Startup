/**
 * The Knodle mark — a node graph: a central hub ringed by connected nodes, the
 * app's own financial map in miniature. Recreated as inline SVG so it scales
 * crisply and can invert on the dark hero.
 */
const HUB = { x: 50, y: 50 };
const NODES = [
  { x: 29, y: 31, r: 10 }, // top-left, large
  { x: 69, y: 28, r: 6.5 }, // top-right
  { x: 78, y: 55, r: 7 }, // right
  { x: 33, y: 72, r: 10 }, // bottom-left, large
  { x: 64, y: 75, r: 6 }, // bottom-right
];

export function LogoMark({
  size = 32,
  className = "",
  bg = "#c1ff72",
  fg = "#000000",
  rounded = true,
}: {
  size?: number;
  className?: string;
  bg?: string;
  fg?: string;
  rounded?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <rect width="100" height="100" rx={rounded ? 22 : 0} fill={bg} />
      {/* spokes */}
      <g stroke={fg} strokeWidth="7.5" strokeLinecap="round">
        {NODES.map((n, i) => (
          <line key={i} x1={HUB.x} y1={HUB.y} x2={n.x} y2={n.y} />
        ))}
      </g>
      {/* outer nodes */}
      <g fill={fg}>
        {NODES.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} />
        ))}
      </g>
      {/* central hub — a ring (filled circle with the background punched out) */}
      <circle cx={HUB.x} cy={HUB.y} r="12" fill={fg} />
      <circle cx={HUB.x} cy={HUB.y} r="5" fill={bg} />
    </svg>
  );
}

export function Wordmark({
  size = 32,
  className = "",
  onDark = false,
}: {
  size?: number;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span
        className="font-bold tracking-tight"
        style={{
          fontSize: size * 0.7,
          color: onDark ? "#ffffff" : "#000000",
        }}
      >
        Knodle
      </span>
    </div>
  );
}
