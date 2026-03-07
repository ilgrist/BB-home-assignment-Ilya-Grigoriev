import { Report } from '../../types/Report';
import { formatDate } from '../../helpers/commonHelper';
import { StatusBadge } from './StatusBadge';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export function ReportsTable({
  reports,
  actionLoading,
  onUpdate,
  hidden,
}: {
  reports: Report[];
  actionLoading: Record<string, boolean>;
  onUpdate: (id: string, updates: Partial<Report>) => void;
  hidden?: boolean;
}) {
  return (
    <div className={`reports-table-wrapper${hidden ? ' reports-table-wrapper--hidden' : ''}`}>
      <table className="reports-table">
        <thead>
          <tr>
            <th>Issue Type</th>
            <th>Description</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Created</th>
            <th>Approved</th>
            <th>Attachment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{report.issueType}</td>
              <td>
                <span className="report-description" title={report.description}>
                  {report.description}
                </span>
              </td>
              <td>
                <div>{report.contactName}</div>
                <div className="report-contact-email">{report.contactEmail}</div>
              </td>
              <td>
                <StatusBadge status={report.status} />
              </td>
              <td>{formatDate(report.createdAt)}</td>
              <td>{report.approvedAt ? formatDate(report.approvedAt) : '—'}</td>
              <td>
                <a
                  href={`${API_BASE_URL}${report.attachmentUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
              </td>
              <td className="report-actions">
                {report.status === 'NEW' && (
                  <button
                    className="btn btn-primary btn-sm"
                    disabled={actionLoading[report.id]}
                    onClick={() => onUpdate(report.id, { status: 'APPROVED' })}
                  >
                    {actionLoading[report.id] ? 'Approving...' : 'Approve'}
                  </button>
                )}
                {report.status !== 'RESOLVED' && (
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={actionLoading[report.id]}
                    onClick={() => onUpdate(report.id, { status: 'RESOLVED' })}
                  >
                    {actionLoading[report.id] ? 'Resolving...' : 'Resolve'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
