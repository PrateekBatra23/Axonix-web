export async function GET(request, { params }) {
  const { id } = await params;
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/jobs/${id}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}