import { useState, useEffect } from 'react';
import { Report } from '../types/Report';
import { getReports, updateReport } from '../api/reports';
import { formatDate } from '../helpers/commonHelper';
import { ReportsTableSkeleton } from '../components/Report/ReportsTableSkeleton';
import { ReportsTableError } from '../components/Report/ReportsTableError';
import { ReportsTableEmpty } from '../components/Report/ReportsTableEmpty';

/*
TODOS
- Account for many reports?
**/

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

function StatusBadge({ status }: { status: Report['status'] }) {
  const modifier = status.toLowerCase();
  return (
    <span className={`status-badge status-badge--${modifier}`}>{status}</span>
  );
}

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

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
      <h1>Reports List</h1>

      {loading && <ReportsTableSkeleton />}

      {error && !loading &&  <ReportsTableError message={error} onRetry={fetchReports} />}

      {!loading && !error && reports.length === 0 && <ReportsTableEmpty />}

      {!loading && !error && reports.length > 0 && (
        <div className="reports-table-wrapper">
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
                        onClick={() => handleUpdate(report.id, { status: 'APPROVED' })}
                      >
                        {actionLoading[report.id] ? 'Approving...' : 'Approve'}
                      </button>
                    )}
                    {report.status !== 'RESOLVED' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        disabled={actionLoading[report.id]}
                        onClick={() => handleUpdate(report.id, { status: 'RESOLVED' })}
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
      )}
    </div>
  );
}
