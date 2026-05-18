export interface WheelSpecs {
  diameter: number;
  width: number;
  offset: number;
  boltPattern: string;
  centerBore: number;
}

export type FitStatus = "ok" | "warning" | "fail";

export interface FitCheckItem {
  id: string;
  label: string;
  status: FitStatus;
  message: string;
}

export interface FitResult {
  status: FitStatus;
  items: FitCheckItem[];
}

/** Смещение геометрии колеса относительно штатного (мм). */
export interface WheelPositionDelta {
  /** Наружная кромка: + наружу, − внутрь */
  outerEdgeLateralMm: number;
  /** Внутренняя кромка: + в сторону подвески */
  innerEdgeLateralMm: number;
  /** Верхняя точка (радиус): + выше при увеличении R */
  radiusDeltaMm: number;
  outerStockMm: number;
  outerNewMm: number;
}
