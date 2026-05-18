import type { WheelSpecs } from "../../types";

interface WheelFormProps {
  title: string;
  specs: WheelSpecs;
  onChange: (specs: WheelSpecs) => void;
}

type NumericField = keyof Pick<
  WheelSpecs,
  "diameter" | "width" | "offset" | "centerBore"
>;

const fields: { key: NumericField; label: string; step: number; min: number }[] = [
  { key: "diameter", label: "Диаметр (R)", step: 1, min: 13 },
  { key: "width", label: "Ширина (″)", step: 0.5, min: 4 },
  { key: "offset", label: "Вылет ET", step: 1, min: -50 },
  { key: "centerBore", label: "ЦО (мм)", step: 0.1, min: 50 },
];

export function WheelForm({ title, specs, onChange }: WheelFormProps) {
  const update = (patch: Partial<WheelSpecs>) => onChange({ ...specs, ...patch });

  return (
    <section className="card">
      <h2 className="card__title">{title}</h2>
      <div className="grid">
        {fields.map(({ key, label, step, min }) => (
          <label key={key} className="field">
            <span className="field__label">{label}</span>
            <input
              className="field__input"
              type="number"
              step={step}
              min={min}
              value={specs[key]}
              onChange={(e) => update({ [key]: Number(e.target.value) })}
            />
          </label>
        ))}
        <label className="field field--wide">
          <span className="field__label">Разболтовка</span>
          <input
            className="field__input"
            type="text"
            placeholder="5x114.3"
            value={specs.boltPattern}
            onChange={(e) => update({ boltPattern: e.target.value })}
          />
        </label>
      </div>
    </section>
  );
}
