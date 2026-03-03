"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
    Send, Copy, RefreshCw, ArrowLeft, Linkedin, 
    Facebook, Instagram, Sparkles, CheckCircle2, Shield 
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
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

    // 1. Initialisation & Vérification Auth
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return router.push('/auth');
            
            const { data: profile } = await supabase.from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();
            
            if (profile) setUser(profile);
        };
        checkUser();
    }, [router]);

    // 2. Configuration des outils (Matching avec ton Switch n8n)
    const contentConfigs: any = {
        linkedin: { 
            title: "LinkedIn Prophet", 
            toolName: "LinkedIn Prophet", 
            icon: <Linkedin size={32} />, 
            placeholder: "Ex: Pourquoi l'IA ne remplacera pas le jugement humain en stratégie..." 
        },
        facebook: { 
            title: "Ads Killer (FB)", 
            toolName: "Ads Killer", 
            icon: <Facebook size={32} />, 
            placeholder: "Ex: Votre offre de coaching pour entrepreneurs débordés..." 
        },
        instagram: { 
            title: "Ads Killer (Insta)", 
            toolName: "Ads Killer", 
            icon: <Instagram size={32} />, 
            placeholder: "Ex: Une méthode disruptive pour doubler ses revenus..." 
        }
    };

    const current = contentConfigs[type] || contentConfigs.linkedin;

    // 3. Logique d'appel à l'Oracle
    const handleGenerate = async () => {
        if (!topic || isGenerating) return;
        setIsGenerating(true);
        setResult(""); // Reset pour l'animation

        try {
            const response = await fetch('https://n8n.chinese-kool.com/webhook/dd22dade-63ad-4b6f-889d-f2da6e7865d9', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: topic,
                    archetype: user?.archetype || "Rebelle / Stratège",
                    tool: current.toolName, // Envoie "LinkedIn Prophet" ou "Ads Killer"
                    sessionId: `gen_${Date.now()}`
                }),
            });

            const n8nData = await response.json();
            
            // On s'assure de récupérer la sortie texte
            if (n8nData.output) {
                setResult(n8nData.output);
            } else {
                setResult("### Erreur de Transmission\nL'Oracle a parlé mais son message s'est perdu. Vérifie ton flux n8n.");
            }

            // Optionnel : Gestion des crédits si plan non PRO
            if (user && user.plan !== "PRO") {
                // Ta logique de décompte ici
            }

        } catch (err) {
            console.error("Erreur de génération:", err);
            setResult("### Connexion Interrompue\nImpossible de joindre l'Oracle. Vérifie ton endpoint n8n.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-screen bg-[#020408] text-white font-poppins flex flex-col overflow-hidden">
            
            {/* BARRE SUPÉRIEURE */}
            <header className="border-b border-white/5 p-6 flex items-center justify-between bg-[#020408] shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20">
                        <Sparkles size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">IA Engine v1.0</span>
                    </div>
                </div>
            </header>

            {/* ZONE DE TRAVAIL */}
            <main className="flex flex-1 overflow-hidden">
                
                {/* CONFIGURATION (GAUCHE) */}
                <aside className="w-full lg:w-[400px] border-r border-white/5 p-8 flex flex-col justify-between bg-[#020408] z-10">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-2xl font-[900] uppercase italic tracking-tighter mb-1">Forge</h1>
                            <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest italic">{current.title}</p>
                        </div>

                        {/* ARCHÉTYPE DÉTECTÉ */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl shadow-black">
                            <div className="flex items-center gap-2 text-gray-500 mb-2">
                                <Shield size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Influence Archétype :</span>
                            </div>
                            <p className="text-sm font-black italic uppercase text-blue-500">
                                {user?.archetype ? user.archetype : "Analyse..."}
                            </p>
                        </div>

                        {/* SAISIE DU SUJET */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Thématique brute</label>
                            <textarea
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder={current.placeholder}
                                className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:border-blue-600 outline-none transition-all resize-none placeholder:text-gray-700 shadow-inner"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white p-5 rounded-2xl font-black uppercase text-sm tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-blue-600/20 mt-4"
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" /> : <Send size={18} />}
                        Générer la Prophétie
                    </button>
                </aside>

                {/* RÉSULTAT (DROITE) */}
                <section className="flex-1 p-12 bg-[#05070A] flex flex-col relative overflow-hidden">
                    
                    {/* EN-TÊTE RÉSULTAT */}
                    <div className="flex items-center justify-between mb-8 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-orange-500 animate-ping' : 'bg-blue-600 animate-pulse'}`} />
                            <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em]">Draft Stratégique</h2>
                        </div>
                        
                        {result && (
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 text-blue-500 hover:text-white transition-all text-[10px] font-black uppercase italic bg-white/5 px-4 py-2 rounded-xl border border-white/5"
                            >
                                {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                                {copied ? "Copié dans le presse-papier" : "Copier le texte"}
                            </button>
                        )}
                    </div>

                    {/* ZONE DE TEXTE DYNAMIQUE */}
                    <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-[3rem] p-12 relative overflow-y-auto custom-scrollbar shadow-inner">
                        
                        {/* État vide */}
                        {!result && !isGenerating && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-10">
                                <div className="p-8 bg-white/5 rounded-full border border-white/10 animate-pulse">
                                    {current.icon}
                                </div>
                                <p className="font-black uppercase text-xs tracking-[0.5em] italic">L'Oracle attend vos paramètres...</p>
                            </div>
                        )}

                        {/* État Loading */}
                        {isGenerating && (
                            <div className="h-full flex flex-col items-center justify-center space-y-6">
                                <RefreshCw size={40} className="text-blue-600 animate-spin" />
                                <div className="space-y-4 w-full max-w-sm">
                                    <div className="h-1 bg-blue-600/50 rounded-full w-full animate-pulse" />
                                    <div className="h-1 bg-white/10 rounded-full w-3/4 animate-pulse delay-75" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 animate-pulse">Calcul des angles d'attaque...</p>
                            </div>
                        )}

                        {/* Rendu Markdown */}
                        {result && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <div className="markdown-container prose prose-invert max-w-none prose-p:leading-relaxed">
                                    <ReactMarkdown>
                                        {result}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* DÉCORATION BAS DE PAGE */}
                    <footer className="mt-8 flex items-center justify-center gap-4 opacity-10 shrink-0">
                        <div className="h-[1px] w-24 bg-gray-500" />
                        <span className="text-[8px] font-black uppercase tracking-[0.8em]">Prophecy Engine v1.0</span>
                        <div className="h-[1px] w-24 bg-gray-500" />
                    </footer>
                </section>
            </main>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
            `}</style>
        </div>
    );
}