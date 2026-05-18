import { useMemo, useState } from "react";
import { AppShell } from "../components/Layout/AppShell";
import { FitResult } from "../components/wheel/FitResult";
import { WheelForm } from "../components/wheel/WheelForm";
import { useTelegram } from "../hooks/useTelegram";
import {
  checkWheelFit,
  defaultCandidate,
  defaultStock,
} from "../lib/wheelFit";
import type { WheelSpecs } from "../types";

export function HomePage() {
  const { user, haptic } = useTelegram();
  const [stock, setStock] = useState<WheelSpecs>(defaultStock);
  const [candidate, setCandidate] = useState<WheelSpecs>(defaultCandidate);

  const result = useMemo(() => checkWheelFit(stock, candidate), [stock, candidate]);

  const handleCheck = () => {
    haptic.impactOccurred("medium");
  };

  return (
    <AppShell
      title="Проверка дисков"
      subtitle={
        user
          ? `Привет, ${user.first_name}! Сравните штатные и новые параметры.`
          : "Сравните штатные и новые параметры колёс."
      }
    >
      <WheelForm title="Штатные колёса" specs={stock} onChange={setStock} />
      <WheelForm title="Новые диски" specs={candidate} onChange={setCandidate} />

      <button type="button" className="btn-primary" onClick={handleCheck}>
        Проверить совместимость
      </button>

      <FitResult result={result} />
    </AppShell>
  );
}
