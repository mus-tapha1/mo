import { properties as propertiesDefault } from '@/data/properties';

export function generateStaticParams() {
  return propertiesDefault.map((p) => ({ id: p.id }));
}

export default function PropertyLayout({ children }) {
  return children;
}
