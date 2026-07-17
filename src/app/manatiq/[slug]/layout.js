import { manatiq as manatiqDefault } from '@/data/manatiq';

export function generateStaticParams() {
  return manatiqDefault.map((m) => ({ slug: m.slug }));
}

export default function ManatiqLayout({ children }) {
  return children;
}
