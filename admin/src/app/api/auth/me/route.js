import { backendFetch } from "@/lib/backendFetch";

export async function GET() {
  const result = await backendFetch("/api/v1/auth/me");
  return Response.json(result.data, { status: result.status });
}