import React from "react";
import { NewsCard as NewsCardType } from "../types";
import { cn } from "../lib/utils";

interface TemplateProps {
  card: Partial<NewsCardType>;
  id?: string;
  className?: string;
}

// 20 Themes definition
export const THEMES = [
  { id: "somoy", name: "Somoy Classic", primary: "#ff0000", secondary: "#ffffff" },
  { id: "daily-star", name: "Star Modern", primary: "#001d3d", secondary: "#ffffff" },
  { id: "prothom-alo", name: "Prothom Alo", primary: "#ed1c24", secondary: "#ffffff" },
  { id: "channel-i", name: "Channel I", primary: "#1d4ed8", secondary: "#ffffff" },
  { id: "dbc", name: "DBC Dark", primary: "#000000", secondary: "#ffffff" },
  { id: "itv", name: "Independent", primary: "#15803d", secondary: "#ffffff" },
  { id: "bdnews24", name: "BDNews24", primary: "#0284c7", secondary: "#ffffff" },
  { id: "jugantor", name: "Jugantor", primary: "#7f1d1d", secondary: "#ffffff" },
  { id: "kaler-kantho", name: "Kaler Kantho", primary: "#000000", secondary: "#ef4444" },
  { id: "jamuna", name: "Jamuna Info", primary: "#b91c1c", secondary: "#ffffff" },
  { id: "rtv", name: "Rtv Online", primary: "#7e22ce", secondary: "#ffffff" },
  { id: "btv", name: "BTV Retro", primary: "#065f46", secondary: "#ffffff" },
  { id: "brutalist", name: "Brutalist", primary: "#000000", secondary: "#ffffff" },
  { id: "glass", name: "Glassmorphism", primary: "transparent", secondary: "#ffffff" },
  { id: "glow", name: "Neon Glow", primary: "#000000", secondary: "#00ffcc" },
  { id: "minimal", name: "Minimalist", primary: "#f3f4f6", secondary: "#111827" },
  { id: "poster", name: "Bold Poster", primary: "#eab308", secondary: "#000000" },
  { id: "ig-pos", name: "Social 1:1", primary: "#000000", secondary: "#ffffff" },
  { id: "story", name: "Story 9:16", primary: "#000000", secondary: "#ffffff" },
  { id: "headline", name: "Headline Only", primary: "#ffffff", secondary: "#000000" },
];

