import { getAccessToken, getRefreshToken, setAuthCookies, clearAuthCookies } from "@/lib/serverAuth";

async function rawFetch(path, options, token) {
  return fetch(`${process.env.BACKEND_API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export async function backendFetch(path, options = {}) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { ok: false, status: 401, data: { detail: "Not authenticated" } };
  }

  let res = await rawFetch(path, options, accessToken);

  if (res.status === 401) {
    const newAccessToken = await tryRefresh();
    if (newAccessToken) {
      res = await rawFetch(path, options, newAccessToken);
    }
  }

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function tryRefresh() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    await clearAuthCookies();
    return null;
  }

  const data = await res.json();
  // Rotation: both tokens change on every refresh, must update both cookies
  await setAuthCookies(data.access_token, data.refresh_token);
  return data.access_token;
}