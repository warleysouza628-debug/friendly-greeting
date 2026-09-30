export type Product = {
  id: string; name: string; category: string; price: number; oldPrice: number;
  rating: number; reviews: number; badge?: string; image: string;
};

export const categories = [
  { name: "Celulares & Acessórios", icon: "smartphone", tone: "from-slate-900 to-slate-700", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85" },
  { name: "Fones & Áudio", icon: "headphones", tone: "from-violet-600 to-indigo-600", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85" },
  { name: "Setup Gamer", icon: "gamepad", tone: "from-cyan-600 to-blue-700", image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1000&q=85" },
  { name: "Smartwatches", icon: "watch", tone: "from-emerald-600 to-teal-700", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=85" },
  { name: "Carregadores & Cabos", icon: "usb", tone: "from-amber-500 to-orange-600", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=85" },
] as const;

export const products: Product[] = [
  { id: "fone-pro", name: "Fone Bluetooth Pro ANC", category: "Fones & Áudio", price: 189.9, oldPrice: 249.9, rating: 4.9, reviews: 328, badge: "OFERTA", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85" },
  { id: "watch-active", name: "Smartwatch Active AMOLED", category: "Smartwatches", price: 229.9, oldPrice: 299.9, rating: 4.8, reviews: 241, badge: "MAIS VENDIDO", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=85" },
  { id: "keyboard", name: "Teclado Mecânico RGB 60%", category: "Setup Gamer", price: 159.9, oldPrice: 219.9, rating: 4.9, reviews: 186, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85" },
  { id: "mouse", name: "Mouse Wireless Ultra", category: "Setup Gamer", price: 119.9, oldPrice: 159.9, rating: 4.8, reviews: 154, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85" },
  { id: "speaker", name: "Caixa de Som Bluetooth Bass", category: "Fones & Áudio", price: 199.9, oldPrice: 279.9, rating: 4.8, reviews: 203, badge: "OFERTA", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85" },
  { id: "charger", name: "Carregador Turbo 65W GaN", category: "Carregadores & Cabos", price: 139.9, oldPrice: 179.9, rating: 4.9, reviews: 97, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=85" },
  { id: "cable", name: "Kit Cabo USB-C Reforçado", category: "Carregadores & Cabos", price: 49.9, oldPrice: 69.9, rating: 4.8, reviews: 112, badge: "OFERTA", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=85" },
  { id: "phone-case", name: "Capa Premium Antichoque", category: "Celulares & Acessórios", price: 59.9, oldPrice: 89.9, rating: 4.9, reviews: 89, image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=85" },
];