import { Gamepad2, Headphones, Smartphone, Usb, Watch } from "lucide-react";
const icons = { smartphone: Smartphone, headphones: Headphones, gamepad: Gamepad2, watch: Watch, usb: Usb } as const;

export function CategoryCard({ name, icon, tone, onSelect }: { name: string; icon: keyof typeof icons; tone: string; onSelect?: (name: string) => void }) {
  const Icon = icons[icon];
  return <button onClick={() => onSelect?.(name)} className={`group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br ${tone} p-5 text-left text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}><div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-white/10" /><Icon size={28} /><p className="mt-8 text-base font-bold">{name}</p><p className="mt-1 text-xs text-white/70">Explorar produtos</p></button>;
}