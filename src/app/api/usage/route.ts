import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { subDays, format, startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const providerId = searchParams.get("provider_id");

    // Calculate date range
    let startDate: Date;
    let endDate = new Date();

    switch (period) {
      case "7d":
        startDate = subDays(endDate, 7);
        break;
      case "30d":
        startDate = subDays(endDate, 30);
        break;
      case "this_month":
        startDate = startOfMonth(endDate);
        endDate = endOfMonth(endDate);
        break;
      case "last_month":
        const lastMonth = subMonths(endDate, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        break;
      default:
        startDate = subDays(endDate, 30);
    }

    // Get user's providers first
    const { data: providers } = await supabase
      .from("api_providers")
      .select("id")
      .eq("user_id", user.id);

    if (!providers || providers.length === 0) {
      return NextResponse.json({
        usage: [],
        summary: {
          totalCost: 0,
          totalRequests: 0,
          avgDailyCost: 0,
        },
      });
    }

    const providerIds = providers.map((p) => p.id);

    // Build query
    let query = supabase
      .from("usage_logs")
      .select("*, api_providers(provider_name)")
      .in("provider_id", providerIds)
      .gte("date", format(startDate, "yyyy-MM-dd"))
      .lte("date", format(endDate, "yyyy-MM-dd"))
      .order("date", { ascending: true });

    if (providerId) {
      query = query.eq("provider_id", providerId);
    }

    const { data: usage, error } = await query;

    if (error) throw error;

    // Calculate summary
    const totalCost = usage?.reduce((sum, u) => sum + Number(u.cost_usd), 0) || 0;
    const totalRequests = usage?.reduce((sum, u) => sum + u.requests_count, 0) || 0;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const avgDailyCost = days > 0 ? totalCost / days : 0;

    return NextResponse.json({
      usage,
      summary: {
        totalCost,
        totalRequests,
        avgDailyCost,
      },
    });
  } catch (error) {
    console.error("Error fetching usage:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 }
    );
  }
}
