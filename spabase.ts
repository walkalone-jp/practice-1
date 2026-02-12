import { createClient } from '@supabase/supabase-js'
// データベースと相互作用するための単一のsupabaseクライアントを作成

const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL!,

  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

)
