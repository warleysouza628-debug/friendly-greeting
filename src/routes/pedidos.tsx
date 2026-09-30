import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock3, Package, Truck, MapPin, CircleDot } from "lucide-react";

export const Route = createFileRoute("/pedidos")({ component: Orders });

type Order = {
  id:string; date:string; status:string; tracking:string;
  customer:{name:string;email:string;address:string;city:string;zip:string};
  items:{productId:string;name:string;image:string;quantity:number;price:number}[];
  total:number;
};

function Orders() {
  const [orders,setOrders] = useState<Order[]>([]);
  useEffect(() => { try { setOrders(JSON.parse(localStorage.getItem("nexotech-orders") || "[]")); } catch { setOrders([]); } }, []);
  const money=(v:number)=>`R$ ${v.toFixed(2).replace(".",",")}`;
  const steps=["Pagamento aprovado","Em preparação","Enviado","Entregue"];

  return <div className="min-h-screen bg-slate-50 text-slate-950"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5"><Link to="/" className="text-xl font-black">NEXO<span className="text-blue-600">TECH</span></Link><Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600"><ArrowLeft size={16}/> Voltar à loja</Link></div></header>
    <main className="mx-auto max-w-5xl px-4 py-10"><div><p className="text-xs font-black uppercase tracking-[.2em] text-blue-600">Área do cliente</p><h1 className="mt-2 text-3xl font-black">Meus pedidos</h1><p className="mt-2 text-sm text-slate-500">Acompanhe pagamento, preparação, envio e rastreio.</p></div>
      {!orders.length ? <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><Package className="mx-auto text-slate-300" size={46}/><h2 className="mt-5 text-xl font-black">Você ainda não tem pedidos</h2><p className="mt-2 text-sm text-slate-500">Quando finalizar uma compra, ela aparecerá aqui.</p><Link to="/" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Começar a comprar</Link></div> :
      <div className="mt-8 space-y-6">{orders.map(order => {
        const active = Math.max(0, steps.indexOf(order.status));
        return <article key={order.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pedido {order.id}</p><p className="mt-1 text-sm font-bold">{new Date(order.date).toLocaleDateString("pt-BR")} · {order.items.length} item(ns)</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700"><CheckCircle2 size={14}/> {order.status}</span></div>
          <div className="grid gap-6 p-5 lg:grid-cols-[1fr_280px]">
            <div><div className="grid grid-cols-4 gap-1">{steps.map((step,i)=><div key={step} className="text-center"><div className={`mx-auto grid h-9 w-9 place-items-center rounded-full ${i<=active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>{i===0?<CheckCircle2 size={17}/>:i===1?<Clock3 size={17}/>:i===2?<Truck size={17}/>:<MapPin size={17}/>}</div><p className="mt-2 text-[10px] font-bold leading-4 text-slate-500">{step}</p></div>)}</div>
              <div className="mt-7 space-y-3">{order.items.map(item=><div key={item.productId} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><img src={item.image} alt="" className="h-14 w-14 rounded-lg object-cover"/><div className="min-w-0 flex-1"><p className="text-sm font-bold">{item.name}</p><p className="text-xs text-slate-500">Quantidade: {item.quantity}</p></div><strong className="text-sm">{money(item.price*item.quantity)}</strong></div>)}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="flex items-center gap-2 text-sm font-black"><CircleDot size={17} className="text-blue-600"/> Rastreamento</p>{order.tracking ? <><p className="mt-4 text-xs text-slate-500">Código de rastreio</p><p className="mt-1 break-all rounded-lg bg-white px-3 py-2 text-sm font-black">{order.tracking}</p></> : <><p className="mt-4 text-sm font-bold text-slate-700">Código ainda não disponível</p><p className="mt-1 text-xs leading-5 text-slate-500">Assim que o pedido for aprovado e postado, o código de rastreio poderá ser informado aqui.</p></>}<div className="mt-5 border-t border-slate-200 pt-4"><p className="text-xs text-slate-500">Entrega para</p><p className="mt-1 text-xs font-bold">{order.customer.address}, {order.customer.city}</p><p className="mt-3 text-xs text-slate-500">Total</p><p className="mt-1 text-lg font-black">{money(order.total)}</p></div></div>
          </div>
        </article>;
      })}</div>}
    </main>
  </div>;
}