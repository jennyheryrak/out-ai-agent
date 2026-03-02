"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Send, Copy, RefreshCw, ArrowLeft, Linkedin, Facebook, Instagram, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function GeneratorPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const type = searchParams.get('type') || 'linkedin';

    const [topic, setTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState("");
    const [copied, setCopied] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return router.push('/auth');
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
            if (profile) setUser(profile);
        };
        checkUser();
    }, [router]);

    const contentConfigs: any = {
        linkedin: { title: "LinkedIn Post", icon: <Linkedin size={32} />, tone: "Autorité & Expertise", placeholder: "Ex: Pourquoi la plupart des entrepreneurs échouent..." },
        facebook: { title: "Facebook Ad", icon: <Facebook size={32} />, tone: "Conversion & Psychologie", placeholder: "Ex: Accès exclusif à ma méthode..." },
        instagram: { title: "Instagram Content", icon: <Instagram size={32} />, tone: "Storytelling & Impact", placeholder: "Ex: 3 leçons apprises à 30 ans..." }
    };

    const current = contentConfigs[type] || contentConfigs.linkedin;

    const handleGenerate = async () => {
        if (!topic || isGenerating) return;
        setIsGenerating(true);

        // Simulation de l'appel IA (à remplacer par ton API plus tard)
        setTimeout(async () => {
            const archetypeName = user?.archetype || "LEADER";
            setResult(`[ÉLITE DRAFT - ARCHÉTYPE ${archetypeName.toUpperCase()}]\n\nCible : ${current.title}\nSujet : ${topic}\n\nL'accroche a été forgée pour briser le scroll. Le corps du texte utilise une structure de persuasion directe cohérente avec votre positionnement.\n\n#OutIA #Strategie #Elite`);

            if (user && user.plan !== "PRO") {
                const refillDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString();
                await supabase.from('profiles').update({
                    credits: 0,
                    next_refill_at: refillDate
                }).eq('id', user.id);
            }

            setIsGenerating(false);
        }, 2000);
    };

    return (
        <div className="h-screen bg-[#020408] text-white font-poppins flex flex-col overflow-hidden">

            {/* TOP BAR */}
            <div className="border-b border-white/5 p-6 flex items-center justify-between bg-[#020408] shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                    <ArrowLeft size={16} /> Retour Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20">
                        <Sparkles size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">IA Engine v1.0</span>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT - CÔTE À CÔTE */}
            <div className="flex flex-1 overflow-hidden">

                {/* PANNEAU GAUCHE (INPUT) */}
                <div className="w-full lg:w-[400px] border-r border-white/5 p-8 flex flex-col justify-between bg-[#020408]">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-2xl font-[900] uppercase italic tracking-tighter mb-1">Configuration</h1>
                            <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest italic">{current.title}</p>
                        </div>

                        {/* AFFICHAGE ARCHÉTYPE DYNAMIQUE */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <Shield size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">ADN Détecté :</span>
                            </div>
                            <p className="text-sm font-black italic uppercase text-blue-500">
                                {user?.archetype ? `"${user.archetype}"` : "Chargement..."}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Sujet du contenu</label>
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder={current.placeholder}
                                className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:border-blue-600 outline-none transition-all resize-none placeholder:text-gray-700"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white p-5 rounded-2xl font-black uppercase text-sm tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-blue-600/20"
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" /> : <Send size={18} />}
                        Forger l'Élite
                    </button>
                </div>

                {/* PANNEAU DROIT (RÉSULTAT) */}
                <div className="flex-1 p-12 bg-[#05070A] flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em]">Draft Stratégique</h2>
                        </div>
                        {result && (
                            <button
                                onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                                className="flex items-center gap-2 text-blue-500 hover:text-white transition-all text-[10px] font-black uppercase italic bg-white/5 px-4 py-2 rounded-xl border border-white/5"
                            >
                                {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                                {copied ? "Copié" : "Copier le texte"}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 relative overflow-y-auto custom-scrollbar shadow-inner">
                        {!result && !isGenerating && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-10">
                                <div className="p-6 bg-white/5 rounded-full border border-white/10">
                                    {current.icon}
                                </div>
                                <p className="font-black uppercase text-xs tracking-[0.5em] italic">En attente d'instructions...</p>
                            </div>
                        )}

                        {isGenerating && (
                            <div className="h-full flex items-center justify-center">
                                <div className="space-y-4 w-full max-w-sm">
                                    <div className="h-1 bg-blue-600/50 rounded-full w-full animate-pulse" />
                                    <div className="h-1 bg-white/10 rounded-full w-3/4 animate-pulse delay-75" />
                                    <div className="h-1 bg-blue-600/30 rounded-full w-5/6 animate-pulse delay-150" />
                                </div>
                            </div>
                        )}

                        {result && (
                            <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <p className="text-xl font-medium leading-relaxed text-gray-200 whitespace-pre-wrap italic">
                                    {result}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* FOOTER TEXT */}
                    <div className="mt-8 flex items-center justify-center gap-4 opacity-20 shrink-0">
                        <div className="h-[1px] w-12 bg-gray-500" />
                        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Precision Copywriting Engine</span>
                        <div className="h-[1px] w-12 bg-gray-500" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
            `}</style>
        </div>
    );
}