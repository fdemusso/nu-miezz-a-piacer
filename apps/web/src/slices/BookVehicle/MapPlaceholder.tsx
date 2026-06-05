
export function MapPlaceholder() {
  return (
    <div className="relative w-full h-[200px] bg-muted/20 border rounded-xl overflow-hidden shadow-inner">
      <svg
        viewBox="0 0 300 200"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/15" />
          </pattern>
        </defs>
        
        {/* Grid Background */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Path/route dashed line */}
        <path
          d="M 60 140 Q 140 100 240 60"
          fill="none"
          stroke="#5C6BC0"
          strokeWidth="3"
          strokeDasharray="6 4"
          className="opacity-75 animate-pulse"
        />

        {/* User Position (Concentric dark circle) */}
        <g transform="translate(60, 140)">
          {/* Pulse animation ring */}
          <circle r="12" fill="currentColor" className="text-foreground/10 animate-ping" />
          {/* Outer dark ring */}
          <circle r="8" fill="currentColor" className="text-foreground" />
          {/* Inner ring */}
          <circle r="6" fill="#fff" />
          {/* Center core */}
          <circle r="3.5" fill="currentColor" className="text-foreground" />
        </g>

        {/* Vehicle Marker (Blue-Indigo) */}
        <g transform="translate(240, 60)">
          {/* Pulse ring */}
          <circle r="15" fill="#5C6BC0" className="opacity-25 animate-ping" />
          {/* Pin body */}
          <path
            d="M0 -14 C-5 -14 -9 -10 -9 -5 C-9 2 0 12 0 12 C0 12 9 2 9 -5 C9 -10 5 -14 0 -14 Z"
            fill="#5C6BC0"
            stroke="#fff"
            strokeWidth="1.5"
          />
          {/* Inside dot */}
          <circle cx="0" cy="-5" r="3" fill="#fff" />
        </g>
      </svg>
      {/* Small badge overlay */}
      <span className="absolute bottom-2 right-2 text-[10px] bg-background/80 px-2 py-0.5 rounded-full border text-muted-foreground font-medium select-none">
        Simulatore Mappa
      </span>
    </div>
  )
}
