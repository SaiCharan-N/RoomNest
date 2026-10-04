const CLASS_MAP = {
  Pending: 'badge-pending',
  Accepted: 'badge-accepted',
  Rejected: 'badge-rejected',
};

export default function StatusBadge({ status }) {
  return <span className={CLASS_MAP[status] || 'badge-pending'}>{status}</span>;
}
