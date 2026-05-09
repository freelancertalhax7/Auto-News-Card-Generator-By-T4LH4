import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { THEMES, CardRenderer } from "./CardRenderer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Switch } from "./ui/switch";
import { 
  Check, 
  Download, 
  Globe, 
  Image as ImageIcon, 
  Info, 
  Palette, 
  Save, 
  Type, 
  Wand2,
  Loader2,
  Trash2,
  Share2
} from "lucide-react";
import { toPng } from "html-to-image";
import { db } from "../lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { cn } from "../lib/utils";
import { NewsCard as NewsCardType, CardCustomization } from "../types";

export function Editor({ initialCard, onSaved }: { initialCard?: NewsCardType, onSaved?: () => void }) {
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const defaultCard = {
    title: "আপনার সংবাদের শিরোনাম এখানে দিন",
    excerpt: "সংবাদের বিস্তারিত অংশ এখানে থাকবে। এটি সংক্ষিপ্ত এবং আকর্ষণীয় করার চেষ্টা করুন।",
    source: "NewsCard BD",
    date: new Date().toLocaleDateString("bn-BD", { day: 'numeric', month: 'long', year: 'numeric' }),
    imageUrl: "https://images.unsplash.com/photo-1585007600263-ad126256759c?q=80&w=2070&auto=format&fit=crop",
    themeId: "somoy",
    isPublic: true,
    customization: {
      titleFont: "Inter",
      titleColor: "#ffffff",
      excerptColor: "#d1d5db",
      backgroundColor: "#000000",
      accentColor: "#ff0000",
      overlayOpacity: 0.6,
      fontSize: 28,
      textAlign: "left"
    } as CardCustomization
  };

  const [card, setCard] = useState<Partial<NewsCardType>>(initialCard || defaultCard);

  useEffect(() => {
    if (initialCard) {
      setCard(initialCard);
    }
  }, [initialCard]);

  const handleUrlExtract = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/news-meta?url=${encodeURIComponent(url)}`);
      const meta = await res.json();
      
      if (meta.error) throw new Error(meta.error);

      setCard(prev => ({
        ...prev,
        title: meta.title || prev.title,
        excerpt: meta.description || prev.excerpt,
        source: meta.siteName || prev.source,
        imageUrl: meta.image || prev.imageUrl,
      }));
      toast.success("Info extracted from link!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to extract data from link. Please enter manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    const el = document.getElementById("news-card-preview");
    if (!el) return;
    
    toast.promise(toPng(el, { quality: 0.95, pixelRatio: 2 }), {
      loading: 'Generating image...',
      success: (data) => {
        const link = document.createElement('a');
        link.download = `news-card-${Date.now()}.png`;
        link.href = data;
        link.click();
        return 'Card saved to device!';
      },
      error: 'Failed to generate image',
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (card.id) {
        await updateDoc(doc(db, "newsCards", card.id), {
          ...card,
          updatedAt: serverTimestamp(),
        });
        toast.success("Card updated!");
      } else {
        await addDoc(collection(db, "newsCards"), {
          ...card,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success("Card saved to your dashboard!");
      }
      if (onSaved) onSaved();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save card.");
    } finally {
      setSaving(false);
    }
  };

  const updateCustom = (key: keyof CardCustomization, val: any) => {
    setCard(prev => ({
      ...prev,
      customization: { ...prev.customization!, [key]: val }
    }));
  };

  return (
    <div className="flex h-full overflow-hidden bg-slate-100">
      {/* Customization Panel (Left) */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-sm">
        <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Palette className="w-3 h-3 text-red-600" /> Customize Card
          </h2>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => window.location.reload()}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        <Tabs defaultValue="content" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid grid-cols-3 mx-4 mt-4 bg-slate-100 rounded-lg p-1">
            <TabsTrigger value="content" className="text-[10px] uppercase font-black tracking-widest px-0"><Info className="w-3 h-3 mr-1" /> Data</TabsTrigger>
            <TabsTrigger value="style" className="text-[10px] uppercase font-black tracking-widest px-0"><Type className="w-3 h-3 mr-1" /> Style</TabsTrigger>
            <TabsTrigger value="themes" className="text-[10px] uppercase font-black tracking-widest px-0"><Globe className="w-3 h-3 mr-1" /> Themes</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="flex-1 px-4 py-6">
            <TabsContent value="content" className="m-0 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Title</Label>
                <Textarea 
                  value={card.title} 
                  onChange={(e) => setCard({...card, title: e.target.value})}
                  rows={3}
                  className="bg-slate-50 border-slate-200 focus:ring-red-500 text-sm font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Excerpt</Label>
                <Textarea 
                  value={card.excerpt} 
                  onChange={(e) => setCard({...card, excerpt: e.target.value})}
                  rows={4}
                  className="bg-slate-50 border-slate-200 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Source</Label>
                  <Input value={card.source} onChange={(e) => setCard({...card, source: e.target.value})} className="bg-slate-50 text-xs h-9 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Date</Label>
                  <Input value={card.date} onChange={(e) => setCard({...card, date: e.target.value})} className="bg-slate-50 text-xs h-9 font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Image</Label>
                <div className="flex gap-2">
                  <Input 
                    value={card.imageUrl} 
                    onChange={(e) => setCard({...card, imageUrl: e.target.value})}
                    placeholder="URL to image..."
                    className="bg-slate-50 text-xs h-9"
                  />
                  <div className="relative">
                    <Button variant="outline" size="icon" className="shrink-0 h-9 w-9 bg-slate-50" asChild>
                      <label className="cursor-pointer">
                        <ImageIcon className="w-4 h-4" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setCard(prev => ({ ...prev, imageUrl: reader.result as string }));
                                toast.success("Image uploaded!");
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Make Public</Label>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter transition-all">Card visible to gallery</p>
                </div>
                <Switch 
                  checked={card.isPublic}
                  onCheckedChange={(checked) => setCard({...card, isPublic: checked})}
                  className="data-[state=checked]:bg-red-600 shadow-lg"
                />
              </div>
            </TabsContent>

            <TabsContent value="style" className="m-0 space-y-8">
               <div className="space-y-4">
                 <Label className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Title Font Size <span>{card.customization!.fontSize}px</span>
                 </Label>
                 <Slider 
                  value={[card.customization!.fontSize]} 
                  onValueChange={(vals: number | readonly number[]) => {
                    const val = Array.isArray(vals) ? vals[0] : (vals as number);
                    updateCustom("fontSize", val);
                  }}
                  min={16} max={80} step={1}
                 />
               </div>

               <div className="space-y-4">
                 <Label className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Overlay Opacity <span>{Math.round(card.customization!.overlayOpacity * 100)}%</span>
                 </Label>
                 <Slider 
                  value={[card.customization!.overlayOpacity]} 
                  onValueChange={(vals: number | readonly number[]) => {
                    const val = Array.isArray(vals) ? vals[0] : (vals as number);
                    updateCustom("overlayOpacity", val);
                  }}
                  min={0} max={1} step={0.1}
                 />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Title Color</Label>
                   <div className="flex gap-2 items-center">
                     <input 
                        type="color" 
                        value={card.customization!.titleColor} 
                        onChange={(e) => updateCustom("titleColor", e.target.value)}
                        className="w-10 h-10 p-0 rounded-full border-2 border-white shadow-sm cursor-pointer"
                      />
                      <Input 
                        value={card.customization!.titleColor} 
                        onChange={(e) => updateCustom("titleColor", e.target.value)}
                        className="h-9 text-[10px] font-mono tracking-tighter"
                      />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Accent Color</Label>
                   <div className="flex gap-2 items-center">
                     <input 
                        type="color" 
                        value={card.customization!.accentColor} 
                        onChange={(e) => updateCustom("accentColor", e.target.value)}
                        className="w-10 h-10 p-0 rounded-full border-2 border-white shadow-sm cursor-pointer"
                      />
                      <Input 
                        value={card.customization!.accentColor} 
                        onChange={(e) => updateCustom("accentColor", e.target.value)}
                        className="h-9 text-[10px] font-mono tracking-tighter"
                      />
                   </div>
                 </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Alignment</Label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    {["left", "center", "right"].map((align) => (
                      <button
                        key={align}
                        onClick={() => updateCustom("textAlign", align as any)}
                        className={cn(
                          "flex-1 py-1.5 text-[10px] font-black uppercase transition-all rounded-lg",
                          card.customization!.textAlign === align ? "bg-white shadow-md text-red-600" : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {align}
                      </button>
                    ))}
                  </div>
               </div>
            </TabsContent>

            <TabsContent value="themes" className="m-0">
               <div className="grid grid-cols-2 gap-3 pb-8">
                 {THEMES.map((t) => (
                   <button
                    key={t.id}
                    onClick={() => setCard({...card, themeId: t.id})}
                    className={cn(
                      "group p-3 rounded-xl border-2 text-left transition-all hover:scale-[1.02] relative overflow-hidden h-24 flex flex-col justify-between shadow-sm",
                      card.themeId === t.id ? "border-red-500 bg-red-50/20" : "border-slate-100 bg-white hover:border-slate-200"
                    )}
                   >
                     <div className="flex flex-col gap-0.5">
                        <span className={cn("text-[10px] font-black uppercase tracking-tighter", card.themeId === t.id ? "text-red-600" : "text-slate-500")}>
                          {t.name.split(' ')[0]}
                        </span>
                        <span className="text-[8px] text-slate-400 font-bold uppercase">{t.name.split(' ')[1] || "Modern"}</span>
                     </div>
                     <div className="flex gap-1.5 items-center">
                        <div className="w-5 h-5 rounded-full shadow-lg" style={{ background: t.primary }} />
                        <div className="w-5 h-5 rounded-full border border-slate-200 shadow-inner" style={{ background: t.secondary }} />
                        {card.themeId === t.id && (
                          <div className="ml-auto bg-red-500 rounded-full p-0.5 shadow-lg">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                     </div>
                   </button>
                 ))}
               </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="p-4 border-t bg-slate-50/50">
          <Button 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest py-6 rounded-2xl shadow-xl shadow-slate-900/10 flex gap-3 transition-transform active:scale-[0.98]"
            disabled={saving} 
            onClick={handleSave}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-5 h-5" />}
            Save & Publish
          </Button>
        </div>
      </aside>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Link Extraction Header */}
        <div className="h-20 shrink-0 bg-white border-b border-slate-200 px-8 flex items-center gap-4">
           <div className="relative flex-1 max-w-2xl group">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">
               <Globe className="w-4 h-4" />
             </div>
             <Input 
              placeholder="Paste news URL here to auto-fill..." 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className="pl-12 bg-slate-100 border-none rounded-full h-11 text-sm focus-visible:ring-2 focus-visible:ring-red-500/20 shadow-inner"
             />
           </div>
           <Button 
            onClick={handleUrlExtract} 
            disabled={loading} 
            className="h-11 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
             Fetch News
           </Button>
        </div>

        {/* Central Workspace */}
        <ScrollArea className="flex-1 bg-slate-100/50 p-8 md:p-12">
          <div className="flex flex-col items-center gap-12 min-h-full justify-center">
            <div 
              id="news-card-preview" 
              className="shadow-[0_48px_100px_-12px_rgba(0,0,0,0.3)] max-w-full w-[600px] bg-white rounded-2xl overflow-hidden ring-1 ring-slate-400/20"
            >
              <CardRenderer card={card as NewsCardType} />
            </div>

            <div className="flex gap-4 p-2 bg-white/40 backdrop-blur-md rounded-full shadow-2xl border border-white/50">
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full h-12 px-8 bg-white border-none shadow-lg hover:bg-gray-50 font-black uppercase tracking-widest text-xs" 
                onClick={handleDownload}
              >
                <Download className="mr-2 w-4 h-4 text-red-600" /> Export Image
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full h-12 px-8 bg-white border-none shadow-lg hover:bg-gray-50 font-black uppercase tracking-widest text-xs"
                onClick={() => {
                  if (card.id) {
                    navigator.clipboard.writeText(`${window.location.origin}/card/${card.id}`);
                    toast.success("Public link copied!");
                  } else {
                    toast.warning("Save the card first to get a shareable link!");
                  }
                }}
              >
                <Share2 className="mr-2 w-4 h-4 text-red-600" /> Share Link
              </Button>
            </div>
          </div>
        </ScrollArea>

        {/* Quick Template Switcher Footer */}
        <footer className="h-24 bg-white border-t border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-6">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight w-24">Quick Switch Template</div>
             <ScrollArea className="w-[500px]" orientation="horizontal">
               <div className="flex gap-4 py-2 pr-4">
                  {THEMES.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setCard(prev => ({...prev, themeId: t.id}))}
                      className={cn(
                        "w-14 h-14 rounded-2xl flex-shrink-0 border-2 transition-all p-1 shadow-sm",
                        card.themeId === t.id ? "border-red-500 scale-110 shadow-xl" : "border-slate-100 grayscale hover:grayscale-0"
                      )}
                    >
                      <div className="w-full h-full rounded-xl overflow-hidden relative shadow-inner">
                         <div className="absolute inset-0" style={{ background: t.primary }} />
                         <div className="absolute bottom-0 w-full h-1/2 bg-white/40 backdrop-blur-md" />
                      </div>
                    </button>
                  ))}
               </div>
             </ScrollArea>
          </div>
          <div className="flex gap-3">
             <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600" onClick={() => window.location.reload()}>Reset Defaults</Button>
             <Button className="bg-slate-900 text-white font-bold rounded-xl h-12 shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] uppercase tracking-widest text-xs px-8">Apply Preset</Button>
          </div>
        </footer>
      </div>
    </div>
  );
}
