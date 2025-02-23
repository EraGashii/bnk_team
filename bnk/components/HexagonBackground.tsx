import type React from "react"

const HexagonBackground: React.FC = () => {
  return (
    <div className="hexagon-background">
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="hexagon-svg">
        <defs>
          <pattern
            id="hexagon-pattern"
            width="50"
            height="86.6"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(2)"
          >
            <path
              d="M25,0 L50,14.43 L50,43.3 L25,57.73 L0,43.3 L0,14.43 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="hexagon"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
      </svg>
      <style jsx>{`
        .hexagon-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          color: hsl(var(--primary) / 0.1);
          overflow: hidden;
        }
        .hexagon-svg {
          min-height: 100vh;
          animation: move 30s linear infinite;
        }
        .hexagon {
          animation: pulse 4s infinite alternate;
        }
        @keyframes pulse {
          0% {
            stroke-width: 1;
            opacity: 0.3;
          }
          100% {
            stroke-width: 2;
            opacity: 0.6;
          }
        }
        @keyframes move {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-86.6px);
          }
        }
      `}</style>
    </div>
  )
}

export default HexagonBackground

