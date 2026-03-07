export type ViewMode = 'table' | 'cards';

export function ViewToggle({
  viewMode,
  onChange,
}: {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div className="view-toggle">
      <button
        className={`view-toggle__btn${viewMode === 'table' ? ' view-toggle__btn--active' : ''}`}
        onClick={() => onChange('table')}
      >
        Table
      </button>
      <button
        className={`view-toggle__btn${viewMode === 'cards' ? ' view-toggle__btn--active' : ''}`}
        onClick={() => onChange('cards')}
      >
        Cards
      </button>
    </div>
  );
}
