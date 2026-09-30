import { Gamepad2, Headphones, Smartphone, Usb, Watch } from "lucide-react";
const icons = { smartphone: Smartphone, headphones: Headphones, gamepad: Gamepad2, watch: Watch, usb: Usb } as const;

type Props = { name: string; icon: keyof typeof icons; tone: string; image: string; onSelect?: (name: string) => void };

export function CategoryCard({ name, icon, tone, image, onSelect }: Props) {
  const Icon = icons[icon];
  return <button onClick={() => onSelect?.(name)} className="group relative min-h-48 w-full overflow-hidden rounded-2xl text-left text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
    <img src={image} alt={name} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110" />
    <div className={`absolute inset-0 bg-gradient-to-br ${tone} opacity-80 transition group-hover:opacity-70`} />
    <div className="relative flex h-full min-h-48 flex-col justify-end p-5">
      <div className="mb-auto grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur"><Icon size={22} /></div>
      <p className="text-base font-black">{name}</p><p className="mt-1 text-xs font-medium text-white/75">Explorar produtos</p>
    </div>
  </button>;
}