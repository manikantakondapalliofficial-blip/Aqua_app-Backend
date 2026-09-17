const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testUpload() {
  console.log('Testing upload...');
  
  // 1. Check if bucket exists
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
    console.error('Error listing buckets:', bucketError.message);
    return;
  }
  
  const hasMedia = buckets.some(b => b.name === 'media');
  if (!hasMedia) {
    console.log('Bucket "media" does not exist! I will try to create it...');
    const { error: createError } = await supabase.storage.createBucket('media', {
      public: true
    });
    if (createError) {
      console.error('Failed to create bucket:', createError.message);
      return;
    }
    console.log('Bucket "media" created successfully!');
  } else {
    console.log('Bucket "media" already exists.');
  }

  // 2. Test upload
  const testBuffer = Buffer.from('hello world');
  const { data, error } = await supabase.storage
    .from('media')
    .upload('test.txt', testBuffer, { upsert: true });
    
  if (error) {
    console.error('Upload failed:', error.message);
  } else {
    console.log('Upload succeeded!', data);
  }
}

testUpload();
