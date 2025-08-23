// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date: string | Date, format: 'short' | 'long' | 'full' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
  };

  return new Intl.DateTimeFormat('en-US', options[format]).format(dateObj);
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone; // Return original if can't format
};

// Format name (capitalize first letter of each word)
export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format registration number
export const formatRegistrationNumber = (id: string, prefix: string = 'REG'): string => {
  const shortId = id.slice(-8).toUpperCase();
  return `${prefix}-${shortId}`;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Format address
export const formatAddress = (address: {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}): string => {
  return `${address.address}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
};

// Generate initials
export const generateInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Format percentage
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Format time duration
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${mins} min`;
  }
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};

// Capitalize first letter
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Convert camelCase to Title Case
export const camelToTitle = (camelCase: string): string => {
  return camelCase
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Format registration type for display
export const formatRegistrationType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'early-bird': 'Early Bird',
    'regular': 'Regular',
    'student': 'Student',
    'speaker': 'Speaker',
    'in-person': 'In-Person',
    'virtual': 'Virtual',
    'hybrid': 'Hybrid',
  };
  
  return typeMap[type] || capitalize(type);
};

// Format payment status for display
export const formatPaymentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'processing': 'Processing',
    'completed': 'Completed',
    'failed': 'Failed',
    'cancelled': 'Cancelled',
    'refunded': 'Refunded',
  };
  
  return statusMap[status] || capitalize(status);
};

// Clean and format input
export const cleanInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};
