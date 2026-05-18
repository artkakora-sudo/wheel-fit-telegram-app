import type { FitResult as FitResultType } from "../../types";

interface FitResultProps {
  result: FitResultType;
}

const statusLabels = {
  ok: "Подходит",
  warning: "С оговорками",
  fail: "Не подходит",
} as const;

export function FitResult({ result }: FitResultProps) {
  return (
    <section className={`result result--${result.status}`}>
      <div className="result__header">
        <span className="result__status">{statusLabels[result.status]}</span>
        <span className="result__count">{result.items.length} проверок</span>
      </div>
      <ul className="result__list">
        {result.items.map((item) => (
          <li key={item.id} className={`result__item result__item--${item.status}`}>
            <div className="result__item-head">
              <span className="result__item-label">{item.label}</span>
              <span className="result__item-badge">{item.status}</span>
            </div>
            <p className="result__item-message">{item.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
