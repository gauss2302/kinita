import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req.headers);
  const { pathname } = req.nextUrl;

  // Публичные маршруты, которые не требуют авторизации
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/create-company", // Страница создания компании
    "/register-company", // Страница регистрации компании
    "/api/auth", // API маршруты аутентификации
  ];

  // Проверяем, является ли маршрут публичным
  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`) ||
      pathname.startsWith("/api/auth")
  );

  // Если маршрут публичный, пропускаем
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Защищенные маршруты - требуют авторизации
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/jobs",
    "/admin",
    "/settings",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Если пользователь не авторизован и пытается зайти на защищенный маршрут
  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Если пользователь авторизован и пытается зайти на страницы входа/регистрации
  if (sessionCookie && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
