import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { decrypt } from "@/lib/encryption";
import { fetchOpenAIUsage } from "@/lib/api-clients/openai";
import { subDays } from "date-fns";

// Use service role for cron (no user context)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all active providers
    const { data: providers, error } = await supabase
      .from("api_providers")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;

    const results = [];
    const endDate = new Date();
    const startDate = subDays(endDate, 7); // Sync last 7 days

    for (const provider of providers || []) {
      try {
        const apiKey = decrypt(provider.api_key_encrypted);
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
          // Add other providers as needed
        }

        if (usageData.length > 0) {
          const usageLogs = usageData.map((u) => ({
            provider_id: provider.id,
            date: u.date,
            requests_count: u.requests,
            tokens_used: u.tokens || null,
            cost_usd: u.cost,
          }));

          await supabase.from("usage_logs").upsert(usageLogs, {
            onConflict: "provider_id,date",
            ignoreDuplicates: false,
          });
        }

        await supabase
          .from("api_providers")
          .update({ last_synced_at: new Date().toISOString() })
          .eq("id", provider.id);

        results.push({
          provider_id: provider.id,
          provider_name: provider.provider_name,
          records_synced: usageData.length,
          status: "success",
        });
      } catch (error) {
        results.push({
          provider_id: provider.id,
          provider_name: provider.provider_name,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      providers_synced: results.length,
      results,
    });
  } catch (error) {
    console.error("Cron sync error:", error);
    return NextResponse.json(
      { error: "Cron sync failed" },
      { status: 500 }
    );
  }
}
