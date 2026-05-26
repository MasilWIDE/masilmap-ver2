/* All 8 symbol explorations + recommended-direction symbol set.
   Each Symbol component is a pure SVG, sized by parent via width/height props.
   Colors are passed in so we can render teal, mono-black, mono-white variants. */

const TEAL = "#2FA89E";
const TEAL_DEEP = "#1F7E78";
const CORAL = "#FF8A5C";
const CHARCOAL = "#1A2B2A";
const CREAM = "#FAF6F1";

/* ---------- 01. Window-grid pin ---------- *
   Classic teardrop, round head holds a 3x2 window grid (architecture cue).
   One window glows coral = "you are here" point of interest. */
function SymWindowGrid({ size = 200, fg = TEAL, accent = CORAL, mono = false }) {
  const s = size;
  return (
    <svg viewBox="0 0 200 240" width={s} height={s * 1.2} fill="none">
      <path
        d="M100 16 C145 16 180 49 180 92 C180 138 132 188 108 222 C103 229 97 229 92 222 C68 188 20 138 20 92 C20 49 55 16 100 16 Z"
        fill={fg}
      />
      {/* window grid 3x2 inside round head */}
      {[0, 1, 2].map((col) =>
        [0, 1].map((row) => {
          const x = 56 + col * 30;
          const y = 64 + row * 36;
          const isAccent = !mono && col === 1 && row === 1;
          return (
            <rect
              key={`${col}-${row}`}
              x={x}
              y={y}
              width={22}
              height={24}
              rx={4}
              fill={isAccent ? accent : CREAM}
            />
          );
        })
      )}
    </svg>
  );
}

/* ---------- 02. Arch pin ---------- *
   Pin head = rounded arch doorway. Reads as entrance / discovery. */
function SymArch({ size = 200, fg = TEAL, accent = CORAL, mono = false }) {
  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} fill="none">
      <path
        d="M100 16 C145 16 180 49 180 92 C180 138 132 188 108 222 C103 229 97 229 92 222 C68 188 20 138 20 92 C20 49 55 16 100 16 Z"
        fill={fg}
      />
      {/* arch cutout */}
      <path
        d="M68 130 L68 92 C68 74 82 60 100 60 C118 60 132 74 132 92 L132 130 Z"
        fill={CREAM}
      />
      {/* coral dot inside arch = location point */}
      {!mono && <circle cx="100" cy="108" r="9" fill={accent} />}
    </svg>
  );
}

/* ---------- 03. M-pin ---------- *
   Pin silhouette made of an 'M' — two columns meeting at the tip.
   Family resemblance to 마실 wordmarks. */
function SymM({ size = 200, fg = TEAL, accent = CORAL, mono = false }) {
  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} fill="none">
      {/* outer pin */}
      <path
        d="M100 16 C145 16 180 49 180 92 C180 138 132 188 108 222 C103 229 97 229 92 222 C68 188 20 138 20 92 C20 49 55 16 100 16 Z"
        fill={fg}
      />
      {/* M legs as cutouts */}
      <path
        d="M52 56 L52 138 L72 138 L72 96 L92 138 L108 138 L128 96 L128 138 L148 138 L148 56 L128 56 L100 116 L72 56 Z"
        fill={CREAM}
      />
      {!mono && <circle cx="100" cy="178" r="9" fill={accent} />}
    </svg>
  );
}

/* ---------- 04. Stacked-floors pin ---------- *
   Pin built from 3 horizontal slabs, tapering to a point. Floors of a building. */
function SymStack({ size = 200, fg = TEAL, accent = CORAL, mono = false }) {
  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} fill="none">
      <defs>
        <clipPath id="pinClip04">
          <path d="M100 16 C145 16 180 49 180 92 C180 138 132 188 108 222 C103 229 97 229 92 222 C68 188 20 138 20 92 C20 49 55 16 100 16 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#pinClip04)">
        <rect x="0" y="0" width="200" height="240" fill={fg} />
        {/* horizontal cream slits = floor seams */}
        <rect x="-10" y="68" width="220" height="6" fill={CREAM} />
        <rect x="-10" y="108" width="220" height="6" fill={CREAM} />
        <rect x="-10" y="148" width="220" height="6" fill={CREAM} />
        {/* single window per floor, coral on middle */}
        <rect x="88" y="80" width="24" height="20" rx="3" fill={CREAM} />
        <rect x="88" y="120" width="24" height="20" rx="3" fill={mono ? CREAM : accent} />
      </g>
    </svg>
  );
}

/* ---------- 05. Plan-view pin ---------- *
   Pin head shows an abstract floor plan / aerial — overlapping rectangles. */
function SymPlan({ size = 200, fg = TEAL, accent = CORAL, mono = false }) {
  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} fill="none">
      <path
        d="M100 16 C145 16 180 49 180 92 C180 138 132 188 108 222 C103 229 97 229 92 222 C68 188 20 138 20 92 C20 49 55 16 100 16 Z"
        fill={fg}
      />
      {/* L-shaped plan, cream */}
      <path
        d="M52 60 L120 60 L120 92 L148 92 L148 128 L52 128 Z"
        fill={CREAM}
      />
      {/* courtyard / focal coral square */}
      {!mono && <rect x="92" y="92" width="20" height="20" fill={accent} />}
    </svg>
  );
}

