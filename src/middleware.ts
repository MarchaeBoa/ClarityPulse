import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

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
                                  supabaseResponse = NextResponse.next({ request });
                                  cookiesToSet.forEach(({ name, value, options }) =>
                                                supabaseResponse.cookies.set(name, value, options)
                                                                 );
                      },
            },
    }
      );

  const {
        data: { user },
  } = await supabase.auth.getUser();

  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
    const isAuthPage =
          request.nextUrl.pathname === "/login" ||
          request.nextUrl.pathname === "/signup" ||
          request.nextUrl.pathname === "/forgot-password";
    const isPricingPage = request.nextUrl.pathname === "/pricing";

  // Protected routes: redirect to login if not authenticated
  if (!user && isDashboard) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirectTo", request.nextUrl.pathname);
        return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (user && isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
  }

  // Check subscription for dashboard access
  if (user && isDashboard) {
        // Fetch user's subscription status from Supabase
      const { data: subscription } = await supabase
          .from("subscriptions")
          .select("status, plan_slug, trial_ends_at")
          .eq("user_id", user.id)
          .single();

      const hasActiveSubscription =
              subscription &&
              (subscription.status === "active" ||
                       subscription.status === "trialing");

      // If no active subscription, redirect to pricing page
      if (!hasActiveSubscription) {
              const url = request.nextUrl.clone();
              url.pathname = "/pricing";
              url.searchParams.set("reason", "subscription_required");
              return NextResponse.redirect(url);
      }
  }

  return supabaseResponse;
}

export const config = {
    matcher: [
          /*
           * Match all request paths except for the ones starting with:
           * - _next/static (static files)
           * - _next/image (image optimization files)
           * - favicon.ico (favicon file)
           * - public assets
           */
      "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js)$).*)",
        ],
};
