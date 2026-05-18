import {
  calculateWheelPositionDelta,
  formatDeltaMm,
} from "../../lib/wheelGeometry";
import type { WheelSpecs } from "../../types";

interface PositionSummaryProps {
  stock: WheelSpecs;
  candidate: WheelSpecs;
}

export function PositionSummary({ stock, candidate }: PositionSummaryProps) {
  const delta = calculateWheelPositionDelta(stock, candidate);

  const rows = [
    {
      label: "Наружная кромка",
      value: formatDeltaMm(
        delta.outerEdgeLateralMm,
        "вынесена наружу",
        "утоплена внутрь",
      ),
      mm: delta.outerEdgeLateralMm,
    },
    {
      label: "Внутренняя кромка",
      value: formatDeltaMm(
        delta.innerEdgeLateralMm,
        "ближе к подвеске",
        "дальше от подвески",
      ),
      mm: delta.innerEdgeLateralMm,
    },
    {
      label: "Верхняя точка (R)",
      value: formatDeltaMm(
        delta.radiusDeltaMm,
        "выше",
        "ниже",
      ),
      mm: delta.radiusDeltaMm,
    },
  ];

  return (
    <section className="card position-summary">
      <h2 className="card__title">Смещение крайней точки</h2>
      <p className="position-summary__hint">
        Расчёт при той же резине: меняется только геометрия диска (ширина, ET, R).
      </p>
      <ul className="position-summary__list">
        {rows.map((row) => (
          <li
            key={row.label}
            className={`position-summary__row position-summary__row--${signClass(row.mm)}`}
          >
            <span className="position-summary__label">{row.label}</span>
            <span className="position-summary__value">
              {row.mm > 0.05 ? "+" : row.mm < -0.05 ? "−" : ""}
              {Math.abs(row.mm) >= 0.05 ? `${Math.abs(row.mm).toFixed(1)} мм` : "0"}
            </span>
            <span className="position-summary__desc">{row.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function signClass(mm: number): string {
  if (mm > 0.5) return "out";
  if (mm < -0.5) return "in";
  return "neutral";
}
