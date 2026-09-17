const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://kpmgzzurgvaupsksahog.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwbWd6enVyZ3ZhdXBza3NhaG9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc4MjUyNSwiZXhwIjoyMDkyMzU4NTI1fQ.tnZYCa26WfuGhN5FstijCe8dEz05XyLu__cUhE8Uhj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('harvests').select('*').limit(1);
  if (error) {
    console.error('Supabase Error:', error);
  } else {
    console.log('Data:', data);
  }
}
test();
