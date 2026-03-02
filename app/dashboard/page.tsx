"use client";
import React, { useState, useEffect } from 'react';
import {
    Layout, MessageSquare, Lock, Target, TrendingUp,
    Rocket, Clock, Loader2, Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    // États Utilisateur et Modales
    const [user, setUser] = useState<any>(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });

    // 1. CHARGEMENT INITIAL ET RECHARGE AUTO (Limité à 1 crédit pour FREE)
    useEffect(() => {
        const initDashboard = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return router.push('/auth');

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (profile) {
                let currentCredits = profile.credits;
                const now = new Date();
                const nextRefill = new Date(profile.next_refill_at);

                // LOGIQUE : 1 crédit max pour le plan FREE
                if (now >= nextRefill && profile.plan === "FREE" && currentCredits < 1) {
                    currentCredits = 1;
                    await supabase.from('profiles').update({ credits: 1 }).eq('id', authUser.id);
                }

                setUser({
                    id: authUser.id,
                    name: profile.full_name || "Entrepreneur",
                    email: authUser.email,
                    plan: profile.plan || "FREE",
                    credits: currentCredits,
                    // On s'aligne sur ta règle : 1 crédit max en FREE
                    maxCredits: profile.plan === 'PRO' ? 100 : 1,
                    nextRefill: profile.next_refill_at,
                    archetype: profile.archetype || "Non défini"
                });
            }
            setLoading(false);
        };
        initDashboard();
    }, [router]);

    // 2. ANIMATION DU COMPTE À REBOURS
    useEffect(() => {
        if (!user || user.credits > 0) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(user.nextRefill).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                window.location.reload();
                return;
            }

            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({
                h: h < 10 ? `0${h}` : `${h}`,
                m: m < 10 ? `0${m}` : `${m}`,
                s: s < 10 ? `0${s}` : `${s}`
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [user]);

    // 3. ACTIONS DE GÉNÉRATION (Consomme l'unique crédit)
    const handleGenerate = async (type: string) => {
        if (user.credits <= 0) {
            setShowPaywall(true);
            return;
        }

        setIsGenerating(true);
        await new Promise(r => setTimeout(r, 2000)); // Simulation IA

        const newCredits = 0; // Puisqu'il n'en avait qu'un
        const refillDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
            .from('profiles')
            .update({ credits: newCredits, next_refill_at: refillDate })
            .eq('id', user.id)
            .select().single();

        if (!error && data) {
            setUser({ ...user, credits: data.credits, nextRefill: data.next_refill_at });
            alert(`Contenu ${type} sculpté ! Ta réserve est vide pour les prochaines 24h.`);
        }
        setIsGenerating(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020408] flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#020408] text-white font-poppins relative">

            {/* --- SIDEBAR --- */}
            <aside className="w-72 border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen bg-[#020408] z-50">
                <div className="flex items-center gap-2 mb-12 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black">O</div>
                    <span className="font-black text-2xl tracking-tighter italic uppercase">OUT<span className="text-blue-600">IA</span></span>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem icon={<Layout size={20} />} label="Studio Social" active />
                    <NavItem icon={<MessageSquare size={20} />} label="Oracle IA" premium onPremiumClick={() => setShowPaywall(true)} />
                    <NavItem icon={<Target size={20} />} label="Arsenal Vente" />
                </nav>

                {/* ZONE CRÉDITS OPTIMISÉE POUR 1/1 */}
                <div className="mt-auto space-y-4">
                    <div className={`p-5 rounded-2xl border transition-all duration-500 ${user.credits === 0 ? 'bg-orange-600/5 border-orange-500/20' : 'bg-white/5 border-white/5'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Power Reserve</span>
                            <span className={`text-[10px] font-black ${user.credits === 0 ? 'text-orange-500' : 'text-blue-500'}`}>
                                {user.credits}/{user.maxCredits}
                            </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
                            <div
                                className={`h-full transition-all duration-1000 ${user.credits === 0 ? 'bg-orange-500' : 'bg-blue-600'}`}
                                style={{ width: `${(user.credits / user.maxCredits) * 100}%` }}
                            />
                        </div>

                        {user.credits === 0 && (
                            <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase animate-pulse">
                                <Clock size={12} />
                                Recharge : {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
                            </div>
                        )}
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black uppercase">
                            {user.name.substring(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-black truncate uppercase">{user.name}</p>
                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{user.plan} ACCESS</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- CONTENU PRINCIPAL --- */}
            <main className="flex-1 p-8 md:p-16 overflow-y-auto">
                <header className="mb-16">
                    <h1 className="text-5xl font-[900] italic uppercase tracking-tighter mb-4 leading-none text-white">
                        Propulse ton <span className="text-blue-600">Empire.</span>
                    </h1>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full text-[10px] font-black text-blue-500 uppercase tracking-widest">
                        <Sparkles size={12} /> Archétype : {user.archetype}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <section className="space-y-8">
                        <h2 className="text-xl font-black uppercase italic tracking-widest border-l-4 border-blue-600 pl-4">Studio Social</h2>
                        {/* Grisé si 0 crédits */}
                        <div className={`grid grid-cols-1 gap-4 transition-all duration-700 ${user.credits === 0 ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                            <ActionCard
                                title="LinkedIn Prophet"
                                desc="Génération de posts haute conversion"
                                icon={<TrendingUp size={20} />}
                                onClick={() => handleGenerate('LinkedIn')}
                            />
                            <ActionCard
                                title="Ads Killer"
                                desc="Scripts publicitaires FB/Insta"
                                icon={<Target size={20} />}
                                onClick={() => handleGenerate('Ads')}
                            />
                        </div>
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-xl font-black uppercase italic tracking-widest border-l-4 border-white/10 pl-4">Arsenal Vente</h2>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[2px] z-10 rounded-[2rem] flex flex-col items-center justify-center border border-white/5 border-dashed text-center p-4">
                                <Lock className="text-blue-600 mb-2" size={24} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Mise à jour PRO requise</span>
                            </div>
                            <div className="opacity-20 blur-sm">
                                <ActionCard title="Landing Page" desc="Copywriting complet" icon={<Rocket size={20} />} />
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* --- MODAL PAYWALL --- */}
            {showPaywall && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#020408]/95 backdrop-blur-md">
                    <div className="bg-[#05070A] border border-orange-500/30 p-12 rounded-[3rem] max-w-md text-center relative overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse" />
                        <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Clock className="text-orange-500" size={40} />
                        </div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-white">Réserves Épuisées</h2>
                        <div className="mb-10 p-6 bg-white/5 rounded-2xl border border-white/5">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">Temps restant avant recharge</p>
                            <div className="text-4xl font-black font-mono text-orange-500 tracking-tighter">
                                {timeLeft.h}<span className="animate-pulse">:</span>{timeLeft.m}<span className="animate-pulse">:</span>{timeLeft.s}
                            </div>
                        </div>
                        <button className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/40 hover:scale-[1.02] transition-transform mb-6">
                            Débloquer l'accès PRO (Illimité)
                        </button>
                        <button onClick={() => setShowPaywall(false)} className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors">
                            Continuer à attendre
                        </button>
                    </div>
                </div>
            )}

            {/* OVERLAY GÉNÉRATION IA */}
            {isGenerating && (
                <div className="fixed inset-0 z-[300] bg-[#020408]/90 backdrop-blur-2xl flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="absolute -inset-10 bg-blue-600/20 blur-3xl rounded-full animate-pulse" />
                        <Sparkles className="text-blue-500 mb-8 animate-bounce relative" size={64} />
                    </div>
                    <h2 className="text-2xl font-[900] italic uppercase tracking-[0.3em] text-white">OutIA sculpte l'élite...</h2>
                </div>
            )}
        </div>
    );
}

// --- SOUS-COMPOSANTS ---

function ActionCard({ title, desc, icon, onClick }: any) {
    return (
        <div onClick={onClick} className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-blue-600/50 transition-all cursor-pointer group flex items-center justify-between">
            <div>
                <h4 className="font-black uppercase text-sm mb-1 group-hover:text-blue-500 transition-colors">{title}</h4>
                <p className="text-[10px] text-gray-600 font-bold uppercase italic tracking-widest">{desc}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all">
                {icon}
            </div>
        </div>
    );
}

function NavItem({ icon, label, active, premium, onPremiumClick }: any) {
    return (
        <div onClick={premium ? onPremiumClick : undefined} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
            <div className="flex items-center gap-4 font-black text-[10px] uppercase tracking-widest">{icon} {label}</div>
            {premium && <Lock size={14} className="text-blue-600" />}
        </div>
    );
}