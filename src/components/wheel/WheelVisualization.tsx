import { useId } from "react";
import { calculateWheelPositionDelta } from "../../lib/wheelGeometry";
import type { WheelSpecs } from "../../types";

interface WheelVisualizationProps {
  stock: WheelSpecs;
  candidate: WheelSpecs;
}

const INCH_TO_MM = 25.4;

export function WheelVisualization({ stock, candidate }: WheelVisualizationProps) {
  const arrowId = useId();
  const delta = calculateWheelPositionDelta(stock, candidate);
  const outerDelta = delta.outerEdgeLateralMm;
  const radiusDelta = delta.radiusDeltaMm;

  const stockHalfW = (stock.width * INCH_TO_MM) / 2;
  const newHalfW = (candidate.width * INCH_TO_MM) / 2;
  const stockR = (stock.diameter * INCH_TO_MM) / 2;
  const newR = (candidate.diameter * INCH_TO_MM) / 2;

  const mmScale = 0.42;
  const topMaxHalfW = Math.max(stockHalfW, newHalfW) + 20;
  const topW = topMaxHalfW * 2 * mmScale + 100;
  const topH = 150;
  const topCx = 58;
  const topCy = topH / 2;

  const sideScale = 0.42;
  const sideMaxR = Math.max(stockR, newR) + 25;
  const sideW = 280;
  const sideH = sideMaxR * sideScale + 70;
  const sideHubX = 72;
  const sideGroundY = sideH - 24;

  const stockCenterX = topCx - stock.offset * mmScale;
  const newCenterX = topCx - candidate.offset * mmScale;
  const stockOuterX = stockCenterX + stockHalfW * mmScale;
  const newOuterX = newCenterX + newHalfW * mmScale;
  const stockInnerX = stockCenterX - stockHalfW * mmScale;
  const newInnerX = newCenterX - newHalfW * mmScale;

  return (
    <section className="card viz">
      <h2 className="card__title">Визуализация</h2>

      <div className="viz__block">
        <p className="viz__caption">Вид сверху (крыло слева)</p>
        <svg
          className="viz__svg"
          viewBox={`0 0 ${topW} ${topH}`}
          role="img"
          aria-label="Вид сверху: сравнение штатного и нового колеса"
        >
          <rect
            x={0}
            y={0}
            width={42}
            height={topH}
            className="viz__fender"
            rx={4}
          />
          <text x={8} y={topCy - 4} className="viz__fender-label">
            Крыло
          </text>

          <circle cx={topCx} cy={topCy} r={5} className="viz__hub" />
          <text x={topCx - 10} y={topCy + 22} className="viz__hub-label">
            Ступица
          </text>

          <WheelTopProfile
            innerX={stockInnerX}
            outerX={stockOuterX}
            cy={topCy}
            className="viz__wheel--stock"
            label="Штат"
          />
          <WheelTopProfile
            innerX={newInnerX}
            outerX={newOuterX}
            cy={topCy}
            className="viz__wheel--new"
            label="Новое"
          />

          {Math.abs(outerDelta) >= 0.5 && (
            <PokeArrow
              x1={stockOuterX}
              x2={newOuterX}
              y={topCy - 28}
              delta={outerDelta}
              markerId={`poke-${arrowId}`}
            />
          )}
        </svg>
      </div>

      <div className="viz__block">
        <p className="viz__caption">Вид сбоку (наружная сторона)</p>
        <svg
          className="viz__svg"
          viewBox={`0 0 ${sideW} ${sideH}`}
          role="img"
          aria-label="Вид сбоку: изменение радиуса"
        >
          <line
            x1={0}
            y1={sideGroundY}
            x2={sideW}
            y2={sideGroundY}
            className="viz__ground"
          />
          <path
            d={`M ${sideHubX - 8} ${sideGroundY - sideMaxR * sideScale - 8} Q ${sideHubX + 40} ${sideGroundY - sideMaxR * sideScale - 20} ${sideHubX + 90} ${sideGroundY - sideMaxR * sideScale - 4}`}
            className="viz__arch"
            fill="none"
          />

          <WheelSideCircle
            cx={sideHubX + stockHalfW * sideScale * 0.3}
            cy={sideGroundY - stockR * sideScale}
            r={stockR * sideScale}
            className="viz__wheel--stock"
          />
          <WheelSideCircle
            cx={sideHubX + newHalfW * sideScale * 0.3 + outerDelta * sideScale * 0.25}
            cy={sideGroundY - newR * sideScale}
            r={newR * sideScale}
            className="viz__wheel--new"
          />

          {Math.abs(radiusDelta) >= 0.5 && (
            <RadiusArrow
              x={sideHubX + 120}
              y1={sideGroundY - stockR * sideScale}
              y2={sideGroundY - newR * sideScale}
              delta={radiusDelta}
            />
          )}

          <text x={sideHubX + 8} y={sideGroundY - stockR * sideScale - 8} className="viz__tag viz__tag--stock">
            R{stock.diameter}
          </text>
          <text x={sideHubX + 8} y={sideGroundY - newR * sideScale - 8} className="viz__tag viz__tag--new">
            R{candidate.diameter}
          </text>
        </svg>
      </div>

      <div className="viz__legend">
        <span className="viz__legend-item viz__legend-item--stock">Штатное</span>
        <span className="viz__legend-item viz__legend-item--new">Новое</span>
      </div>
    </section>
  );
}

