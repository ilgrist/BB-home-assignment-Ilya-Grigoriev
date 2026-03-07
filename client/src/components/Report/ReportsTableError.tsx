import alertErrorIcon from "../../../assets/alert-error.svg";

export function ReportsTableError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="alert alert-error">
      <img
        src={alertErrorIcon}
        className="alert-icon"
        aria-hidden="true"
      />
      <span>{message}</span>
      <button
        className="btn btn-secondary btn-sm alert-action"
        onClick={onRetry}
      >
        Retry
      </button>
    </div>
  );
}
