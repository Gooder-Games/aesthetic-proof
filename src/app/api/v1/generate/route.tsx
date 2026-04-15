import { ImageResponse } from "@vercel/og";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { z } from "zod";

export const runtime = "edge";

// --- Input validation schema ---
const stylesSchema = z.object({
  cardBackground: z.string().max(100).optional(),
  textColor: z.string().max(50).optional(),
  secondaryTextColor: z.string().max(50).optional(),
  accentColor: z.string().max(50).optional(),
  borderColor: z.string().max(100).optional(),
  borderRadius: z.string().max(20).optional(),
  elevation: z.number().int().min(0).max(3).optional(),
}).optional().default({});

const generateSchema = z.object({
  name: z.string().min(1).max(100),
  handle: z.string().max(100).optional(),
  avatar_url: z.string().url().max(2048).optional(),
  text: z.string().min(1).max(1000),
  rating: z.number().int().min(1).max(5),
  theme: z.enum(["dark", "light", "transparent"]).optional().default("light"),
  compact: z.boolean().optional().default(false),
  preset: z.enum(["midnight", "frost", "sunset", "minimal"]).optional(),
  styles: stylesSchema,
});

export async function POST(request: Request) {
  try {
    // 1. Parse and validate input
    const rawBody = await request.json();
    const parseResult = generateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation Error",
          details: parseResult.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { name, handle, avatar_url, text, rating, theme, compact, preset, styles } = parseResult.data;

    // 2. Get the authenticated user ID (injected by middleware)
    const reqHeaders = await headers();
    const userId = reqHeaders.get("x-user-id");

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Deduct one credit atomically
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: deductResult, error: deductError } = await supabaseAdmin.rpc(
      "decrement_credit",
      { user_id_param: userId }
    );

    if (deductError) {
      console.error("Credit deduction error:", deductError);
      return new Response(
        JSON.stringify({ error: "Failed to deduct credit" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // If the RPC returned false, the user had 0 credits (race condition guard)
    if (deductResult === false) {
      return new Response(
        JSON.stringify({ error: "Insufficient credits" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Define UI Styling Engine
    const isDark = theme === "dark";
    const isTransparent = theme === "transparent";

    // Preset Definitions
    const presets: Record<string, any> = {
      midnight: {
        cardBg: "rgba(17, 24, 39, 0.95)",
        textColor: "#ffffff",
        secondaryTextColor: "rgba(255, 255, 255, 0.6)",
        accentColor: "#6366f1",
        borderColor: "rgba(99, 102, 241, 0.4)",
        radius: "32px",
      },
      frost: {
        cardBg: "rgba(255, 255, 255, 0.8)",
        textColor: "#111827",
        secondaryTextColor: "#4b5563",
        accentColor: "#3b82f6",
        borderColor: "rgba(255, 255, 255, 0.6)",
        radius: "20px",
      },
      sunset: {
        cardBg: "rgba(255, 255, 255, 0.98)",
        textColor: "#1f2937",
        secondaryTextColor: "#6b7280",
        accentColor: "#f43f5e",
        borderColor: "rgba(244, 63, 94, 0.2)",
        radius: "40px",
      },
      minimal: {
        cardBg: isDark ? "#000000" : "#ffffff",
        textColor: isDark ? "#ffffff" : "#000000",
        secondaryTextColor: isDark ? "#9ca3af" : "#4b5563",
        accentColor: isDark ? "#ffffff" : "#000000",
        borderColor: isDark ? "#374151" : "#e5e7eb",
        radius: "0px",
      }
    };

    // Merge Preset -> Defaults -> Custom Styles
    const selectedPreset = (preset && presets[preset as keyof typeof presets]) ? presets[preset as keyof typeof presets] : {};
    const config = {
      cardBg: styles.cardBackground || selectedPreset.cardBg || (isDark ? "rgba(17, 24, 39, 0.85)" : "rgba(255, 255, 255, 0.95)"),
      textColor: styles.textColor || selectedPreset.textColor || (isDark ? "#ffffff" : "#111827"),
      secondaryTextColor: styles.secondaryTextColor || selectedPreset.secondaryTextColor || (isDark ? "rgba(255, 255, 255, 0.6)" : "#6b7280"),
      accentColor: styles.accentColor || selectedPreset.accentColor || "#fbbf24",
      borderColor: styles.borderColor || selectedPreset.borderColor || (isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"),
      radius: styles.borderRadius || selectedPreset.radius || "24px",
      elevation: styles.elevation !== undefined ? styles.elevation : (isTransparent ? 1 : 2),
    };

    // Adjust dimensions for compact mode
    const imgWidth = compact ? 840 : 1200;
    const imgHeight = compact ? 460 : 630;

    // Shadow depth mapping
    const shadows = [
      "none",
      "0 4px 12px rgba(0, 0, 0, 0.1)",
      "0 10px 30px -5px rgba(0, 0, 0, 0.15)",
      "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
    ];

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            ...(isTransparent ? {} : {
              backgroundColor: isDark ? "#030712" : "#f9fafb",
              backgroundImage: isDark
                ? "radial-gradient(circle at 25% 25%, #4f46e5 0%, transparent 50%), radial-gradient(circle at 75% 75%, #9333ea 0%, transparent 50%)"
                : "radial-gradient(circle at 25% 25%, #e0e7ff 0%, transparent 50%), radial-gradient(circle at 75% 75%, #f3e8ff 0%, transparent 50%)",
            })
          }}
        >
          {/* Main Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "800px",
              padding: "40px",
              borderRadius: config.radius,
              backgroundColor: config.cardBg,
              border: config.borderColor.includes(" ") ? config.borderColor : `1px solid ${config.borderColor}`,
              boxShadow: shadows[config.elevation as number],
            }}
          >
            {/* Header: Avatar + Info */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
              <img
                src={avatar_url || `https://api.dicebear.com/7.x/avataaars/png?seed=${encodeURIComponent(name)}`}
                width="80"
                height="80"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: config.radius === "0px" ? "0px" : "40px",
                  border: `3px solid ${config.borderColor}`,
                  marginRight: "24px",
                  objectFit: "cover",
                }}
                alt="avatar"
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: config.textColor,
                    marginBottom: "2px",
                  }}
                >
                  {name}
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    color: config.secondaryTextColor,
                  }}
                >
                  @{handle || name.toLowerCase().replace(/\s/g, "")}
                </span>
              </div>
            </div>

            {/* Review Content */}
            <div
              style={{
                display: "flex",
                fontSize: "32px",
                fontWeight: "500",
                lineHeight: "1.4",
                color: config.textColor,
                marginBottom: "30px",
              }}
            >
              &ldquo;{text}&rdquo;
            </div>

            {/* Rating Stars */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill={i < rating ? config.accentColor : isDark ? "#374151" : "#e5e7eb"}
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </div>

          {/* Branding (shrunk for compact) */}
          {!compact && (
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
               <div style={{ width: "16px", height: "16px", backgroundColor: config.accentColor, borderRadius: "3px" }} />
               <span style={{ fontSize: "14px", fontWeight: "bold", color: config.secondaryTextColor }}>
                  Generated by Aesthetic Proof
               </span>
            </div>
          )}
        </div>
      ),
      {
        width: imgWidth,
        height: imgHeight,
      }
    );
  } catch (err: any) {
    console.error("API Generation Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
