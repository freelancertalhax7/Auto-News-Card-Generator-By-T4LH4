import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { Editor } from "./components/Editor";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";
import { PublicViewer } from "./components/PublicViewer";
import { Button } from "./components/ui/button";
import { LogOut, Home, PlusCircle, Newspaper } from "lucide-react";
import { auth } from "./lib/firebase";
import { Toaster } from "sonner";
import { NewsCard as NewsCardType } from "./types";
import { cn } from "./lib/utils";

function MainContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<"dashboard" | "editor" | "viewer">("editor");
  const [editingCard, setEditingCard] = useState<NewsCardType | undefined>(undefined);
  const [viewingCardId, setViewingCardId] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/card/")) {
      const id = path.split("/card/")[1];
      if (id) {
        setViewingCardId(id);
        setView("viewer");
      }
    }
  }, []);

  if (view === "viewer" && viewingCardId) {
    return <PublicViewer id={viewingCardId} onBack={() => {
      window.history.pushState({}, "", "/");
      setViewingCardId(null);
      setView("editor");
    }} />;
  }

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Newspaper className="w-12 h-12 text-red-600 animate-pulse" />
          <p className="text-gray-500 animate-pulse font-bold tracking-widest uppercase text-xs">Loading NewsCard BD...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleStartEdit = (card: NewsCardType) => {
    setEditingCard(card);
    setView("editor");
  };

  const handleCreateNew = () => {
    setEditingCard(undefined);
    setView("editor");
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden select-none">
      {/* Sidebar Navigation */}
      <nav className="w-20 lg:w-64 bg-slate-900 text-slate-300 flex flex-col h-full transition-all">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-red-900/20">এ</div>
          <div className="hidden lg:flex flex-col">
            <span className="text-white font-bold tracking-tight text-lg">EKTA NEWS</span>
            <span className="text-[10px] opacity-60 uppercase tracking-widest font-black">Generator Pro</span>
          </div>
        </div>
        
        <div className="mt-4 flex-1 px-4 space-y-2">
          <button 
            onClick={() => setView("dashboard")}
            className={cn(
              "w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all",
              view === "dashboard" ? "bg-slate-800 text-white shadow-xl" : "hover:bg-slate-800/50"
            )}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="hidden lg:block font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={handleCreateNew}
            className={cn(
              "w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all",
              view === "editor" ? "bg-slate-800 text-white shadow-xl" : "hover:bg-slate-800/50"
            )}
          >
            <PlusCircle className="w-5 h-5 shrink-0" />
            <span className="hidden lg:block font-medium">New Generator</span>
          </button>
        </div>

        <div className="p-4 mb-6 hidden lg:block">
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-4 shadow-xl">
            <p className="text-white text-[10px] font-black uppercase tracking-wider mb-1">Pro Account</p>
            <p className="text-white/80 text-xs mb-3">Unlimited cloud database & custom branding.</p>
            <button className="w-full py-2 bg-white text-red-600 font-bold rounded-lg text-xs hover:bg-gray-50 transition-colors">Upgrade Now</button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800/50">
          <button 
            onClick={() => auth.signOut()}
            className="w-full px-4 py-3 rounded-xl flex items-center gap-3 hover:bg-red-500/10 hover:text-red-400 transition-all text-slate-400"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="hidden lg:block font-medium">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              {view === "dashboard" ? "My Dashboard" : "Card Editor"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <p className="text-sm font-bold text-slate-800">{user.displayName || user.email?.split('@')[0]}</p>
              <p className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">Premium Member</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
               {user.photoURL ? <img src={user.photoURL} alt="" /> : <div className="text-slate-400 font-bold">{user.email?.[0].toUpperCase()}</div>}
            </div>
          </div>
        </header>

        {/* Content Region */}
        <div className="flex-1 overflow-auto relative">
          {view === "dashboard" ? (
            <div className="p-8"><Dashboard onEdit={handleStartEdit} /></div>
          ) : (
            <Editor initialCard={editingCard} onSaved={() => setView("dashboard")} />
          )}
        </div>
      </main>
      
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
