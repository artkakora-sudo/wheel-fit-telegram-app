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
