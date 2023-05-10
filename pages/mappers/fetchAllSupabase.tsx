import { supabase } from "../../lib/supabaseConnector";

export const fetchSupabase = async () => {

  let { data, error } = await supabase
    .from('teachers')
    .select('*')

  if (error) return error.message;
  return data
};