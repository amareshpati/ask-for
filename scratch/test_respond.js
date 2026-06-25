const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ozphszvrteudfkraecvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cGhzenZydGV1ZGZrcmFlY3ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTk5MjAsImV4cCI6MjA5Nzk3NTkyMH0._RsuLxkxshGLiyhvJslvpWBMtYkV4BLMHS8SiWofiII';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Querying active invitations...');
  const { data: invites, error: inviteErr } = await supabase
    .from('invitations')
    .select('id, unique_slug')
    .limit(5);

  if (inviteErr) {
    console.error('Failed to fetch invitations:', inviteErr);
    return;
  }

  const invite = invites[0];
  console.log(`Using invitation: ${invite.id} (slug: ${invite.unique_slug})`);

  const { data: existing } = await supabase
    .from('invitation_responses')
    .select('id')
    .eq('invitation_id', invite.id)
    .maybeSingle();

  if (existing) {
    console.log(`Testing update with select().single() on response ID: ${existing.id}...`);
    const { data, error } = await supabase
      .from('invitation_responses')
      .update({
        response: 'maybe',
        selected_food: 'Pizza',
        selected_location: 'Restaurant',
      })
      .eq('id', existing.id)
      .select()
      .single();

    console.log('Error details:', error);
    console.log('Data:', data);
  } else {
    console.log('No existing response to test update.');
  }
}

run();
