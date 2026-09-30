import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, CreditCard, LockKeyhole, MapPin, PackageCheck } from "lucide-react";
import { products } from "../data/products";

export const Route = createFileRoute("/checkout")({ component: Checkout });

type Cart = Record<string, number>;

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart>({});
  const [done, setDone] = useState(false);
  const [customer, setCustomer] = useState({ name: "", email: "", address: "", city: "", zip: "" });

  useEffect(() => { try { setCart(JSON.parse(localStorage.getItem("nexotech-cart") || "{}")); } catch { setCart({}); } }, []);
  const items = useMemo(() => Object.entries(cart).map(([id, quantity]) => { const product = products.find(p => p.id === id); return product ? { product, quantity } : null; }).filter(Boolean) as {product: typeof products[number]; quantity:number}[], [cart]);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal >= 199 ? 0 : 19.9;
  const total = subtotal + shipping;
  const money = (v:number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

  const finish = () => {
    if (!customer.name || !customer.email || !customer.address || !customer.city || !customer.zip || !items.length) return;
    const order = { id: `NX-${Date.now().toString().slice(-8)}`, date: new Date().toISOString(), status: "Pagamento aprovado", tracking: "", customer, items: items.map(i => ({ productId: i.product.id, name: i.product.name, image: i.product.image, quantity: i.quantity, price: i.product.price })), total };
    const orders = JSON.parse(localStorage.getItem("nexotech-orders") || "[]");
    localStorage.setItem("nexotech-orders", JSON.stringify([order, ...orders]));
    localStorage.removeItem("nexotech-cart");
    setDone(true);
  };

  if (done) return <div className="min-h-screen bg-slate-50"><div className="mx-auto max-w-2xl px-4 py-16 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 size={34}/></div><h1 className="mt-6 text-3xl font-black">Pedido aprovado!</h1><p className="mt-3 text-slate-500">Seu pagamento foi registrado. O acompanhamento e o código de rastreio aparecerão em Meus pedidos assim que o pedido for postado.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/pedidos" className="rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white">Ver meus pedidos</Link><Link to="/" className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold">Continuar comprando</Link></div></div></div>;

  if (!items.length) return <div className="min-h-screen bg-slate-50 px-4 py-16 text-center"><PackageCheck className="mx-auto text-slate-300" size={48}/><h1 className="mt-5 text-2xl font-black">Seu checkout está vazio</h1><p className="mt-2 text-slate-500">Adicione produtos antes de finalizar.</p><Link to="/" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Voltar à loja</Link></div>;

  return <div className="min-h-screen bg-slate-50 text-slate-950"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 py-5"><Link to="/" className="text-xl font-black">NEXO<span className="text-blue-600">TECH</span></Link><span className="flex items-center gap-2 text-xs font-bold text-slate-500"><LockKeyhole size={15}/> Checkout seguro</span></div></header>
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_380px]">
      <section className="space-y-5">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft size={16}/> Voltar à loja</Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><h1 className="text-2xl font-black">Finalizar compra</h1><p className="mt-1 text-sm text-slate-500">Preencha seus dados para registrar o pedido.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {([["name","Nome completo","Seu nome"],["email","E-mail","voce@email.com"],["zip","CEP","00000-000"],["city","Cidade","Sua cidade"],["address","Endereço","Rua, número e complemento"]] as const).map(([key,label,placeholder]) => <label key={key} className={key === "address" ? "sm:col-span-2" : ""}><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span><input value={customer[key]} onChange={e => setCustomer({...customer,[key]:e.target.value})} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"/></label>)}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><CreditCard size={20}/></div><div><p className="font-black">Pagamento</p><p className="text-xs text-slate-500">Pix, cartão ou outra forma configurada na loja.</p></div></div><div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">O pedido será registrado como <strong>Pagamento aprovado</strong> nesta versão. Para receber pagamentos reais, conecte um gateway como Mercado Pago, Stripe ou outro provedor.</div></div>
      </section>
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-6"><h2 className="text-lg font-black">Resumo do pedido</h2><div className="mt-5 space-y-4">{items.map(({product,quantity}) => <div key={product.id} className="flex gap-3"><img src={product.image} alt="" className="h-16 w-16 rounded-xl object-cover"/><div className="min-w-0 flex-1"><p className="text-sm font-bold">{product.name}</p><p className="text-xs text-slate-500">Qtd. {quantity}</p></div><strong className="text-sm">{money(product.price*quantity)}</strong></div>)}</div><div className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm"><div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between"><span className="text-slate-500">Frete</span><span>{shipping ? money(shipping) : "Grátis"}</span></div><div className="flex justify-between pt-2 text-lg font-black"><span>Total</span><span>{money(total)}</span></div></div><button onClick={finish} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white hover:bg-blue-600"><MapPin size={17}/> Confirmar pedido</button><p className="mt-3 text-center text-[11px] text-slate-400">Ao confirmar, você poderá acompanhar o pedido em Meus pedidos.</p></aside>
    </main>
  </div>;
}