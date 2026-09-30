import { Gamepad2, Headphones, Smartphone, Usb, Watch } from "lucide-react";

const icons = { smartphone: Smartphone, headphones: Headphones, gamepad: Gamepad2, watch: Watch, usb: Usb } as const;

export function CategoryCard({ name, icon, tone }: { name: string; icon: keyof typeof icons; tone: string }) {
  const Icon = icons[icon];
  return <a href="#mais-vendidos" className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${tone} p-5 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl`}>
    <div className="absolute -right-7 -top-7 h-24 w-24 rounded-full bg-white/10" />
    <Icon size={28} />
    <p className="mt-8 text-base font-bold">{name}</p>
    <p className="mt-1 text-xs text-white/70">Explorar produtos</p>
  </a>;
}