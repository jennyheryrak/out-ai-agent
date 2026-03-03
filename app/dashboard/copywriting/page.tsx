"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, Copy, RefreshCw,
    FileText, Mail, ShieldCheck, Sparkles,
    CheckCircle2, ChevronRight, Target, Loader2, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown'; // <--- N'oublie pas d'installer react-markdown

export default function CopywritingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const type = searchParams.get('type') || 'sales';

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [offer, setOffer] = useState("");
    const [target, setTarget] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return router.push('/auth');
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
            if (profile) setUser(profile);
            setLoading(false);
        };
        fetchUser();
    }, [router]);

    // CONFIGURATIONS DES OUTILS DE VENTE (CIBLES N8N)
    const configs: any = {
        sales: {
            title: "Pavé de Vente Élite",
            toolName: "Sales Page Prophet", // <--- Pour ton Switch n8n
            icon: <Zap size={32} className="text-orange-500" />,
            color: "text-orange-500",
            border: "focus:border-orange-500",
            bgBtn: "bg-orange-600 hover:bg-orange-500 shadow-orange-600/20",
            placeholderOffer: "Ex: Accompagnement High-Ticket pour consultants...",
            placeholderTarget: "Ex: Freelances bloqués à 2k€/mois...",
            structure: "Structure de Page de Vente Longue (AIDA + Objections)",
            promptPrefix: "Génère une landing page agressive et élitiste."
        },
        scripts: {
            title: "Sales Scripts",
            toolName: "Closing Script", // <--- Pour ton Switch n8n
            icon: <MessageSquare size={32} className="text-blue-500" />,
            color: "text-blue-500",
            border: "focus:border-blue-500",
            bgBtn: "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20",
            placeholderOffer: "Ex: Ton coaching ou service de consulting...",
            placeholderTarget: "Ex: Un prospect froid qui hésite sur le prix...",
            structure: "Script de Closing (Objections > Autorité > Closing)",
            promptPrefix: "Génère un script de vente conversationnel pour closer."
        }
    };

    const current = configs[type] || configs.sales;

    // CONNEXION RÉELLE À N8N
    const handleGenerate = async () => {
        if (!offer || isGenerating) return;
        setIsGenerating(true);
        setResult("");

        try {
            const response = await fetch('https://n8n.chinese-kool.com/webhook/dd22dade-63ad-4b6f-889d-f2da6e7865d9', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    offer: offer,
                    target: target,
                    archetype: user?.archetype || "Rebelle / Stratège",
                    tool: current.toolName, // On passe l'ID de l'outil
                    type: type // 'sales' ou 'scripts'
                }),
            });

            const data = await response.json();

            if (data.output) {
                setResult(data.output);
            } else {
                setResult("### Erreur de Forge\nL'Oracle n'a pas pu générer ton script. Vérifie ton flux n8n.");
            }
        } catch (err) {
            console.error("Erreur de génération:", err);
            setResult("### Connexion Interrompue\nImpossible d'atteindre l'Arsenal.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#020408] flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="min-h-screen bg-[#020408] text-white font-poppins flex flex-col">
            {/* HEADER */}
            <div className="border-b border-white/5 p-6 flex items-center justify-between bg-[#020408] z-10 sticky top-0">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour Arsenal
                </Link>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <ShieldCheck size={14} className={current.color} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${current.color}`}>{user?.archetype}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row">
                {/* CONFIG SIDEBAR */}
                <div className="w-full lg:w-[450px] border-r border-white/5 p-10 space-y-10 bg-[#020408]">
                    <div>
                        <div className="mb-4">{current.icon}</div>
                        <h1 className="text-3xl font-[900] uppercase italic tracking-tighter mb-2">{current.title}</h1>
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">{current.structure}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className={`text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2`}>
                                <Target size={12} className={current.color} /> Ton Offre Irrésistible
                            </label>
                            <textarea
                                value={offer}
                                onChange={(e) => setOffer(e.target.value)}
                                placeholder={current.placeholderOffer}
                                className={`w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium ${current.border} outline-none transition-all resize-none placeholder:text-gray-700`}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                                <ChevronRight size={12} className={current.color} /> Ta Cible (Avatar)
                            </label>
                            <input
                                type="text"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                placeholder={current.placeholderTarget}
                                className={`w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-medium ${current.border} outline-none transition-all placeholder:text-gray-700`}
                            />
                        </div>
                    </div>

                    <div className={`p-6 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative overflow-hidden`}>
                        <Sparkles className={`absolute right-[-10px] bottom-[-10px] ${current.color} opacity-10 w-20 h-20`} />
                        <p className={`text-[10px] font-black uppercase ${current.color} mb-2 tracking-widest italic`}>Stratégie Appliquée :</p>
                        <p className="text-sm font-bold italic leading-snug text-gray-400">
                            On injecte ton ADN de <span className={current.color}>{user?.archetype?.split(' / ')[0]}</span> pour forcer la décision.
                        </p>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !offer}
                        className={`w-full ${current.bgBtn} text-white p-6 rounded-2xl font-[900] text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-30`}
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" /> : `Générer mon script`}
                    </button>
                </div>

                {/* RESULT AREA */}
                <div className="flex-1 p-8 md:p-12 bg-[#05070A] overflow-y-auto">
                    <div className="max-w-4xl mx-auto h-full flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em]">Sortie Arsenal Out IA</h2>
                            {result && (
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(result);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className={`flex items-center gap-2 ${current.color} hover:text-white transition-all text-[10px] font-black uppercase italic bg-white/5 px-6 py-2 rounded-full border border-white/10`}
                                >
                                    {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                                    {copied ? "Copié" : "Copier le Script"}
                                </button>
                            )}
                        </div>

                        <div className="flex-1 bg-[#020408] border border-white/5 rounded-[3rem] p-10 md:p-16 relative shadow-2xl min-h-[500px]">
                            {!result && !isGenerating && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                    <FileText size={48} className="mb-6 text-gray-600" />
                                    <p className="text-xs font-black uppercase tracking-[0.3em]">En attente des paramètres...</p>
                                </div>
                            )}

                            {isGenerating && (
                                <div className="h-full flex flex-col justify-center space-y-6">
                                    <div className={`h-3 ${current.color} opacity-20 rounded-full w-full animate-pulse`} />
                                    <div className="h-3 bg-white/5 rounded-full w-[90%] animate-pulse delay-75" />
                                    <div className={`h-3 ${current.color} opacity-10 rounded-full w-[95%] animate-pulse delay-150`} />
                                    <p className={`text-center text-[10px] font-black uppercase ${current.color} animate-pulse`}>Forgeage du script en cours...</p>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

function Zap({ size, className }: any) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );
}