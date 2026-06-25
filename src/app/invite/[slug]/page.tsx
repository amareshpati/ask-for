import { createClient } from '@/lib/supabase/server';
import { InvitationPageClient } from './client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch invitation by slug
  const { data: invitation, error } = await supabase
    .from('invitations')
    .select('id, type, recipient_name, welcome_message, favourite_food, favourite_location, final_question, status, unique_slug')
    .eq('unique_slug', slug)
    .single();

  if (error || !invitation) {
    return <InvitationPageClient invitation={null} hasResponded={false} />;
  }

  // Check if already responded
  const { data: response } = await supabase
    .from('invitation_responses')
    .select('response')
    .eq('invitation_id', invitation.id)
    .single();

  return (
    <InvitationPageClient
      invitation={invitation}
      hasResponded={response?.response === 'yes'}
    />
  );
}
