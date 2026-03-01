import { supabaseAdmin } from "./_utils";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, email, role } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    await supabaseAdmin.from("profiles").delete().eq("id", userId);

    if (email) {
      if (role === "resident") {
        await supabaseAdmin
          .from("resident_requests")
          .delete()
          .eq("email", email);
      } else if (role === "watchman") {
        await supabaseAdmin
          .from("watchman_requests")
          .delete()
          .eq("email", email);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}