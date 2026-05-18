import type { WheelPositionDelta, WheelSpecs } from "../types";

const INCH_TO_MM = 25.4;

/** Расстояние от плоскости крепления до наружной кромки диска (мм). */
export function outerLipFromMountMm(spec: WheelSpecs): number {
  return (spec.width * INCH_TO_MM) / 2 - spec.offset;
}

/** Расстояние от плоскости крепления до внутренней кромки диска (мм). */
export function innerLipFromMountMm(spec: WheelSpecs): number {
  return (spec.width * INCH_TO_MM) / 2 + spec.offset;
}

export function calculateWheelPositionDelta(
  stock: WheelSpecs,
  candidate: WheelSpecs,
): WheelPositionDelta {
  const outerStockMm = outerLipFromMountMm(stock);
  const outerNewMm = outerLipFromMountMm(candidate);
  const innerStockMm = innerLipFromMountMm(stock);
  const innerNewMm = innerLipFromMountMm(candidate);

  return {
    outerEdgeLateralMm: outerNewMm - outerStockMm,
    innerEdgeLateralMm: innerNewMm - innerStockMm,
    radiusDeltaMm: ((candidate.diameter - stock.diameter) * INCH_TO_MM) / 2,
    outerStockMm,
    outerNewMm,
  };
}

export function formatDeltaMm(mm: number, outLabel: string, inLabel: string): string {
  const abs = Math.abs(mm).toFixed(1);
  if (Math.abs(mm) < 0.05) return "без изменений";
  if (mm > 0) return `${outLabel} на ${abs} мм`;
  return `${inLabel} на ${abs} мм`;
}
