import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NewsCard as NewsCardType } from "../types";
import { CardRenderer } from "./CardRenderer";
import { Button } from "./ui/button";
import { ChevronLeft, Download, Share2 } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";

export function PublicViewer({ id, onBack }: { id: string; onBack: () => void }) {
  const [card, setCard] = useState<NewsCardType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCard() {
      try {
        const docRef = doc(db, "newsCards", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCard({ id: docSnap.id, ...docSnap.data() } as NewsCardType);
        } else {
          toast.error("Card not found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load card");
      } finally {
        setLoading(false);
      }
    }
    fetchCard();
  }, [id]);

  const handleDownload = async () => {
    const el = document.getElementById("public-preview");
    if (!el) return;
    try {
      const data = await toPng(el, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `news-card-${id}.png`;
      link.href = data;
      link.click();
    } catch (e) {
      toast.error("Failed to download");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading card...</div>;
  }

  if (!card) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Card not found or is private</h1>
        <Button onClick={onBack}>Go Back Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 md:p-12 overflow-auto select-none">
      <div className="w-full max-w-4xl flex items-center justify-between mb-12">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900">
          <ChevronLeft className="w-4 h-4" /> Back to App
        </Button>
        <div className="flex gap-3">
           <Button variant="outline" onClick={handleShare} className="rounded-xl h-11 border-slate-200 bg-white shadow-sm font-bold text-xs">
             <Share2 className="w-4 h-4 mr-2" /> Share Link
           </Button>
           <Button onClick={handleDownload} className="rounded-xl h-11 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 font-bold text-xs uppercase tracking-widest">
             <Download className="w-4 h-4 mr-2" /> Download Image
           </Button>
        </div>
      </div>

      <div id="public-preview" className="shadow-[0_48px_100px_-12px_rgba(0,0,0,0.3)] max-w-full w-[600px] rounded-2xl overflow-hidden bg-white ring-1 ring-slate-200">
        <CardRenderer card={card} />
      </div>

      <div className="mt-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
           <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm">এ</div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800">NewsCard BD</p>
        </div>
        <p className="text-xs text-slate-400 font-medium">Create your own news photocards at</p>
        <p className="font-black text-slate-900 tracking-tight mt-1">{window.location.origin}</p>
      </div>
    </div>
  );
}
