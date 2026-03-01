import { supabaseAdmin } from "./_utils.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { requestId, password } = req.body;

  if (!requestId || !password) {
    return res.status(400).json({ error: "Missing requestId or password" });
  }

  try {
    // 1️⃣ Get admin request
    const { data: request, error: fetchError } = await supabaseAdmin
      .from("admin_requests")
      .select("*")
      .eq("id", requestId)
      .single();

    if (fetchError || !request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // 2️⃣ Create Auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: request.email,
        password: password.trim(),
        email_confirm: true,
      });

    if (authError) {
      return res.status(500).json({ error: authError.message });
    }

    // 3️⃣ Insert profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id,
        email: request.email,
        full_name: request.full_name,
        role: "admin",
        society_id: request.society_id,
        is_approved: true,
      });

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    // 4️⃣ Delete request
    await supabaseAdmin
      .from("admin_requests")
      .delete()
      .eq("id", requestId);

    return res.status(200).json({
      success: true,
      message: "Admin created successfully",
    });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}