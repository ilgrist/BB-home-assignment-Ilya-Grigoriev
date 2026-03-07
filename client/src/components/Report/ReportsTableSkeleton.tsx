export function ReportsTableSkeleton() {
  return (
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
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              <td><span className="skeleton skeleton--md" /></td>
              <td><span className="skeleton skeleton--lg" /></td>
              <td>
                <span className="skeleton skeleton--md" />
                <span className="skeleton skeleton--sm" style={{ marginTop: '0.25rem' }} />
              </td>
              <td><span className="skeleton skeleton--xs" /></td>
              <td><span className="skeleton skeleton--sm" /></td>
              <td><span className="skeleton skeleton--sm" /></td>
              <td><span className="skeleton skeleton--xs" /></td>
              <td><span className="skeleton skeleton--md" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
