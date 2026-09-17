const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://kpmgzzurgvaupsksahog.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwbWd6enVyZ3ZhdXBza3NhaG9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc4MjUyNSwiZXhwIjoyMDkyMzU4NTI1fQ.tnZYCa26WfuGhN5FstijCe8dEz05XyLu__cUhE8Uhj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('harvests').insert({
    tank_id: '00000000-0000-0000-0000-000000000000',
    harvest_qty: 100,
    count_per_kg: 50,
    price_per_kg: 200,
    total_revenue: 20000,
    harvest_type: 'partial',
    harvest_date: '2026-07-22',
    user_id: 'f66fc34c-68de-4841-8f5b-11c504a1b023',
    buyer_name: null,
    notes: null
  });
  if (error) {
    console.error('Supabase Error:', error);
  } else {
    console.log('Inserted Data:', data);
  }
}
test();
