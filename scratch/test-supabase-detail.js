
const { createClient } = require('@supabase/supabase-js');

// Load env vars from the file manually since we don't have dotenv
const fs = require('fs');
const path = require('path');
const dotenvPath = path.join(__dirname, '..', '.env');
const env = fs.readFileSync(dotenvPath, 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, ...value] = line.split('=');
    if (key && value) acc[key.trim().replace(/^#\s*/, '')] = value.join('=').trim();
    return acc;
  }, {});

const supabaseUrl = env.SUPABASE_URL;
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Required Supabase variables not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkConnection() {
  console.log('--- Supabase Connection Check ---');
  console.log('Project URL:', supabaseUrl);
  
  try {
    // 1. Check if we can reach the API
    console.log('Testing general API reachability...');
    const { data: health, error: healthError } = await supabase.from('_non_existent_table_').select('*').limit(1);
    
    // If it's a 404 (table not found), it means the connection is working but the table is missing.
    // If it's a network error or 401/403, the credentials/connection are broken.
    
    if (healthError && healthError.code !== '42P01') { // 42P01 is Postgres "undefined_table"
         console.log('Credentials/Connection Error:', healthError.message);
         process.exit(1);
    }
    console.log('✓ API reachable and credentials accepted.');

    // 2. Check for 'leads' table
    console.log('Checking for "leads" table...');
    const { data, error, count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (error) {
      if (error.code === '42P01') {
        console.error('❌ Table "leads" DOES NOT EXIST in this Supabase project.');
      } else {
        console.error('❌ Error querying "leads" table:', error.message);
      }
      process.exit(1);
    }

    console.log('✅ Table "leads" exists!');
    console.log('📊 Total rows in "leads":', count);
    
    if (count === 0) {
      console.log('ℹ️ Note: The table is currently EMPTY.');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    process.exit(1);
  }
}

checkConnection();
