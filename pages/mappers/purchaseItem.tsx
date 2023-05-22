import { supabase } from "../../lib/supabaseConnector";

export const purchaseItem = async (id: String, name: String, user: String) => {

    const { data, error } = await supabase
        .from('transaction_items')
        .insert([
            { product_name: name, product_id: id, user_token: user },
        ])
}