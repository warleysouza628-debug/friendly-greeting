import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Aperture, AudioLines, Bell, Bot, ChevronDown, Clapperboard, Download, Film, FolderOpen, GalleryHorizontal, Grid2X2, Image as ImageIcon, Layers3, LayoutDashboard, Library, Loader2, Menu, MessageSquareText, Mic2, MoreHorizontal, Plus, Scissors, Search, Settings2, Sparkles, Upload, WandSparkles, X, Zap } from "lucide-react";

export const Route = createFileRoute("/")({ component: CreatorStudio });

type Mode = "text" | "image" | "frames" | "extend" | "edit";
const modes = [
  { id: "text" as Mode, label: "Texto para vídeo", icon: MessageSquareText, desc: "Transforme uma ideia em uma cena" },
  { id: "image" as Mode, label: "Imagem para vídeo", icon: ImageIcon, desc: "Anime uma imagem ou frame" },
  { id: "frames" as Mode, label: "Frames inicial/final", icon: GalleryHorizontal, desc: "Conecte dois momentos" },
  { id: "extend" as Mode, label: "Continuar vídeo", icon: Scissors, desc: "Estenda a ação naturalmente" },
  { id: "edit" as Mode, label: "Editar com IA", icon: WandSparkles, desc: "Edite usando linguagem natural" },
];
const presets = [
  ["História cinematográfica", "Gancho forte nos primeiros 2 segundos, narrativa visual contínua e final com reviravolta."],
  ["ASMR hiper-realista", "Câmera próxima, iluminação natural, sons ambientes realistas, textura física convincente."],
  ["História de desenho", "Animação 3D estilizada, personagens consistentes, expressões claras e ritmo de retenção."],
  ["Vídeo viral TikTok", "Formato vertical 9:16, gancho imediato, progressão visual e encerramento que gera curiosidade."],
];

