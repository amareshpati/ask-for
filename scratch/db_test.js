const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ozphszvrteudfkraecvg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cGhzenZydGV1ZGZrcmFlY3ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzOTk5MjAsImV4cCI6MjA5Nzk3NTkyMH0._RsuLxkxshGLiyhvJslvpWBMtYkV4BLMHS8SiWofiII';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching join query...');
  const { data, error } = await supabase
    .from('invitations')
    .select('*, invitation_responses(*)');
  
  if (error) {
    console.error('Error fetching join:', error);
  } else {
    console.log('Join Result:', JSON.stringify(data, null, 2));
  }
}

run();
