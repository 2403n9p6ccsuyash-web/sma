import { supabaseAdmin } from "./_utils";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { societyId, status } = req.body;

  if (!societyId || !status) {
    return res.status(400).json({ error: "Missing societyId or status" });
  }

  try {
    const { error } = await supabaseAdmin
      .from("societies")
      .update({ status })
      .eq("id", societyId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: "Society status updated",
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}