/* ---------- 06. Parallelogram-stack pin ---------- *
   Family DNA: 마실와이드의 기하학 모티프. Two overlapping slanted slabs form the pin. */
function SymParallel({ size = 200, fg = TEAL, accent = CORAL, mono = false }) {
  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} fill="none">
      <defs>
        <clipPath id="pinClip06">
          <path d="M100 16 C145 16 180 49 180 92 C180 138 132 188 108 222 C103 229 97 229 92 222 C68 188 20 138 20 92 C20 49 55 16 100 16 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#pinClip06)">
        <rect x="0" y="0" width="200" height="240" fill={CREAM} />
        {/* back slab teal */}
        <path d="M-20 60 L160 30 L220 100 L40 130 Z" fill={fg} />
        {/* front slab darker teal */}
        <path d="M-20 120 L160 90 L220 160 L40 190 Z" fill={mono ? CHARCOAL : TEAL_DEEP} />
        {/* coral seam dot */}
        {!mono && <circle cx="100" cy="100" r="7" fill={accent} />}
      </g>
    </svg>
  );
}

/* ---------- 07. Column-doorway pin ---------- *
   Two columns + lintel inside circular head — classical architecture cue. */
function SymColumn({ size = 200, fg = TEAL, accent = CORAL, mono = false }) {
  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} fill="none">
      <path
        d="M100 16 C145 16 180 49 180 92 C180 138 132 188 108 222 C103 229 97 229 92 222 C68 188 20 138 20 92 C20 49 55 16 100 16 Z"
        fill={fg}
      />
      {/* lintel */}
      <rect x="56" y="56" width="88" height="14" fill={CREAM} />
      {/* two columns */}
      <rect x="64" y="74" width="18" height="58" fill={CREAM} />
      <rect x="118" y="74" width="18" height="58" fill={CREAM} />
      {/* base */}
      <rect x="56" y="134" width="88" height="10" fill={CREAM} />
      {/* coral dot between columns */}
      {!mono && <circle cx="100" cy="103" r="9" fill={accent} />}
    </svg>
  );
}

/* ---------- 09. House-in-circle pin (matches user reference) ---------- *
   Pin head holds a cream circle with a teal house silhouette inside.
   A small coral dot sits below the pin tip as a "ground marker". */
function SymHouse({ size = 200, fg = TEAL, accent = CORAL, mono = false, dotBelow = true }) {
  return (
    <svg viewBox="0 0 200 260" width={size} height={size * 1.3} fill="none">
      {/* pin body */}
      <path
        d="M100 16 C145 16 180 49 180 92 C180 138 132 188 108 222 C103 229 97 229 92 222 C68 188 20 138 20 92 C20 49 55 16 100 16 Z"
        fill={fg}
      />
      {/* cream circle window */}
      <circle cx="100" cy="92" r="44" fill={CREAM} />
      {/* house silhouette inside circle */}
      {/* roof (triangle) + body (rect) merged as a single path */}
      <path
        d="M100 66 L132 92 L124 92 L124 116 L76 116 L76 92 L68 92 Z"
        fill={fg}
      />
      {/* coral dot below pin tip — "ground marker" */}
      {!mono && dotBelow && <circle cx="100" cy="244" r="9" fill={accent} />}
    </svg>
  );
}

/* ---------- 08. Folded-map pin ---------- *
   Pin shape with a vertical fold-crease down the middle, two facets shaded.
   The fold doubles as a building edge. */
function SymFold({ size = 200, fg = TEAL, accent = CORAL, mono = false }) {
  return (
    <svg viewBox="0 0 200 240" width={size} height={size * 1.2} fill="none">
      <defs>
        <clipPath id="pinClip08">
          <path d="M100 16 C145 16 180 49 180 92 C180 138 132 188 108 222 C103 229 97 229 92 222 C68 188 20 138 20 92 C20 49 55 16 100 16 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#pinClip08)">
        <rect x="0" y="0" width="200" height="240" fill={fg} />
        {/* darker right facet */}
        <path d="M100 16 L100 222 L200 222 L200 0 Z" fill={mono ? CHARCOAL : TEAL_DEEP} />
        {/* horizontal map-fold seams, cream */}
        <rect x="0" y="86" width="200" height="3" fill={CREAM} opacity="0.55" />
        <rect x="0" y="138" width="200" height="3" fill={CREAM} opacity="0.55" />
      </g>
      {/* center coral dot = location */}
      {!mono && <circle cx="100" cy="112" r="10" fill={accent} />}
    </svg>
  );
}

Object.assign(window, {
  SymWindowGrid,
  SymArch,
  SymM,
  SymStack,
  SymPlan,
  SymParallel,
  SymColumn,
  SymFold,
  SymHouse,
  MASIL_TEAL: TEAL,
  MASIL_TEAL_DEEP: TEAL_DEEP,
  MASIL_CORAL: CORAL,
  MASIL_CHARCOAL: CHARCOAL,
  MASIL_CREAM: CREAM,
});
