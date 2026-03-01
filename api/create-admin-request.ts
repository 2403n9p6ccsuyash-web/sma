import { supabaseAdmin } from "./_utils.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, full_name, society_id } = req.body;

  if (!email || !full_name || !society_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { error } = await supabaseAdmin
      .from("admin_requests")
      .insert({
        email,
        full_name,
        society_id,
        status: "pending",
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: "Admin request submitted",
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}