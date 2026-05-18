import type { FitCheckItem, FitResult, WheelSpecs } from "../types";

function worstStatus(items: FitCheckItem[]): FitResult["status"] {
  if (items.some((i) => i.status === "fail")) return "fail";
  if (items.some((i) => i.status === "warning")) return "warning";
  return "ok";
}

function parseBoltPattern(value: string): { studs: number; pcd: number } | null {
  const match = value.trim().match(/^(\d+)\s*[x×]\s*([\d.]+)$/i);
  if (!match) return null;
  return { studs: Number(match[1]), pcd: Number(match[2]) };
}

export function checkWheelFit(stock: WheelSpecs, candidate: WheelSpecs): FitResult {
  const items: FitCheckItem[] = [];

  const stockBolt = parseBoltPattern(stock.boltPattern);
  const candidateBolt = parseBoltPattern(candidate.boltPattern);

  if (!stockBolt || !candidateBolt) {
    items.push({
      id: "bolt-format",
      label: "Разболтовка",
      status: "fail",
      message: "Формат: 5x114.3 (количество отверстий × PCD в мм)",
    });
  } else if (
    stockBolt.studs !== candidateBolt.studs ||
    Math.abs(stockBolt.pcd - candidateBolt.pcd) > 0.5
  ) {
    items.push({
      id: "bolt-pattern",
      label: "Разболтовка",
      status: "fail",
      message: `Штатная ${stock.boltPattern}, новая ${candidate.boltPattern} — не совпадает`,
    });
  } else {
    items.push({
      id: "bolt-pattern",
      label: "Разболтовка",
      status: "ok",
      message: `${candidate.boltPattern} совпадает со штатной`,
    });
  }

  const diameterDelta = candidate.diameter - stock.diameter;
  if (diameterDelta > 2) {
    items.push({
      id: "diameter",
      label: "Диаметр",
      status: "fail",
      message: `+${diameterDelta}" к штатному — слишком большое отклонение`,
    });
  } else if (diameterDelta < -2) {
    items.push({
      id: "diameter",
      label: "Диаметр",
      status: "fail",
      message: `${diameterDelta}" к штатному — меньше допустимого`,
    });
  } else if (Math.abs(diameterDelta) > 1) {
    items.push({
      id: "diameter",
      label: "Диаметр",
      status: "warning",
      message: `Отклонение ${diameterDelta > 0 ? "+" : ""}${diameterDelta}" — проверьте спидометр и клиренс`,
    });
  } else {
    items.push({
      id: "diameter",
      label: "Диаметр",
      status: "ok",
      message: `R${candidate.diameter} в пределах нормы (штатно R${stock.diameter})`,
    });
  }

  const offsetDelta = candidate.offset - stock.offset;
  if (Math.abs(offsetDelta) > 15) {
    items.push({
      id: "offset",
      label: "Вылет (ET)",
      status: "fail",
      message: `ET${candidate.offset} vs штатный ET${stock.offset} (Δ${offsetDelta > 0 ? "+" : ""}${offsetDelta})`,
    });
  } else if (Math.abs(offsetDelta) > 8) {
    items.push({
      id: "offset",
      label: "Вылет (ET)",
      status: "warning",
      message: `Отклонение вылета ${offsetDelta > 0 ? "+" : ""}${offsetDelta} мм — возможен задевание арок`,
    });
  } else {
    items.push({
      id: "offset",
      label: "Вылет (ET)",
      status: "ok",
      message: `ET${candidate.offset} близок к штатному ET${stock.offset}`,
    });
  }

  if (candidate.centerBore < stock.centerBore - 0.2) {
    items.push({
      id: "center-bore",
      label: "Центральное отверстие",
      status: "fail",
      message: `${candidate.centerBore} мм меньше ступицы ${stock.centerBore} мм`,
    });
  } else if (candidate.centerBore > stock.centerBore + 0.5) {
    items.push({
      id: "center-bore",
      label: "Центральное отверстие",
      status: "warning",
      message: `Потребуются центровочные кольца (${candidate.centerBore} → ${stock.centerBore} мм)`,
    });
  } else {
    items.push({
      id: "center-bore",
      label: "Центральное отверстие",
      status: "ok",
      message: `${candidate.centerBore} мм подходит под ступицу`,
    });
  }

  const widthDelta = candidate.width - stock.width;
  if (widthDelta > 1.5) {
    items.push({
      id: "width",
      label: "Ширина",
      status: "warning",
      message: `Шире штатной на ${widthDelta.toFixed(1)}″ — проверьте выворот и подкрылки`,
    });
  } else {
    items.push({
      id: "width",
      label: "Ширина",
      status: "ok",
      message: `${candidate.width}″ в допустимом диапазоне`,
    });
  }

  return { status: worstStatus(items), items };
}

export const defaultStock: WheelSpecs = {
  diameter: 17,
  width: 7,
  offset: 45,
  boltPattern: "5x114.3",
  centerBore: 67.1,
};

export const defaultCandidate: WheelSpecs = {
  diameter: 18,
  width: 7.5,
  offset: 40,
  boltPattern: "5x114.3",
  centerBore: 67.1,
};
