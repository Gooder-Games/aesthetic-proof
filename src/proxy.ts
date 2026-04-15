import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. API Protection (/api/v1/*)
  if (pathname.startsWith("/api/v1")) {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: Missing API Key" }, { status: 401 });
    }

    const apiKey = authHeader.split(" ")[1];

    // Use Service Role to bypass RLS for API key validation
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: keyData, error } = await supabaseAdmin
      .from("api_keys")
      .select("user_id, credits_left")
      .eq("key", apiKey)
      .single();

    if (error || !keyData) {
      return NextResponse.json({ error: "Unauthorized: Invalid API Key" }, { status: 401 });
    }

    if (keyData.credits_left <= 0) {
      return NextResponse.json({ error: "Forbidden: Insufficient Credits" }, { status: 403 });
    }

    // Pass the user_id to the request headers for the API route to use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", keyData.user_id);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 2. Standard Session Management (Auth & Dashboard)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes: redirect to login if not authenticated
  if (pathname.startsWith("/dashboard") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Auth routes: redirect to dashboard if already authenticated
  if ((pathname.startsWith("/login") || pathname.startsWith("/signup")) && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
