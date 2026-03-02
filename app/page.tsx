"use client";
import React, { useEffect, useState } from 'react';
import {
  Sparkles, Zap, BarChart3, ChevronRight, Layout, Rocket,
  Skull, Microscope, Crown, Palette, Binary, GraduationCap, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LandingPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Vérifier la session au montage du composant
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getInitialSession();

    // 2. Écouter les changements d'état (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#05070A] text-white selection:bg-blue-600/30 font-poppins">

      {/* NAVIGATION DYNAMIQUE */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-8 sticky top-0 bg-[#05070A]/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(37,99,235,0.5)] group-hover:scale-110 transition-transform">O</div>
          <span className="text-2xl font-[900] tracking-tighter uppercase text-white">OUT<span className="text-blue-600">IA</span></span>
        </div>

        <div className="hidden md:flex space-x-12 text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase">
          <a href="#test" className="hover:text-blue-500 transition-colors">Le Diagnostic</a>
          <a href="#outils" className="hover:text-blue-500 transition-colors">L'Arsenal IA</a>
          <a href="#pricing" className="hover:text-blue-500 transition-colors">Premium</a>
        </div>

        <Link href={session ? "/dashboard" : "/auth"}>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all min-w-[140px] flex justify-center items-center h-10 shadow-lg shadow-blue-600/20 active:scale-95">
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : session ? (
              "Espace Membre"
            ) : (
              "Se Connecter"
            )}
          </button>
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full -z-10" />

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black text-blue-400 mb-10 uppercase tracking-[0.3em]">
            <Sparkles size={14} className="animate-pulse" />
            <span>Propulsé par les Archétypes de Carl Jung</span>
          </div>

          <h1 className="text-6xl md:text-[110px] font-[900] tracking-tighter mb-10 leading-[0.9] uppercase">
            CESSEZ DE VENDRE. <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-100 bg-clip-text text-transparent italic drop-shadow-sm">
              SOYEZ INCALCULABLE.
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto mb-16 leading-relaxed font-medium font-poppins">
            L'IA qui décode votre ADN de marque et génère un arsenal de contenu chirurgical pour dominer votre niche.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link href={session ? "/dashboard/test" : "/auth"}>
              <button className="w-full sm:w-auto bg-white text-black px-12 py-6 rounded-2xl text-xl font-[900] flex items-center justify-center gap-4 transition-all hover:bg-blue-600 hover:text-white hover:scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group uppercase tracking-tighter">
                Lancer le Test Stratégique
                <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest italic underline decoration-blue-600 underline-offset-8">
              36 questions pour votre futur.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION ARCHÉTYPES */}
      <section id="test" className="py-32 border-y border-white/5 bg-[#080A0F]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="text-5xl md:text-7xl font-[900] italic uppercase tracking-tighter leading-none">
              VOTRE <span className="text-blue-600">ARCHÉTYPE</span> <br /> DOMINANT.
            </h2>
            <p className="max-w-xs text-gray-500 font-bold text-sm leading-relaxed uppercase tracking-tighter">
              6 piliers stratégiques. Un seul définit votre autorité sur le marché.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { t: "Le Rebelle", icon: <Skull size={32} />, d: "Positionnement disruptif. Cassez les codes établis." },
              { t: "Le Sage", icon: <Microscope size={32} />, d: "Autorité intellectuelle. Analyse profonde et vérité." },
              { t: "Le Leader", icon: <Crown size={32} />, d: "Dominance et pouvoir. Soyez la référence absolue." },
              { t: "Le Créateur", icon: <Palette size={32} />, d: "Originalité pure. Visionnaire de votre industrie." },
              { t: "Le Stratège", icon: <Binary size={32} />, d: "Logique implacable. Systèmes et performance brute." },
              { t: "Le Mentor", icon: <GraduationCap size={32} />, d: "Transformation guidée. Élevez vos clients." }
            ].map((item, idx) => (
              <div key={idx} className="group p-12 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-blue-600 transition-all duration-500 hover:bg-blue-600/5">
                <div className="text-blue-600 mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform">{item.icon}</div>
                <h3 className="text-2xl font-[900] mb-4 uppercase tracking-tight">{item.t}</h3>
                <p className="text-gray-500 text-sm font-semibold leading-relaxed group-hover:text-gray-300 transition-colors">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* L'ARSENAL IA */}
      <section id="outils" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-12">
            <div className="p-1 w-fit bg-gradient-to-r from-blue-600 to-transparent rounded-lg">
              <div className="bg-[#05070A] px-4 py-1 text-[10px] font-black uppercase tracking-widest">Fonctionnalités Core</div>
            </div>
            <h3 className="text-5xl font-[900] uppercase tracking-tighter leading-none italic">Plus qu'un test. <br /> Un Agent de Croissance.</h3>

            <div className="flex gap-8 items-start group">
              <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><Layout size={32} /></div>
              <div>
                <h4 className="text-xl font-black uppercase mb-2">Contenu Social Haute-Fidélité</h4>
                <p className="text-gray-500 font-medium">Posts LinkedIn SEO, FB Ads et Captions adaptés à votre psychologie de marque.</p>
              </div>
            </div>

            <div className="flex gap-8 items-start group">
              <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><Rocket size={32} /></div>
              <div>
                <h4 className="text-xl font-black uppercase mb-2">Copywriting Chirurgical</h4>
                <p className="text-gray-400 font-medium italic underline underline-offset-4 decoration-blue-600">"Pavés de vente", Landing Pages et Séquences Email.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 bg-white/5 p-8 rounded-[3rem] border border-white/10 self-center">
            <div className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-blue-500 transition-colors">
              <div className="flex items-center gap-4">
                <BarChart3 className="text-blue-500" />
                <span className="font-black uppercase tracking-widest text-xs">Dashboard Analytics</span>
              </div>
              <span className="bg-blue-600/20 text-blue-400 text-[10px] px-3 py-1 rounded-full font-black">PREMIUM</span>
            </div>
            <div className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5 hover:border-blue-500 transition-colors">
              <div className="flex items-center gap-4">
                <Zap className="text-blue-500" />
                <span className="font-black uppercase tracking-widest text-xs">Chatbot Custom IA</span>
              </div>
              <span className="bg-blue-600/20 text-blue-400 text-[10px] px-3 py-1 rounded-full font-black">PREMIUM</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="pricing" className="py-40 px-6">
        <div className="max-w-6xl mx-auto rounded-[5rem] bg-gradient-to-br from-blue-700 to-blue-900 p-16 md:p-32 text-center relative overflow-hidden shadow-[0_50px_100px_rgba(37,99,235,0.3)]">
          <div className="relative z-10">
            <h2 className="text-5xl md:text-[100px] font-[900] italic uppercase tracking-tighter mb-10 leading-none">Bienvenue, Hustler !</h2>
            <p className="text-blue-100 text-xl md:text-3xl max-w-2xl mx-auto mb-16 font-bold leading-relaxed">
              Prêt à scaler ton marketing avec Out IA ? Débloque ton potentiel illimité.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10 font-black">
              <div className="text-left">
                <div className="text-5xl text-white tracking-tighter">19€<span className="text-xl">/mois</span></div>
                <div className="text-blue-300 text-[10px] tracking-[0.2em] uppercase">Accès Illimité Arsenal IA</div>
              </div>
              <Link href={session ? "/dashboard" : "/auth"}>
                <button className="bg-white text-blue-700 px-16 py-8 rounded-[2rem] text-2xl hover:scale-105 transition-transform uppercase shadow-2xl active:scale-95">
                  Prendre le contrôle
                </button>
              </Link>
            </div>
          </div>
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]" />
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="text-gray-600 text-[10px] font-black tracking-[0.4em] uppercase">
          Out IA © 2026 — L'autorité par le design et la donnée.
        </div>
      </footer>
    </div>
  );
}