"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Copy, RefreshCw, ArrowLeft, Linkedin, Facebook, Instagram, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function GeneratorPage() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'linkedin';

    const [topic, setTopic] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState("");
    const [copied, setCopied] = useState(false);

    // Configuration dynamique selon la section cliquée
    const contentConfigs: any = {
        linkedin: {
            title: "LinkedIn Post",
            icon: <Linkedin size={32} />,
            placeholder: "Ex: Pourquoi le personal branding est mort en 2024...",
            tone: "Autorité & Expertise"
        },
        facebook: {
            title: "Facebook Ad",
            icon: <Facebook size={32} />,
            placeholder: "Ex: Accès exclusif à mon nouveau programme masterclass...",
            tone: "Conversion & Psychologie"
        },
        instagram: {
            title: "Instagram Content",
            icon: <Instagram size={32} />,
            placeholder: "Ex: 3 leçons apprises après avoir généré 100k€...",
            tone: "Storytelling & Impact"
        }
    };

    const current = contentConfigs[type] || contentConfigs.linkedin;

    // Simulation de la génération IA
    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setResult(`[ÉLITE DRAFT - ARCHÉTYPE LE LEADER]\n\nVoici votre contenu optimisé pour ${current.title}.\n\nL'accroche a été forgée pour briser le scroll. Le corps du texte utilise une structure de persuasion directe cohérente avec votre positionnement dominant.\n\n#OutIA #Strategie #Elite`);
            setIsGenerating(false);
        }, 2000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#020408] text-white font-poppins flex flex-col">

            {/* TOP BAR */}
            <div className="border-b border-white/5 p-6 flex items-center justify-between bg-[#020408]">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                    <ArrowLeft size={16} /> Retour Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20">
                        <Sparkles size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">IA Engine v1.0</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row">

                {/* PANNEAU DE CONFIGURATION (GAUCHE) */}
                <div className="w-full lg:w-1/3 border-r border-white/5 p-8 space-y-8 bg-[#020408]">
                    <div>
                        <h1 className="text-2xl font-[900] uppercase italic tracking-tighter mb-2">Configuration</h1>
                        <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest italic">Outil : {current.title}</p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Sujet du contenu</label>
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder={current.placeholder}
                            className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:border-blue-600 outline-none transition-all resize-none placeholder:text-gray-700"
                        />
                    </div>

                    <div className="p-5 rounded-2xl bg-blue-600/5 border border-blue-600/10">
                        <p className="text-[10px] font-black uppercase text-gray-500 mb-2 tracking-widest">ADN de Marque :</p>
                        <p className="text-sm font-bold italic text-white underline decoration-blue-600 underline-offset-4 tracking-tight">"Le Leader" (Dominant)</p>
                        <p className="text-[10px] text-gray-600 font-bold uppercase mt-2 italic">Ton : {current.tone}</p>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white p-5 rounded-2xl font-[900] text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" /> : <Send size={18} />}
                        Forger la version Élite
                    </button>
                </div>

                {/* PANNEAU DE RÉSULTAT (DROITE) */}
                <div className="flex-1 p-8 bg-[#05070A] flex flex-col relative">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em]">Draft Stratégique</h2>
                        </div>

                        {result && (
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 text-blue-500 hover:text-white transition-colors text-[10px] font-black uppercase italic bg-white/5 px-4 py-2 rounded-xl border border-white/5"
                            >
                                {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                                {copied ? "Copié dans le presse-papier" : "Copier le texte"}
                            </button>
                        )}
                    </div>

                    <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-inner">
                        {!result && !isGenerating && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/10">
                                    {current.icon}
                                </div>
                                <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] italic">En attente de vos instructions...</p>
                            </div>
                        )}

                        {isGenerating && (
                            <div className="h-full flex items-center justify-center">
                                <div className="space-y-6 w-full max-w-md">
                                    <div className="h-2 bg-blue-600/40 rounded-full w-full animate-pulse" />
                                    <div className="h-2 bg-white/5 rounded-full w-[80%] animate-pulse delay-75" />
                                    <div className="h-2 bg-blue-600/20 rounded-full w-[90%] animate-pulse delay-150" />
                                    <div className="h-2 bg-white/5 rounded-full w-[60%] animate-pulse delay-200" />
                                </div>
                            </div>
                        )}

                        {result && (
                            <div className="prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-200 whitespace-pre-wrap italic selection:bg-blue-600/30">
                                    {result}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Rappel Bas de page */}
                    <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
                        <div className="h-[1px] w-8 bg-gray-500" />
                        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-500 italic">Precision Tool for High-Ticket Experts</span>
                        <div className="h-[1px] w-8 bg-gray-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}