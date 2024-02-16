import DataSheet from "@/components/DataSheet";

export default async function Home() {
  const pairs = await fetch(
    "https://public.kanga.exchange/api/market/pairs"
  ).then((res) => res.json());

  const summary = await fetch(
    "https://public.kanga.exchange/api/market/summary"
  ).then((res) => res.json());

  return (
    <main>
      <DataSheet pairs={pairs} summary={summary.summary} />
    </main>
  );
}
