export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return formatDate(dateString);
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Available':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Accepted':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Collected':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Completed':
      return 'bg-teal-100 text-teal-800 border-teal-300';
    case 'Rejected':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'Cancelled':
      return 'bg-slate-100 text-slate-800 border-slate-300';
    case 'Approved':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Pending':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Suspended':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};
