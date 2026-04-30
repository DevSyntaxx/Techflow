import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log("Supabase URL loaded:", supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Atenção: Variáveis de ambiente do Supabase não encontradas. O banco de dados pode não funcionar corretamente.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

