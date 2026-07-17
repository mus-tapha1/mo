import { lotissements as lotissementsDefault } from '@/data/lotissements';

export function generateStaticParams() {
  return lotissementsDefault.map((l) => ({ slug: l.slug }));
}

export default function LotissementLayout({ children }) {
  return children;
}
