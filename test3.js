const https = require('https');
const options = {
  hostname: 'kpmgzzurgvaupsksahog.supabase.co',
  port: 443,
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwbWd6enVyZ3ZhdXBza3NhaG9nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njc4MjUyNSwiZXhwIjoyMDkyMzU4NTI1fQ.tnZYCa26WfuGhN5FstijCe8dEz05XyLu__cUhE8Uhj0'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Columns:', Object.keys(parsed.definitions.harvests.properties));
    } catch (e) {
      console.error(e);
    }
  });
});
req.on('error', error => { console.error(error); });
req.end();
