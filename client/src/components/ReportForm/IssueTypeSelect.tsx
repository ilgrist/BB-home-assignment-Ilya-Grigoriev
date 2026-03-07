import { IssueType } from '../../types/Report';

const ISSUE_TYPES: IssueType[] = ['Bug', 'Feature Request', 'Improvement', 'Documentation', 'Other'];

interface IssueTypeSelectProps {
  value: IssueType;
  onChange: (value: IssueType) => void;
}

export function IssueTypeSelect({ value, onChange }: IssueTypeSelectProps) {
  return (
    <div className="form-group">
      <label htmlFor="issueType">Issue Type *</label>
      <select
        id="issueType"
        value={value}
        onChange={(e) => onChange(e.target.value as IssueType)}
        required
      >
        {ISSUE_TYPES.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
}
