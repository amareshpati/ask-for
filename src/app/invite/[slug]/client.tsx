'use client';

import { InvitationJourney } from '@/components/invitation-viewer/InvitationJourney';
import { AlreadyAnswered } from '@/components/invitation-viewer/AlreadyAnswered';
import { InvitationNotFound } from '@/components/invitation-viewer/InvitationNotFound';
import type { PublicInvitation } from '@/lib/types';

interface InvitationPageClientProps {
  invitation: PublicInvitation | null;
  hasResponded: boolean;
}

export function InvitationPageClient({
  invitation,
  hasResponded,
}: InvitationPageClientProps) {
  if (!invitation) {
    return <InvitationNotFound />;
  }

  if (hasResponded) {
    return <AlreadyAnswered />;
  }

  return <InvitationJourney invitation={invitation} />;
}
