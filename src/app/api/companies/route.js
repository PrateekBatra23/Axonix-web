export async function GET(request) {
  const { search } = new URL(request.url);
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/companies${search}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}