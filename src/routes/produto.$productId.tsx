import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Star, Truck } from "lucide-react";
import { products } from "../data/products";

export const Route = createFileRoute("/produto/$productId")({ component: ProductDetail });

function ProductDetail() {
  const { productId } = Route.useParams();
  const navigate = useNavigate();
  const product = products.find(item => item.id === productId);
  const [photo, setPhoto] = useState(0);
  const [color, setColor] = useState("Preto");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const gallery = useMemo(() => [product?.image, product?.image, product?.image].filter(Boolean) as string[], [product]);
  const money = (value: number) => `R$ ${value.toFixed(2).replace(".", ",")}`;

  if (!product) return <div className="min-h-screen bg-slate-50 px-4 py-16 text-center"><h1 className="text-3xl font-black">Produto não encontrado</h1><Link to="/" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Voltar à loja</Link></div>;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("nexotech-cart") || "{}");
    localStorage.setItem("nexotech-cart", JSON.stringify({ ...cart, [product.id]: (cart[product.id] || 0) + quantity }));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return <div className="min-h-screen bg-[#f6f7f9] text-slate-950">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link to="/" className="text-xl font-black">NEXO<span className="text-blue-600">TECH</span></Link><Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"><ArrowLeft size={16}/> Voltar à loja</Link></div></header>
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button onClick={() => navigate({ to: "/" })} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950"><ArrowLeft size={16}/> Continuar comprando</button>
      <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-[88px_1fr]">
          <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">{gallery.map((image,index)=><button key={index} onClick={()=>setPhoto(index)} className={`overflow-hidden rounded-xl border-2 ${photo===index ? "border-blue-600" : "border-slate-200"}`}><img src={image} alt={`${product.name} foto ${index+1}`} className="h-20 w-20 object-cover"/></button>)}</div>
          <div className="relative order-1 overflow-hidden rounded-2xl bg-slate-100 sm:order-2"><img src={gallery[photo]} alt={product.name} className="aspect-square w-full object-cover"/><button onClick={()=>setPhoto((photo-1+gallery.length)%gallery.length)} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow"><ChevronLeft size={20}/></button><button onClick={()=>setPhoto((photo+1)%gallery.length)} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 shadow"><ChevronRight size={20}/></button></div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">{product.category}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-2"><Star size={17} className="fill-amber-400 text-amber-400"/><span className="font-bold">{product.rating}</span><span className="text-sm text-slate-400">({product.reviews} avaliações)</span></div>
          <div className="mt-6"><p className="text-sm text-slate-400 line-through">{money(product.oldPrice)}</p><p className="text-4xl font-black">{money(product.price)}</p><p className="mt-1 text-sm font-bold text-emerald-600">12x sem juros</p></div>
          <div className="mt-7"><p className="text-sm font-black">Cor: <span className="font-semibold text-slate-600">{color}</span></p><div className="mt-3 flex flex-wrap gap-2">{["Preto","Branco","Azul"].map(item=><button key={item} onClick={()=>setColor(item)} className={`rounded-xl border px-4 py-2.5 text-sm font-bold ${color===item ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700"}`}>{item}</button>)}</div></div>
          <div className="mt-6"><p className="text-sm font-black">Quantidade</p><div className="mt-3 inline-flex items-center rounded-xl border border-slate-200 bg-white"><button onClick={()=>setQuantity(Math.max(1,quantity-1))} className="grid h-11 w-11 place-items-center hover:bg-slate-50"><Minus size={17}/></button><span className="w-12 text-center text-sm font-black">{quantity}</span><button onClick={()=>setQuantity(quantity+1)} className="grid h-11 w-11 place-items-center hover:bg-slate-50"><Plus size={17}/></button></div></div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2"><button onClick={addToCart} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white hover:bg-blue-600"><ShoppingBag size={18}/>{added ? "Adicionado!" : "Adicionar ao carrinho"}</button><button onClick={()=>{addToCart(); navigate({to:"/checkout"});}} className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-black hover:border-slate-400">Comprar agora</button></div>
          <div className="mt-7 grid gap-3 border-t border-slate-100 pt-6 text-sm"><div className="flex items-center gap-3"><Truck size={18} className="text-blue-600"/><span><strong>Envio rápido</strong> com rastreio</span></div><div className="flex items-center gap-3"><Check size={18} className="text-emerald-600"/><span><strong>Compra segura</strong> e suporte NexoTech</span></div></div>
        </div>
      </div>
    </main>
  </div>;
}