function CreatorStudio() {
  const [mode, setMode] = useState<Mode>("text");
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState("9:16");
  const [duration, setDuration] = useState("8s");
  const [model, setModel] = useState("Cinematic Pro");
  const [audio, setAudio] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [tab, setTab] = useState("create");
  const [scenes, setScenes] = useState(["O começo da história", "A descoberta", "O momento decisivo"]);

  const generate = () => {
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    window.setTimeout(() => setGenerating(false), 1800);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <aside className={"fixed inset-y-0 left-0 z-50 w-72 border-r border-white/[.07] bg-[#0c0c0f] transition-transform lg:translate-x-0 " + (mobileMenu ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-white/[.07] px-5">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-black"><Sparkles size={18} fill="currentColor" /></div>
              <div><p className="text-sm font-black tracking-tight">FRAME<span className="text-violet-400">FLOW</span></p><p className="text-[9px] font-bold uppercase tracking-[.18em] text-zinc-600">AI CREATIVE STUDIO</p></div>
            </div>
            <button className="rounded-lg p-2 text-zinc-500 lg:hidden" onClick={() => setMobileMenu(false)}><X size={18}/></button>
          </div>
          <div className="p-3"><button onClick={() => setTab("create")} className="flex w-full items-center gap-3 rounded-xl bg-white px-3 py-2.5 text-sm font-black text-black"><Plus size={17}/> Novo projeto</button></div>
          <nav className="space-y-1 px-3 text-sm">
            <button onClick={() => setTab("create")} className="flex w-full items-center gap-3 rounded-xl bg-white/[.06] px-3 py-2.5 text-zinc-200"><LayoutDashboard size={17}/> Studio</button>
            <button onClick={() => setTab("scenes")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-zinc-500 hover:bg-white/[.04] hover:text-white"><FolderOpen size={17}/> Projetos</button>
            <button onClick={() => setTab("assets")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-zinc-500 hover:bg-white/[.04] hover:text-white"><Library size={17}/> Biblioteca</button>
            <button onClick={() => setTab("create")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-zinc-500 hover:bg-white/[.04] hover:text-white"><Grid2X2 size={17}/> Modelos</button>
          </nav>
          <div className="mt-7 px-4"><p className="mb-2 text-[10px] font-black uppercase tracking-[.18em] text-zinc-600">Projetos recentes</p><div className="space-y-1">{["História do gato astronauta","ASMR cozinha realista","O último sobrevivente"].map((p,i)=><button key={p} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-zinc-500 hover:bg-white/[.04] hover:text-zinc-200"><div className={"h-7 w-7 rounded-md " + (i === 0 ? "bg-violet-500/20" : i === 1 ? "bg-cyan-500/20" : "bg-amber-500/20")}/><span className="truncate">{p}</span></button>)}</div></div>
          <div className="mt-auto border-t border-white/[.07] p-3">
            <div className="rounded-xl bg-white/[.035] p-3"><div className="flex items-center gap-2"><Zap size={15} className="text-violet-400"/><span className="text-xs font-bold">Plano Creator</span><span className="ml-auto rounded-full bg-violet-500/15 px-2 py-0.5 text-[9px] font-black text-violet-300">PRO</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[42%] rounded-full bg-violet-500"/></div><p className="mt-2 text-[10px] text-zinc-600">42 de 100 créditos usados</p></div>
            <button className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-zinc-500"><Settings2 size={16}/> Configurações</button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 flex h-16 items-center border-b border-white/[.07] bg-[#09090b]/90 px-4 backdrop-blur-xl sm:px-6">
          <button className="mr-3 rounded-lg p-2 text-zinc-400 lg:hidden" onClick={() => setMobileMenu(true)}><Menu size={19}/></button>
          <div className="hidden items-center gap-2 text-xs text-zinc-600 sm:flex"><span>Studio</span><span>/</span><span className="text-zinc-300">Novo projeto</span></div>
          <div className="ml-auto flex items-center gap-2"><button className="rounded-lg p-2 text-zinc-500"><Bell size={18}/></button><button className="flex items-center gap-2 rounded-xl border border-white/[.08] bg-white/[.03] px-2.5 py-1.5"><div className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-600 text-[10px] font-black">W</div><span className="hidden text-xs font-bold sm:block">Criador</span><ChevronDown size={13} className="text-zinc-600"/></button></div>
        </header>

        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div><div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[.07] px-2.5 py-1 text-[10px] font-black uppercase tracking-[.15em] text-violet-300"><Sparkles size={12}/> Criador de vídeos IA</div><h1 className="text-3xl font-black tracking-tight sm:text-4xl">Dê vida à sua próxima ideia.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Crie vídeos realistas e narrativas consistentes para TikTok, Reels e Shorts — do primeiro prompt à cena final.</p></div>
            <div className="flex gap-2"><button className="rounded-xl border border-white/[.08] bg-white/[.03] px-4 py-2.5 text-xs font-bold text-zinc-300"><Library size={15} className="mr-2 inline"/> Meus projetos</button><button className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-black"><Plus size={15} className="mr-2 inline"/> Novo projeto</button></div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[.08] bg-[#0e0e12]">
              <div className="flex items-center gap-1 border-b border-white/[.07] px-3 pt-3">{[["create","Criar"],["assets","Recursos"],["scenes","Cenas"]].map(([id,label])=><button key={id} onClick={()=>setTab(id)} className={"rounded-t-xl px-4 py-2.5 text-xs font-black " + (tab===id ? "bg-white/[.06] text-white" : "text-zinc-600")}>{label}</button>)}</div>

              {tab === "create" && <div className="p-4 sm:p-6">
                <div className="mb-5 flex gap-2 overflow-x-auto pb-1">{modes.map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>setMode(item.id)} className={"min-w-[150px] rounded-xl border p-3 text-left transition " + (mode===item.id ? "border-violet-400/40 bg-violet-500/[.08] text-white" : "border-white/[.07] bg-white/[.02] text-zinc-500")}><Icon size={17} className={mode===item.id ? "text-violet-300" : "text-zinc-600"}/><p className="mt-2 text-xs font-black">{item.label}</p><p className="mt-1 text-[10px] leading-4 text-zinc-600">{item.desc}</p></button>})}</div>

                <div className="rounded-2xl border border-white/[.08] bg-[#09090b] p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between"><div className="flex items-center gap-2"><Bot size={16} className="text-violet-400"/><span className="text-xs font-black">Direção criativa</span><span className="rounded-full bg-white/[.05] px-2 py-0.5 text-[9px] text-zinc-600">Assistente IA</span></div><button onClick={()=>setPrompt(p=>(p ? p+" " : "")+"Câmera natural, física realista, iluminação cinematográfica, detalhes orgânicos e movimento humano imperfeito.")} className="text-[10px] font-bold text-violet-400"><Sparkles size={12} className="mr-1 inline"/> Melhorar prompt</button></div>
                  <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Descreva a cena como se estivesse dirigindo uma filmagem. Ex.: Um gato laranja encontra uma pequena porta iluminada no fundo de uma floresta durante a noite..." className="min-h-40 w-full resize-none bg-transparent text-sm leading-7 text-zinc-200 outline-none placeholder:text-zinc-700"/>
                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[.06] pt-3"><button className="rounded-lg border border-white/[.07] px-2.5 py-2 text-[10px] font-bold text-zinc-500"><Upload size={13} className="mr-1.5 inline"/> Referência</button><button className="rounded-lg border border-white/[.07] px-2.5 py-2 text-[10px] font-bold text-zinc-500"><Mic2 size={13} className="mr-1.5 inline"/> Voz</button><button className="rounded-lg border border-white/[.07] px-2.5 py-2 text-[10px] font-bold text-zinc-500"><AudioLines size={13} className="mr-1.5 inline"/> Som</button><span className="ml-auto text-[10px] text-zinc-700">{prompt.length}/2.000</span></div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="rounded-xl border border-white/[.07] bg-white/[.02] p-3"><span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Modelo</span><select value={model} onChange={e=>setModel(e.target.value)} className="mt-2 w-full bg-transparent text-xs font-bold text-zinc-200 outline-none"><option className="bg-zinc-900">Cinematic Pro</option><option className="bg-zinc-900">Fast Draft</option><option className="bg-zinc-900">Realism Ultra</option></select></label>
                  <div className="rounded-xl border border-white/[.07] bg-white/[.02] p-3"><span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Proporção</span><div className="mt-2 flex gap-1">{["9:16","16:9","1:1"].map(v=><button key={v} onClick={()=>setAspect(v)} className={"rounded-md px-2 py-1 text-[10px] font-black " + (aspect===v ? "bg-white text-black" : "bg-white/[.05] text-zinc-500")}>{v}</button>)}</div></div>
                  <label className="rounded-xl border border-white/[.07] bg-white/[.02] p-3"><span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Duração</span><select value={duration} onChange={e=>setDuration(e.target.value)} className="mt-2 w-full bg-transparent text-xs font-bold text-zinc-200 outline-none"><option className="bg-zinc-900">8s</option><option className="bg-zinc-900">15s</option><option className="bg-zinc-900">30s</option><option className="bg-zinc-900">60s</option></select></label>
                  <div className="rounded-xl border border-white/[.07] bg-white/[.02] p-3"><span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Áudio nativo</span><button onClick={()=>setAudio(!audio)} className="mt-2 flex items-center gap-2 text-xs font-bold text-zinc-300"><span className={"relative h-5 w-9 rounded-full " + (audio ? "bg-violet-500" : "bg-white/10")}><span className={"absolute top-0.5 h-4 w-4 rounded-full bg-white " + (audio ? "left-[18px]" : "left-0.5")}/></span>{audio ? "Ativado" : "Desativado"}</button></div>
                </div>

                <div className="mt-5 flex flex-col gap-3 rounded-xl border border-violet-500/10 bg-violet-500/[.035] p-4 sm:flex-row sm:items-center"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-500/10 text-violet-300"><Aperture size={17}/></div><div className="flex-1"><p className="text-xs font-black">Realismo e consistência</p><p className="mt-1 text-[10px] leading-5 text-zinc-600">Direção focada em câmera, iluminação, física, continuidade de personagem e detalhes naturais para evitar um resultado artificial.</p></div><button onClick={()=>setPrompt(p=>p+" Manter identidade visual, proporções, iluminação e características do personagem consistentes entre tomadas.")} className="rounded-lg border border-white/[.08] px-3 py-2 text-[10px] font-bold text-zinc-400">Aplicar</button></div>

                <button disabled={generating || !prompt.trim()} onClick={generate} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-40">{generating ? <><Loader2 size={17} className="animate-spin"/> Preparando sua cena...</> : <><Sparkles size={17}/> Gerar vídeo · {duration} · {model}</>}</button>
              </div>}

              {tab === "assets" && <div className="p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-black">Biblioteca de recursos</h2><p className="mt-1 text-xs text-zinc-600">Personagens, imagens, vídeos e referências do projeto.</p></div><button className="rounded-xl bg-white px-3 py-2 text-xs font-black text-black"><Upload size={14} className="mr-1.5 inline"/> Upload</button></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="grid aspect-video place-items-center rounded-xl border border-dashed border-white/10 text-zinc-700"><Plus/></div>{["PERSONAGEM","CENÁRIO","OBJETO","REFERÊNCIA","FRAME","ÁUDIO"].map((label,i)=><div key={label} className={"relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br " + (i%2 ? "from-zinc-900 to-cyan-950/40" : "from-zinc-800 to-violet-950/40")}><span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[9px] font-black tracking-wider text-zinc-300">{label}</span></div>)}</div></div>}

              {tab === "scenes" && <div className="p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-black">Storyboard</h2><p className="mt-1 text-xs text-zinc-600">Monte a história cena por cena e mantenha continuidade.</p></div><button onClick={()=>setScenes(s=>s.concat("Nova cena "+(s.length+1)))} className="rounded-xl border border-white/[.08] px-3 py-2 text-xs font-bold"><Plus size={14} className="mr-1 inline"/> Cena</button></div><div className="space-y-3">{scenes.map((scene,i)=><div key={scene+i} className="flex items-center gap-4 rounded-xl border border-white/[.07] bg-white/[.02] p-3"><div className="grid h-16 w-24 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-zinc-800 to-violet-950/40"><Film size={18} className="text-white/60"/></div><div className="min-w-0 flex-1"><p className="text-xs font-black">Cena {i+1} · {scene}</p><p className="mt-1 text-[10px] text-zinc-600">08s · continuidade ativada · áudio {audio ? "nativo" : "desativado"}</p></div><MoreHorizontal size={16} className="text-zinc-600"/></div>)}</div></div>}
            </section>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-white/[.08] bg-[#0e0e12] p-4"><div className="flex items-center justify-between"><div><p className="text-xs font-black">Ideias para viralizar</p><p className="mt-1 text-[10px] text-zinc-600">Presets para conteúdo curto.</p></div><Zap size={15} className="text-amber-400"/></div><div className="mt-4 space-y-2">{presets.map(([title,text])=><button key={title} onClick={()=>{setPrompt(text);setTab("create")}} className="w-full rounded-xl border border-white/[.06] bg-white/[.02] p-3 text-left hover:border-violet-500/20"><p className="text-[11px] font-black text-zinc-300">{title}</p><p className="mt-1 text-[10px] leading-4 text-zinc-600">{text}</p></button>)}</div></section>
              <section className="rounded-2xl border border-white/[.08] bg-[#0e0e12] p-4"><div className="flex items-center justify-between"><p className="text-xs font-black">Preview</p><span className="rounded-full bg-white/[.05] px-2 py-1 text-[9px] font-bold text-zinc-500">{aspect}</span></div><div className="mt-3 aspect-[9/12] overflow-hidden rounded-xl bg-gradient-to-b from-violet-950/50 via-zinc-900 to-black"><div className="flex h-full flex-col items-center justify-center p-5 text-center"><div className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5"><Clapperboard size={20} className="text-violet-300"/></div><p className="mt-3 text-xs font-black">Seu vídeo aparece aqui</p><p className="mt-1 text-[10px] leading-4 text-zinc-600">Gere uma cena para visualizar e continuar editando.</p></div></div><div className="mt-3 flex gap-2"><button className="flex-1 rounded-lg border border-white/[.07] py-2 text-[10px] font-bold text-zinc-500"><Download size={12} className="mr-1 inline"/> Exportar</button><button className="flex-1 rounded-lg border border-white/[.07] py-2 text-[10px] font-bold text-zinc-500">Editar</button></div></section>
              <section className="rounded-2xl border border-white/[.08] bg-[#0e0e12] p-4"><p className="text-xs font-black">Fluxo de produção</p><div className="mt-4 space-y-3">{[["01","Ideia","Descreva a cena"],["02","Recursos","Personagens e referências"],["03","Cenas","Conecte os takes"],["04","Refino","Edite por texto"],["05","Exportar","Publique em 9:16"]].map(([n,t,d])=><div key={n} className="flex gap-3"><div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/[.05] text-[9px] font-black text-zinc-500">{n}</div><div><p className="text-[10px] font-black">{t}</p><p className="text-[9px] text-zinc-600">{d}</p></div></div>)}</div></section>
            </aside>
          </div>

          <section className="mt-8 grid gap-3 sm:grid-cols-3">{[["Realismo","Física, luz, textura e movimento com direção cinematográfica.",Aperture],["Consistência","Personagens, objetos e estilos reutilizáveis entre cenas.",Layers3],["Edição natural","Descreva a alteração e refine o resultado com IA.",WandSparkles]].map(([title,desc,Icon])=>{const I=Icon as typeof Aperture;return <div key={title as string} className="rounded-2xl border border-white/[.07] bg-white/[.02] p-5"><I size={18} className="text-violet-300"/><p className="mt-3 text-xs font-black">{title as string}</p><p className="mt-1 text-[10px] leading-5 text-zinc-600">{desc as string}</p></div>})}</section>
          <footer className="flex flex-col gap-2 py-8 text-[10px] text-zinc-700 sm:flex-row sm:justify-between"><span>FRAMEFLOW AI · Creative video studio</span><span>Feito para TikTok, Reels, Shorts e storytelling</span></footer>
        </main>
      </div>
    </div>
  );
}
