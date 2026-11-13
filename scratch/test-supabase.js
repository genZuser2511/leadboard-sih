
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_ANON_KEY not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  console.log('Checking connection to:', supabaseUrl);
  try {
    const { data, error, count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Connection failed! Error:', error.message);
      process.exit(1);
    }

    console.log('Connection successful!');
    console.log('Total leads in database:', count);
  } catch (err) {
    console.error('An unexpected error occurred:', err.message);
    process.exit(1);
  }
}

checkConnection();
