import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/invitations/[slug]/public — get public invitation data
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: invitation, error } = await supabase
      .from('invitations')
      .select('id, type, recipient_name, welcome_message, favourite_food, favourite_location, final_question, status, unique_slug')
      .eq('unique_slug', slug)
      .single();

    if (error || !invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Check if already responded
    const { data: response } = await supabase
      .from('invitation_responses')
      .select('id, response, responded_at')
      .eq('invitation_id', invitation.id)
      .single();

    return NextResponse.json({
      invitation,
      hasResponded: response?.response === 'yes',
      response: response || null,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
