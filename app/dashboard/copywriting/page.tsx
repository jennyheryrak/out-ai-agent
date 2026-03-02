"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    ArrowLeft, Send, Copy, RefreshCw,
    FileText, Mail, ShieldCheck, Sparkles,
    CheckCircle2, ChevronRight, Target
} from 'lucide-react';
import Link from 'next/link';

export default function CopywritingPage() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'landing';

    const [offer, setOffer] = useState("");
    const [target, setTarget] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState("");
    const [copied, setCopied] = useState(false);

    const configs: any = {
        landing: {
            title: "Landing Page (VSL)",
            icon: <FileText size={32} className="text-blue-500" />,
            placeholderOffer: "Ex: Accompagnement High-Ticket pour consultants SEO...",
            placeholderTarget: "Ex: Freelances qui stagnent à 3k€/mois...",
            structure: "Structure AIDA (Attention, Intérêt, Désir, Action)"
        },
        email: {
            title: "Séquence Email Cold",
            icon: <Mail size={32} className="text-blue-500" />,
            placeholderOffer: "Ex: Audit gratuit de tunnel de vente...",
            placeholderTarget: "Ex: CEOs d'agences marketing de +10 salariés...",
            structure: "Séquence de 3 emails (Brise-glace, Valeur, Closing)"
        }
    };

    const current = configs[type] || configs.landing;

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setResult(`[ARSENAL DE VENTE - ARCHÉTYPE LE LEADER]\n\nOBJET : La fin des approximations pour votre business.\n\n--- STRUCTURE GÉNÉRÉE ---\n\n1. L'ACCROCHE DOMINANTE :\n"Pendant que vos concurrents testent des 'astuces', nous construisons des empires."\n\n2. LE CORPS DU TEXTE :\nIci, l'IA OutIA injecte votre ADN de Leader. On ne demande pas, on affirme. On montre que le prospect a un problème que SEUL votre système peut résoudre.\n\n3. L'APPEL À L'ACTION (CTA) :\nCliquez ici pour arrêter de perdre du temps.\n\n#VenteElite #OutIA`);
            setIsGenerating(false);
        }, 3000); // Plus long car contenu plus dense
    };

    return (
        <div className="min-h-screen bg-[#020408] text-white font-poppins flex flex-col">

            {/* TOP BAR */}
            <div className="border-b border-white/5 p-6 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour Arsenal
                </Link>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 italic">Module Haute-Conversion</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row">

                {/* CONFIGURATION (GAUCHE) */}
                <div className="w-full lg:w-[450px] border-r border-white/5 p-10 space-y-10 bg-[#020408]">
                    <div>
                        <div className="mb-4">{current.icon}</div>
                        <h1 className="text-3xl font-[900] uppercase italic tracking-tighter mb-2">{current.title}</h1>
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">{current.structure}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                                <Target size={12} className="text-blue-600" /> Votre Offre Irrésistible
                            </label>
                            <textarea
                                value={offer}
                                onChange={(e) => setOffer(e.target.value)}
                                placeholder={current.placeholderOffer}
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:border-blue-600 outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                                <ChevronRight size={12} className="text-blue-600" /> Cible (Avatar Client)
                            </label>
                            <input
                                type="text"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                placeholder={current.placeholderTarget}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm font-medium focus:border-blue-600 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="p-6 rounded-[2rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-600/20 relative overflow-hidden group">
                        <Sparkles className="absolute right-[-10px] bottom-[-10px] text-blue-600/10 w-20 h-20" />
                        <p className="text-[10px] font-black uppercase text-blue-500 mb-2 tracking-widest italic">Intelligence Appliquée :</p>
                        <p className="text-sm font-bold italic leading-snug">L'IA va structurer votre texte en utilisant les biais cognitifs de l'archétype <span className="text-blue-600">Leader</span>.</p>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !offer}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white p-6 rounded-2xl font-[900] text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20"
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" /> : "Générer l'Arme de Vente"}
                    </button>
                </div>

                {/* RESULTAT (DROITE) */}
                <div className="flex-1 p-8 md:p-12 bg-[#05070A] overflow-y-auto">
                    <div className="max-w-4xl mx-auto h-full flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.4em]">Script de Vente Final</h2>
                            {result && (
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(result);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="flex items-center gap-2 text-blue-500 hover:text-white transition-all text-[10px] font-black uppercase italic bg-white/5 px-6 py-2 rounded-full border border-white/10"
                                >
                                    {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                                    {copied ? "Copié" : "Copier le Script"}
                                </button>
                            )}
                        </div>

                        <div className="flex-1 bg-[#020408] border border-white/5 rounded-[3rem] p-10 md:p-16 relative shadow-2xl">
                            {!result && !isGenerating && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                    <FileText size={48} className="mb-6 text-gray-600" />
                                    <p className="text-xs font-black uppercase tracking-[0.3em]">Configurez votre offre pour forger votre texte de vente.</p>
                                </div>
                            )}

                            {isGenerating && (
                                <div className="h-full flex flex-col justify-center space-y-6">
                                    <div className="h-3 bg-blue-600/20 rounded-full w-full animate-pulse" />
                                    <div className="h-3 bg-white/5 rounded-full w-[90%] animate-pulse delay-75" />
                                    <div className="h-3 bg-blue-600/10 rounded-full w-[95%] animate-pulse delay-150" />
                                    <div className="h-3 bg-white/5 rounded-full w-2/3 animate-pulse delay-200" />
                                </div>
                            )}

                            {result && (
                                <div className="prose prose-invert max-w-none animate-in fade-in duration-1000">
                                    <p className="text-lg md:text-xl font-medium leading-relaxed text-gray-300 whitespace-pre-wrap italic">
                                        {result}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}