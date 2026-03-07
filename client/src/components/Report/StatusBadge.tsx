import { Report } from '../../types/Report';

export function StatusBadge({ status }: { status: Report['status'] }) {
  const modifier = status.toLowerCase();
  return (
    <span className={`status-badge status-badge--${modifier}`}>{status}</span>
  );
}
