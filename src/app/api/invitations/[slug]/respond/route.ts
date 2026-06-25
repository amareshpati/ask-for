import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { submitResponseSchema } from '@/lib/schemas/invitation';

// POST /api/invitations/[slug]/respond — submit response
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Find the invitation
    const { data: invitation, error: invError } = await supabase
      .from('invitations')
      .select('id, status')
      .eq('unique_slug', slug)
      .single();

    if (invError || !invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Check if already responded
    const { data: existingResponse } = await supabase
      .from('invitation_responses')
      .select('id, response')
      .eq('invitation_id', invitation.id)
      .single();

    if (existingResponse && existingResponse.response === 'yes') {
      return NextResponse.json(
        { error: 'This invitation has already been answered' },
        { status: 409 }
      );
    }

    // Validate request body
    const body = await request.json();
    const parsed = submitResponseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    let responseData;
    let respError;

    if (existingResponse) {
      // Update existing response
      const { data, error } = await supabase
        .from('invitation_responses')
        .update({
          response: parsed.data.response,
          selected_date: parsed.data.selected_date || null,
          selected_time_slot: parsed.data.selected_time_slot || null,
          selected_food: parsed.data.selected_food || null,
          selected_location: parsed.data.selected_location || null,
          responded_at: new Date().toISOString(),
        })
        .eq('id', existingResponse.id)
        .select()
        .single();
      responseData = data;
      respError = error;
    } else {
      // Insert new response
      const { data, error } = await supabase
        .from('invitation_responses')
        .insert({
          invitation_id: invitation.id,
          response: parsed.data.response,
          selected_date: parsed.data.selected_date || null,
          selected_time_slot: parsed.data.selected_time_slot || null,
          selected_food: parsed.data.selected_food || null,
          selected_location: parsed.data.selected_location || null,
        })
        .select()
        .single();
      responseData = data;
      respError = error;
    }

    if (respError) {
      return NextResponse.json(
        { error: 'Failed to save response' },
        { status: 500 }
      );
    }

    // Update invitation status to 'responded'
    await supabase
      .from('invitations')
      .update({ status: 'responded' })
      .eq('id', invitation.id);

    return NextResponse.json(responseData, { status: existingResponse ? 200 : 201 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
