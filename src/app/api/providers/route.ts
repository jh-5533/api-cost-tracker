import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { encrypt, decrypt, maskApiKey } from "@/lib/encryption";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: providers, error } = await supabase
      .from("api_providers")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Mask API keys before sending to client
    const maskedProviders = providers?.map((provider) => ({
      ...provider,
      api_key_masked: maskApiKey(decrypt(provider.api_key_encrypted)),
      api_key_encrypted: undefined,
    }));

    return NextResponse.json({ providers: maskedProviders });
  } catch (error) {
    console.error("Error fetching providers:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { provider_name, api_key } = body;

    if (!provider_name || !api_key) {
      return NextResponse.json(
        { error: "Provider name and API key are required" },
        { status: 400 }
      );
    }

    // Check provider limit for free tier
    const { data: userData } = await supabase
      .from("users")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    if (userData?.subscription_tier === "free") {
      const { count } = await supabase
        .from("api_providers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (count && count >= 2) {
        return NextResponse.json(
          { error: "Free tier limited to 2 providers. Upgrade to Pro for unlimited." },
          { status: 403 }
        );
      }
    }

    // Encrypt API key
    const api_key_encrypted = encrypt(api_key);

    const { data: provider, error } = await supabase
      .from("api_providers")
      .insert({
        user_id: user.id,
        provider_name,
        api_key_encrypted,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      provider: {
        ...provider,
        api_key_masked: maskApiKey(api_key),
        api_key_encrypted: undefined,
      },
    });
  } catch (error) {
    console.error("Error creating provider:", error);
    return NextResponse.json(
      { error: "Failed to create provider" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Provider ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("api_providers")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting provider:", error);
    return NextResponse.json(
      { error: "Failed to delete provider" },
      { status: 500 }
    );
  }
}
