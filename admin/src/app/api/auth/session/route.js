import { setAuthCookies, getRefreshToken, clearAuthCookies } from "@/lib/serverAuth";

export async function POST(request) {
  const body = await request.json();

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  await setAuthCookies(data.access_token, data.refresh_token);
  return Response.json({ status: "ok" });
}

export async function DELETE() {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(() => {});
  }

  await clearAuthCookies();
  return Response.json({ status: "ok" });
}