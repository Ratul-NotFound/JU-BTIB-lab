"use client";

import * as React from "react";

interface HistogramPoint {
  year: number;
  count: number;
}

interface PublicationsHistogramProps {
  data: HistogramPoint[];
  className?: string;
}

export function PublicationsHistogram({ data, className = "" }: PublicationsHistogramProps) {
  const [hoveredPoint, setHoveredPoint] = React.useState<HistogramPoint | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className={`p-6 text-center text-xs font-mono text-[var(--text-muted)] border border-[var(--border)] rounded-xl bg-[var(--surface)] ${className}`}>
        No timeline data available
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const chartHeight = 120;
  const barWidth = 28;
  const gap = 16;
  const totalWidth = data.length * (barWidth + gap);

  return (
    <div className={`p-3.5 sm:p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2 sm:space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="specimen-tag text-[9px] sm:text-[10px]">OUTPUT METRICS</span>
            <span className="text-[10px] sm:text-xs font-mono text-[var(--bio-teal)] font-medium">
              ANNUAL RESEARCH OUTPUT
            </span>
          </div>
          <h4 className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] mt-0.5 sm:mt-1">
            Peer-Reviewed Articles by Year
          </h4>
        </div>

        {hoveredPoint ? (
          <div className="text-right">
            <span className="text-[10px] sm:text-xs font-mono text-[var(--text-muted)]">Year {hoveredPoint.year}:</span>{" "}
            <span className="text-[10px] sm:text-xs font-mono font-bold text-[var(--bio-teal)]">
              {hoveredPoint.count} {hoveredPoint.count === 1 ? "publication" : "publications"}
            </span>
          </div>
        ) : (
          <div className="text-[10px] sm:text-xs font-mono text-[var(--text-muted)]">
            Total indexed: {data.reduce((acc, curr) => acc + curr.count, 0)}
          </div>
        )}
      </div>

      {/* SVG Bar Chart */}
      <div className="overflow-x-auto pt-1 sm:pt-2 pb-1">
        <svg
          viewBox={`0 0 ${Math.max(totalWidth, 320)} ${chartHeight + 35}`}
          className="w-full h-24 sm:h-36"
        >
          {/* Subtle horizontal grid lines */}
          <line
            x1="0"
            y1={chartHeight}
            x2={Math.max(totalWidth, 320)}
            y2={chartHeight}
            stroke="var(--border)"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1={chartHeight / 2}
            x2={Math.max(totalWidth, 320)}
            y2={chartHeight / 2}
            stroke="var(--border)"
            strokeDasharray="2 2"
            strokeWidth="0.8"
          />

          {data.map((d, index) => {
            const barHeight = Math.round((d.count / maxCount) * (chartHeight - 20));
            const x = index * (barWidth + gap) + 12;
            const y = chartHeight - barHeight;
            const isHovered = hoveredPoint?.year === d.year;

            return (
              <g
                key={d.year}
                onMouseEnter={() => setHoveredPoint(d)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="cursor-pointer transition-all"
              >
                {/* Bar Background for easy hover */}
                <rect
                  x={x - 4}
                  y={0}
                  width={barWidth + 8}
                  height={chartHeight}
                  fill="transparent"
                />

                {/* Animated bar column */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 4)}
                  rx="3"
                  fill={isHovered ? "var(--bio-teal)" : "var(--bio-teal-hover)"}
                  opacity={isHovered ? 1 : 0.85}
                  className="transition-colors"
                />

                {/* Count badge on top of bar */}
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fill="var(--text-secondary)"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {d.count}
                </text>

                {/* Year label underneath axis */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 18}
                  textAnchor="middle"
                  fill={isHovered ? "var(--bio-teal)" : "var(--text-muted)"}
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight={isHovered ? "bold" : "normal"}
                >
                  {d.year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
