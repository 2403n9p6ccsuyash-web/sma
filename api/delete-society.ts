import { supabaseAdmin } from "./_utils";

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { societyId } = req.body;

    if (!societyId) {
        return res.status(400).json({ error: "Missing societyId" });
    }

    try {
        // 1️⃣ Delete all profiles linked to this society
        await supabaseAdmin
            .from("profiles")
            .delete()
            .eq("society_id", societyId);

        // 2️⃣ Delete the society itself
        const { error } = await supabaseAdmin
            .from("societies")
            .delete()
            .eq("id", societyId);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({
            success: true,
            message: "Society deleted successfully",
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