function WheelTopProfile({
  innerX,
  outerX,
  cy,
  className,
  label,
}: {
  innerX: number;
  outerX: number;
  cy: number;
  className: string;
  label: string;
}) {
  const h = 44;
  return (
    <g className={className}>
      <rect
        x={innerX}
        y={cy - h / 2}
        width={outerX - innerX}
        height={h}
        rx={6}
        className="viz__rim"
      />
      <text x={(innerX + outerX) / 2} y={cy + h / 2 + 14} className="viz__wheel-label">
        {label}
      </text>
    </g>
  );
}

function WheelSideCircle({
  cx,
  cy,
  r,
  className,
}: {
  cx: number;
  cy: number;
  r: number;
  className: string;
}) {
  return (
    <g className={className}>
      <circle cx={cx} cy={cy} r={r} className="viz__tire" />
      <circle cx={cx} cy={cy} r={r * 0.62} className="viz__rim-side" />
    </g>
  );
}

function PokeArrow({
  x1,
  x2,
  y,
  delta,
  markerId,
}: {
  x1: number;
  x2: number;
  y: number;
  delta: number;
  markerId: string;
}) {
  const left = Math.min(x1, x2);
  const width = Math.abs(x2 - x1);
  return (
    <g className="viz__arrow">
      <defs>
        <marker id={markerId} markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto">
          <polygon points="0 0, 8 4, 0 8" className="viz__arrow-head" />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        strokeWidth={2}
        markerEnd={`url(#${markerId})`}
      />
      <rect x={left} y={y - 20} width={width} height={16} rx={4} className="viz__arrow-bg" />
      <text x={left + width / 2} y={y - 8} textAnchor="middle" className="viz__arrow-text">
        {delta > 0 ? "+" : ""}
        {delta.toFixed(1)} мм
      </text>
    </g>
  );
}

function RadiusArrow({
  x,
  y1,
  y2,
  delta,
}: {
  x: number;
  y1: number;
  y2: number;
  delta: number;
}) {
  const top = Math.min(y1, y2);
  const h = Math.abs(y2 - y1);
  return (
    <g className="viz__arrow">
      <line x1={x} y1={y1} x2={x} y2={y2} strokeWidth={2} />
      <text x={x + 6} y={top + h / 2 + 4} className="viz__arrow-text">
        ΔR {delta > 0 ? "+" : ""}
        {delta.toFixed(1)} мм
      </text>
    </g>
  );
}
