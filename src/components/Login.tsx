import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Button } from "./ui/button";
import { Newspaper, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 font-sans p-4 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-red-600/5 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-slate-900/5 blur-[120px]" />
      
      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)] border border-white p-10 flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-red-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-red-600/30 mb-8 transform hover:rotate-6 transition-transform">
            <Newspaper className="text-white w-10 h-10" />
          </div>
          
          <div className="text-center space-y-2 mb-12">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900">
              NewsCard <span className="text-red-600">BD</span>
            </h1>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
              Photocard Generator Pro
            </p>
          </div>

          <p className="text-sm text-slate-500 font-medium text-center mb-10 leading-relaxed max-w-[280px]">
            Create professional news photocards from any link in seconds with our AI-powered engine.
          </p>

          <Button 
            className="w-full bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest py-7 rounded-2xl shadow-2xl shadow-slate-900/20 flex gap-4 transition-all duration-300 transform active:scale-[0.98] h-auto"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="h-px w-24 bg-slate-100" />
            <div className="flex gap-10">
               <div className="flex flex-col items-center">
                  <p className="text-xl font-black text-slate-900">20+</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Themes</p>
               </div>
               <div className="flex flex-col items-center border-x border-slate-100 px-10">
                  <p className="text-xl font-black text-slate-900">1K+</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Users</p>
               </div>
               <div className="flex flex-col items-center">
                  <p className="text-xl font-black text-slate-900">5s</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Time</p>
               </div>
            </div>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
           © 2026 EKTA NEWS • DIGITAL IDENTITY LAB
        </p>
      </div>
    </div>
  );
}
