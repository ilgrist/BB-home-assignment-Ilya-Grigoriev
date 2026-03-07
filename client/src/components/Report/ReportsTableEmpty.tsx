import emptyTableIcon from '../../../assets/empty-table.svg';

export function ReportsTableEmpty() {
  return (
    <div className="table-empty-state">
      <img src={emptyTableIcon} className="table-empty-state__icon" aria-hidden="true" />
      <span>No reports found.</span>
    </div>
  );
}
