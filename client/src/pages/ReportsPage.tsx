import { useState, useEffect } from 'react';
import { Report } from '../types/Report';
import { getReports, updateReport } from '../api/reports';
import { formatDate } from '../helpers/commonHelper';
import { ReportsTableSkeleton } from '../components/Report/ReportsTableSkeleton';
import { ReportsTableError } from '../components/Report/ReportsTableError';
import { ReportsTableEmpty } from '../components/Report/ReportsTableEmpty';
import { ReportsTable } from '../components/Report/ReportsTable';
import { StatusBadge } from '../components/Report/StatusBadge';
import { ViewToggle, ViewMode } from '../components/Report/ViewToggle';

/*
TODOS
- Account for many reports?
**/

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function ReportCard({
  report,
  actionLoading,
  onUpdate,
}: {
  report: Report;
  actionLoading: boolean;
  onUpdate: (id: string, updates: Partial<Report>) => void;
}) {
  return (
    <div className="report-card">
      <div className="report-card__header">
        <span className="report-card__issue-type">{report.issueType}</span>
        <StatusBadge status={report.status} />
      </div>
      <p className="report-card__description" title={report.description}>
        {report.description}
      </p>
      <div className="report-card__meta">
        <div className="report-card__contact">
          <span className="report-card__contact-name">{report.contactName}</span>
          <span className="report-card__contact-email">{report.contactEmail}</span>
        </div>
        <div className="report-card__dates">
          <span>Created: {formatDate(report.createdAt)}</span>
          {report.approvedAt && <span>Approved: {formatDate(report.approvedAt)}</span>}
        </div>
      </div>
      <div className="report-card__footer">
        <a
          className="report-card__attachment"
          href={`${API_BASE_URL}${report.attachmentUrl}`}
          target="_blank"
          rel="noreferrer"
        >
          View attachment
        </a>
        <div className="report-actions">
          {report.status === 'NEW' && (
            <button
              className="btn btn-primary btn-sm"
              disabled={actionLoading}
              onClick={() => onUpdate(report.id, { status: 'APPROVED' })}
            >
              {actionLoading ? 'Approving...' : 'Approve'}
            </button>
          )}
          {report.status !== 'RESOLVED' && (
            <button
              className="btn btn-secondary btn-sm"
              disabled={actionLoading}
              onClick={() => onUpdate(report.id, { status: 'RESOLVED' })}
            >
              {actionLoading ? 'Resolving...' : 'Resolve'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const fetchReports = async () => {
    setLoading(false);
    setError(null);
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdate = async (id: string, updates: Partial<Report>) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      const updated = await updateReport(id, updates);
      setReports(prev => prev.map(r => r.id === id ? updated : r));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="page">
      <div className="reports-page-header">
        <h1>Reports List</h1>
        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      {loading && <ReportsTableSkeleton />}

      {error && !loading && <ReportsTableError message={error} onRetry={fetchReports} />}

      {!loading && !error && reports.length === 0 && <ReportsTableEmpty />}

      {!loading && !error && reports.length > 0 && (
        <ReportsTable
          reports={reports}
          actionLoading={actionLoading}
          onUpdate={handleUpdate}
          hidden={viewMode === 'cards'}
        />
      )}

      {!loading && !error && reports.length > 0 && (
        <div className={`reports-cards-grid${viewMode === 'table' ? ' reports-cards-grid--desktop-hidden' : ''}`}>
          {reports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              actionLoading={actionLoading[report.id] ?? false}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
