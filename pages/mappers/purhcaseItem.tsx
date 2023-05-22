import { supabase } from "../../lib/supabaseConnector";

export const purchaseItem = async (id: String, name: String) => {

    const { data, error } = await supabase
        .from('transaction_items')
        .insert([
            { product_name: name, product_id: id },
        ])

        console.log('earaseasde')
        console.log(id, name)
        console.log(error)
}