export function CardRenderer({ card, id, className }: TemplateProps) {
  const theme = THEMES.find((t) => t.id === card.themeId) || THEMES[0];
  const custom = card.customization;

  const titleStyles = {
    fontFamily: custom?.titleFont || "inherit",
    color: custom?.titleColor || theme.secondary,
    fontSize: `${(custom?.fontSize || 24)}px`,
    textAlign: custom?.textAlign || "left",
  };

  const overlayStyle = {
    backgroundColor: `${custom?.backgroundColor || theme.primary}${Math.round((custom?.overlayOpacity || 0.6) * 255).toString(16).padStart(2, '0')}`,
  };

  const sharedBg = (
    <>
      {card.imageUrl && <img src={card.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />}
      <div className="absolute inset-0" style={overlayStyle} />
    </>
  );

  switch (card.themeId) {
    case "somoy":
      return (
        <div id={id} className={cn("relative w-full aspect-[4/3] overflow-hidden bg-black flex flex-col justify-end border-t-8", className)} style={{ borderTopColor: theme.primary }}>
          {card.imageUrl && <img src={card.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="relative p-6">
            <div className="bg-red-600 inline-block px-3 py-1 text-white text-[10px] font-black uppercase mb-3 drop-shadow-lg">সংবাদ</div>
            <h2 className="font-bold leading-tight drop-shadow-lg mb-2" style={titleStyles}>
              {card.title}
            </h2>
            <p className="text-gray-300 text-sm line-clamp-2" style={{ color: custom?.excerptColor }}>
              {card.excerpt}
            </p>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <span>{card.source} | {card.date}</span>
              <span className="text-red-500">LIVE</span>
            </div>
          </div>
        </div>
      );

    case "daily-star":
      return (
        <div id={id} className={cn("relative w-full aspect-video bg-white overflow-hidden border-8 border-slate-100 p-8 flex flex-col justify-center", className)}>
           <div className="absolute top-8 left-8 text-blue-900 font-serif font-black text-xl italic border-b-2 border-blue-900 pb-1">The Daily Star</div>
           <div className="mt-12 flex gap-8 items-center">
             <div className="flex-1 space-y-4">
               <h2 className="text-slate-900 font-serif font-black leading-tight tracking-tight" style={titleStyles}>
                 {card.title}
               </h2>
               <p className="text-slate-600 text-sm italic font-serif leading-relaxed" style={{ color: custom?.excerptColor }}>
                 {card.excerpt}
               </p>
             </div>
             {card.imageUrl && <div className="w-1/3 aspect-square rounded-full overflow-hidden border-4 border-blue-50 shrink-0 shadow-xl"><img src={card.imageUrl} className="w-full h-full object-cover" /></div>}
           </div>
           <div className="absolute bottom-8 right-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">{card.date}</div>
        </div>
      );

    case "prothom-alo":
      return (
        <div id={id} className={cn("relative w-full aspect-[4/5] bg-[#fdfdfd] flex flex-col p-2", className)}>
          <div className="border border-gray-200 flex-1 flex flex-col">
            <div className="bg-red-600 p-3 flex justify-between items-center">
              <span className="text-white font-black text-xl">প্রথম আলো</span>
              <span className="text-white/70 text-[10px] font-mono select-none">{card.date}</span>
            </div>
            <div className="flex-1 relative overflow-hidden group">
              {card.imageUrl && <img src={card.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />}
            </div>
            <div className="p-6 space-y-3">
              <h2 className="text-gray-900 font-black leading-tight" style={titleStyles}>
                {card.title}
              </h2>
              <p className="text-gray-600 text-sm border-l-2 border-red-600 pl-4 py-1" style={{ color: custom?.excerptColor }}>
                {card.excerpt}
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
              <span className="text-[10px] font-bold text-gray-400">অনলাইন ডেস্ক</span>
              <div className="flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-red-600" />)}
              </div>
            </div>
          </div>
        </div>
      );

    case "dbc":
      return (
        <div id={id} className={cn("relative w-full aspect-video bg-black overflow-hidden group", className)}>
          {card.imageUrl && <img src={card.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-1000" alt="" />}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="relative h-full flex flex-col justify-center p-12 max-w-2xl">
            <div className="w-12 h-1 bg-red-600 mb-6" />
            <h2 className="text-white font-black italic uppercase tracking-tighter leading-none mb-6" style={titleStyles}>
              {card.title}
            </h2>
            <p className="text-white/70 font-medium border-l-4 border-gray-400 pl-6 py-2" style={{ color: custom?.excerptColor }}>
              {card.excerpt}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1">BREAKING NEWS</div>
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{card.source} | {card.date}</span>
            </div>
          </div>
        </div>
      );

    case "itv":
      return (
        <div id={id} className={cn("relative w-full aspect-[4/3] bg-white overflow-hidden p-6", className)}>
           <div className="h-full border-[10px] border-green-700 p-8 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-8 bg-green-700 px-4 text-white text-xs font-black italic">INDEPENDENT</div>
              <h2 className="text-green-900 font-black leading-[1.1] tracking-tight" style={titleStyles}>
                {card.title}
              </h2>
              <div className="space-y-4">
                {card.imageUrl && <div className="h-40 w-full bg-gray-100"><img src={card.imageUrl} className="w-full h-full object-cover" /></div>}
                <p className="text-green-800/80 font-bold text-sm" style={{ color: custom?.excerptColor }}>{card.excerpt}</p>
                <div className="text-[10px] text-green-700/50 font-black uppercase flex justify-between">
                  <span>{card.date}</span>
                  <span>DHAKA, BANGLADESH</span>
                </div>
              </div>
           </div>
        </div>
      );

    case "glass":
      return (
        <div id={id} className={cn("relative w-full aspect-square flex items-center justify-center p-8 overflow-hidden", className)}>
          {card.imageUrl && <img src={card.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[3rem] shadow-2xl w-full h-full flex flex-col justify-center text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-white text-2xl">★</span>
            </div>
            <h2 className="text-white font-black tracking-tight leading-none mb-6 drop-shadow-xl" style={titleStyles}>
              {card.title}
            </h2>
            <p className="text-white/80 font-medium leading-relaxed max-w-md mx-auto" style={{ color: custom?.excerptColor }}>
              {card.excerpt}
            </p>
            <div className="mt-auto pt-8 flex flex-col gap-2">
               <span className="text-white font-black uppercase text-xs tracking-widest">{card.source}</span>
               <span className="text-white/40 text-[10px]">{card.date}</span>
            </div>
          </div>
        </div>
      );

    case "glow":
      return (
        <div id={id} className={cn("relative w-full aspect-video bg-black overflow-hidden p-1 flex items-center justify-center", className)}>
           <div className="absolute inset-0 opacity-40">
             {card.imageUrl && <img src={card.imageUrl} className="w-full h-full object-cover blur-xl" alt="" />}
           </div>
           <div className="relative w-full h-full bg-black/80 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] p-10 flex flex-col justify-center">
              <div className="inline-block self-start px-3 py-1 bg-cyan-500 text-black font-black text-[10px] mb-6 animate-pulse">CYBER BD</div>
              <h2 className="text-white font-black italic tracking-tighter" style={titleStyles}>
                {card.title}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-transparent my-6" />
              <p className="text-cyan-100/60 font-mono text-xs uppercase leading-loose" style={{ color: custom?.excerptColor }}>{card.excerpt}</p>
              <div className="mt-8 text-[9px] font-mono text-cyan-500/40 flex justify-between">
                <span>COORD_BD_{Date.now().toString().slice(-4)}</span>
                <span>{card.date}</span>
              </div>
           </div>
        </div>
      );

    case "poster":
      return (
        <div id={id} className={cn("relative w-full aspect-[3/4] bg-yellow-400 p-8 flex flex-col justify-between overflow-hidden", className)}>
           <div className="text-black font-black text-6xl leading-[0.8] tracking-tighter uppercase break-words" style={titleStyles}>
             {card.title}
           </div>
           <div className="space-y-6">
              {card.imageUrl && <div className="border-8 border-black grayscale rotate-2 hover:rotate-0 transition-transform"><img src={card.imageUrl} className="w-full aspect-video object-cover" /></div>}
              <p className="text-black font-bold text-lg leading-tight -rotate-1 bg-white inline-block p-2 border-2 border-black" style={{ color: custom?.excerptColor }}>{card.excerpt}</p>
              <div className="flex justify-between items-end">
                <div className="font-black text-4xl italic -mb-2">{card.source}</div>
                <div className="font-mono font-bold text-xs bg-black text-yellow-400 px-2 py-1">{card.date}</div>
              </div>
           </div>
        </div>
      );

    case "jamuna":
      return (
        <div id={id} className={cn("relative w-full aspect-video bg-[#0c1e33] overflow-hidden flex flex-col", className)}>
           <div className="flex-1 flex">
             <div className="w-1/2 p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center font-black text-white italic">JT</div>
                  <span className="text-white font-black text-xl italic tracking-tighter">JAMUNA TV</span>
                </div>
                <h2 className="text-white font-black leading-tight mb-4" style={titleStyles}>
                  {card.title}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed" style={{ color: custom?.excerptColor }}>{card.excerpt}</p>
             </div>
             <div className="w-1/2 relative">
                {card.imageUrl && <img src={card.imageUrl} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0c1e33] to-transparent" />
             </div>
           </div>
           <div className="h-4 bg-red-600 flex overflow-hidden">
             <div className="h-full bg-white px-4 text-[10px] font-black italic items-center flex shrink-0">TOP NEWS</div>
             <div className="flex-1 px-4 text-white text-[10px] items-center flex font-bold truncate">
                {card.title} • {card.source} • {card.date} • {card.title}
             </div>
           </div>
        </div>
      );

    case "kaler-kantho":
      return (
        <div id={id} className={cn("relative w-full aspect-[4/3] bg-white border-t-[12px] border-black p-8 flex flex-col gap-6", className)}>
           <div className="flex justify-between items-center border-b-4 border-black pb-4">
             <span className="font-black text-2xl italic tracking-tighter">কালের কণ্ঠ</span>
             <span className="font-bold text-sm">{card.date}</span>
           </div>
           <h2 className="text-gray-950 font-black leading-[1.1] tracking-tight" style={titleStyles}>
             {card.title}
           </h2>
           <div className="flex gap-6">
             {card.imageUrl && <div className="w-1/3 aspect-square bg-gray-100 flex-shrink-0"><img src={card.imageUrl} className="w-full h-full object-cover" /></div>}
             <p className="text-gray-700 text-sm leading-relaxed font-medium" style={{ color: custom?.excerptColor }}>{card.excerpt}</p>
           </div>
           <div className="mt-auto pt-4 flex items-center gap-4 text-[10px] font-black uppercase text-gray-400">
             <span>BD NEWS</span>
             <div className="flex-1 h-px bg-gray-100" />
             <span>VERIFIED</span>
           </div>
        </div>
      );

    default:
      return (
        <div id={id} className={cn("relative w-full aspect-[4/3] bg-gray-900 overflow-hidden text-white flex flex-col justify-end p-10", className)}>
          {card.imageUrl && <img src={card.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />}
          <div className="absolute inset-0" style={overlayStyle} />
          <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-md inline-block px-4 py-1 rounded-full text-[10px] uppercase tracking-widest font-black mb-6">
              {card.source}
            </div>
            <h2 className="font-bold leading-[1.1] mb-6" style={titleStyles}>
              {card.title}
            </h2>
            <p className="text-sm opacity-80 leading-relaxed max-w-xl" style={{ color: custom?.excerptColor }}>
              {card.excerpt}
            </p>
            <div className="mt-8 flex items-center gap-4 text-[10px] opacity-40 font-bold uppercase tracking-tighter">
              <span>{card.date}</span>
              <div className="w-8 h-px bg-white/20" />
              <span>PHOTO NEWS</span>
            </div>
          </div>
        </div>
      );
  }
}

