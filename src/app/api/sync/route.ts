import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/encryption";
import { fetchOpenAIUsage } from "@/lib/api-clients/openai";
import { subDays } from "date-fns";

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
    const { provider_id } = body;

    if (!provider_id) {
      return NextResponse.json(
        { error: "Provider ID is required" },
        { status: 400 }
      );
    }

    // Get provider details
    const { data: provider, error: providerError } = await supabase
      .from("api_providers")
      .select("*")
      .eq("id", provider_id)
      .eq("user_id", user.id)
      .single();

    if (providerError || !provider) {
      return NextResponse.json(
        { error: "Provider not found" },
        { status: 404 }
      );
    }

    // Decrypt API key
    const apiKey = decrypt(provider.api_key_encrypted);

    // Fetch usage data based on provider
    const endDate = new Date();
    const startDate = subDays(endDate, 30);

    let usageData: Array<{
      date: string;
      requests: number;
      tokens?: number;
      cost: number;
    }> = [];

    switch (provider.provider_name.toLowerCase()) {
      case "openai":
        usageData = await fetchOpenAIUsage(apiKey, startDate, endDate);
        break;
      case "anthropic":
        // Anthropic usage API not yet available
        break;
      default:
        // Custom providers would need manual tracking
        break;
    }

    // Insert usage data
    if (usageData.length > 0) {
      const usageLogs = usageData.map((u) => ({
        provider_id,
        date: u.date,
        requests_count: u.requests,
        tokens_used: u.tokens || null,
        cost_usd: u.cost,
      }));

      // Upsert to handle duplicates
      const { error: insertError } = await supabase
        .from("usage_logs")
        .upsert(usageLogs, {
          onConflict: "provider_id,date",
          ignoreDuplicates: false,
        });

      if (insertError) {
        console.error("Error inserting usage logs:", insertError);
      }
    }

    // Update last_synced_at
    await supabase
      .from("api_providers")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", provider_id);

    return NextResponse.json({
      success: true,
      records_synced: usageData.length,
    });
  } catch (error) {
    console.error("Error syncing provider:", error);
    return NextResponse.json(
      { error: "Failed to sync provider" },
      { status: 500 }
    );
  }
}
