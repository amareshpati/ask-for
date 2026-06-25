export function generateSlug(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export function getInviteUrl(slug: string): string {
  return `${getAppUrl()}/invite/${slug}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'draft':
      return 'bg-surface-200 text-surface-600';
    case 'shared':
      return 'bg-travel-sky/20 text-travel-blue';
    case 'responded':
      return 'bg-success/20 text-success';
    default:
      return 'bg-surface-200 text-surface-600';
  }
}

export function getResponseEmoji(response: string): string {
  switch (response) {
    case 'yes':
      return '❤️';
    case 'maybe':
      return '🤔';
    case 'no':
      return '❌';
    default:
      return '⏳';
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function canUseWebShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

export async function webShare(data: ShareData): Promise<boolean> {
  try {
    await navigator.share(data);
    return true;
  } catch {
    return false;
  }
}
