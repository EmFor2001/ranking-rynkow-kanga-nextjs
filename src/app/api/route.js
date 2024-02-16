export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const res = await fetch(`https://public.kanga.exchange/api/market/depth/${searchParams.get('name')}`)
  const data = await res.json()

  return Response.json( data )
}