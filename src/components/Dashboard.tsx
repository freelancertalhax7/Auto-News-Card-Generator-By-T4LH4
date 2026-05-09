import React, { useEffect, useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { NewsCard as NewsCardType } from "../types";
import { CardRenderer } from "./CardRenderer";
import { Button } from "./ui/button";
import { 
  Trash2, 
  ExternalLink, 
  Clock, 
  Search, 
  Grid2X2, 
  List as ListIcon,
  Plus,
  Newspaper,
  Edit3,
  Share2,
  ArrowUpRight
} from "lucide-react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export function Dashboard({ onEdit }: { onEdit: (card: NewsCardType) => void }) {
  const { user } = useAuth();
  const [cards, setCards] = useState<NewsCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "newsCards"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsCardType[];
      setCards(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this card?")) return;
    try {
      await deleteDoc(doc(db, "newsCards", id));
      toast.success("Card deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete card");
    }
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/card/${id}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied!");
  };

  const filteredCards = cards.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-8 max-w-7xl mx-auto">
        <div className="h-16 w-64 bg-slate-200 animate-pulse rounded-2xl" />
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-[4/3] bg-slate-200 animate-pulse rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Your Creations</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Manage and edit your news photocards</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 font-bold group-focus-within:text-red-500 transition-colors" />
            <Input 
              placeholder="Search cards..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 w-full md:w-[280px] h-11 rounded-full bg-white border-slate-200 focus:ring-2 focus:ring-red-500/20 shadow-sm transition-all"
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-full p-1.5 flex shadow-sm">
            <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="icon" 
                className={cn("w-8 h-8 rounded-full transition-all", viewMode === "grid" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900")}
                onClick={() => setViewMode("grid")}
            >
              <Grid2X2 className="w-4 h-4" />
            </Button>
            <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="icon" 
                className={cn("w-8 h-8 rounded-full transition-all", viewMode === "list" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900")}
                onClick={() => setViewMode("list")}
            >
              <ListIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-inner">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Newspaper className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">No photocards created yet</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-sm">Start your first news photocard generation today and build your visual news library.</p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-8 transition-all duration-500",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          <AnimatePresence mode="popLayout">
            {filteredCards.map((card) => (
              <motion.div 
                layout
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex",
                  viewMode === "grid" ? "flex-col" : "flex-row items-center h-48"
                )}
              >
                {/* Status Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg",
                    card.isPublic ? "bg-green-500 text-white" : "bg-slate-900 text-white"
                  )}>
                    {card.isPublic ? "Public" : "Private"}
                  </span>
                </div>

                <div className={cn(
                  "bg-slate-100 relative overflow-hidden shrink-0",
                  viewMode === "grid" ? "aspect-[16/10] w-full" : "w-1/3 h-full"
                )}>
                   <img 
                     src={card.imageUrl} 
                     alt={card.title} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                      <Button size="icon" className="rounded-full bg-white text-slate-900 hover:bg-black hover:text-white shadow-xl" onClick={() => onEdit(card)}>
                        <Edit3 className="w-5 h-5" />
                      </Button>
                      <Button size="icon" className="rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white shadow-xl" onClick={() => card.id && handleDelete(card.id)}>
                        <Trash2 className="w-5 h-5" />
                      </Button>
                      <Button size="icon" className="rounded-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white shadow-xl" onClick={() => card.id && handleShare(card.id)}>
                        <Share2 className="w-5 h-5" />
                      </Button>
                   </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 bg-red-600 rounded flex items-center justify-center text-[9px] font-black text-white">এ</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{card.source}</span>
                  </div>
                  <h3 className={cn(
                    "font-black text-slate-800 leading-tight tracking-tight mb-4 transition-colors group-hover:text-red-600",
                    viewMode === "grid" ? "text-lg line-clamp-2 min-h-[3rem]" : "text-xl line-clamp-1"
                  )}>
                    {card.title}
                  </h3>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Published</p>
                      <p className="text-xs font-bold text-slate-500">{card.date}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-100 group/btn" 
                      onClick={() => onEdit(card)}
                    >
                      Workspace <ArrowUpRight className="ml-1 w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
