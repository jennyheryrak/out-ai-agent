"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Initialisation de tous les archétypes possibles selon ton document stratégique
    const [scores, setScores] = useState<any>({
        Rebelle: 0, Sage: 0, Leader: 0,
        Créateur: 0, Stratège: 0, Mentor: 0,
        Magicien: 0, Explorateur: 0, Altruiste: 0 // Sécurité si présents dans la DB
    });

    const router = useRouter();

    // 1. CHARGEMENT DES QUESTIONS
    useEffect(() => {
        const loadQuestions = async () => {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .order('id', { ascending: true });

            if (data) {
                setQuestions(data);
            } else {
                console.error("Erreur de chargement des questions:", error);
            }
            setLoading(false);
        };
        loadQuestions();
    }, []);

    // 2. LOGIQUE DE RÉPONSE ET SAUVEGARDE
    const handleAnswer = async (optionScores: any) => {
        // Mise à jour locale des scores (calcul immédiat pour la sauvegarde)
        const updatedScores = { ...scores };
        if (optionScores) {
            Object.keys(optionScores).forEach(key => {
                updatedScores[key] = (updatedScores[key] || 0) + optionScores[key];
            });
        }
        setScores(updatedScores);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            // --- FIN DU TEST : SAUVEGARDE CRITIQUE ---
            setIsSaving(true);

            try {
                // A. Récupérer l'utilisateur avec getSession (plus fiable pour l'écriture)
                const { data: { session } } = await supabase.auth.getSession();
                const user = session?.user;

                if (!user) {
                    throw new Error("Utilisateur non authentifié. Impossible de sauvegarder.");
                }

                // B. Calculer les archétypes (Dominant / Secondaire)
                const sorted = Object.entries(updatedScores)
                    .sort((a: any, b: any) => b[1] - a[1]);

                const dominant = sorted[0][0];
                const secondary = sorted[1] ? sorted[1][0] : sorted[0][0];
                const archetypeFinal = `${dominant} / ${secondary}`;

                console.log("Tentative d'enregistrement pour l'ID:", user.id);
                console.log("Valeur calculée:", archetypeFinal);

                // C. Mise à jour dans Supabase
                const { data, error, status } = await supabase
                    .from('profiles')
                    .update({
                        archetype: archetypeFinal,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', user.id)
                    .select();

                if (error) throw error;

                // Vérifier si une ligne a vraiment été modifiée
                if (!data || data.length === 0) {
                    console.error("Erreur : Aucune ligne trouvée dans 'profiles' pour cet ID.");
                    alert("Erreur : Profil introuvable en base de données.");
                    setIsSaving(false);
                    return;
                }

                console.log("Enregistrement réussi ! Status:", status);

                // D. Redirection après un court délai pour l'effet "WOW"
                setTimeout(() => router.push('/dashboard'), 2000);

            } catch (err: any) {
                console.error("ERREUR FINALE :", err.message);
                alert("La sauvegarde a échoué : " + err.message);
                setIsSaving(false);
            }
        }
    };

    const progress = questions.length > 0 ? ((step + 1) / questions.length) * 100 : 0;

    if (loading) return (
        <div className="min-h-screen bg-[#05070A] flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    if (isSaving) return (
        <div className="min-h-screen bg-[#05070A] text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-8">
                <div className="absolute -inset-10 bg-blue-600/20 blur-3xl rounded-full animate-pulse" />
                <Loader2 className="animate-spin text-blue-600 relative" size={80} strokeWidth={1} />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" size={32} />
            </div>
            <h2 className="text-4xl font-[900] uppercase italic tracking-tighter mb-4 animate-in fade-in zoom-in duration-700">
                Analyse de ton <span className="text-blue-600">ADN...</span>
            </h2>
            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                Synchronisation stratégique avec ton profil OutIA
            </p>
        </div>
    );

    const currentQ = questions[step];

    return (
        <div className="min-h-screen bg-[#05070A] text-white font-poppins flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-2xl w-full relative z-10">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 block mb-1">Branding Archétypal</span>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Étape {step + 1} <span className="text-gray-800">/ {questions.length}</span></h3>
                    </div>
                    <span className="text-2xl font-black italic text-white/10">{Math.round(progress)}%</span>
                </div>

                <div className="h-1.5 w-full bg-white/5 rounded-full mb-16 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-400 transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="min-h-[120px]">
                    <h2 className="text-3xl md:text-5xl font-[900] uppercase italic tracking-tighter mb-12 leading-[0.95] animate-in slide-in-from-bottom-2 duration-500">
                        {currentQ?.question_text}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { text: currentQ?.option_a, score: currentQ?.score_a },
                        { text: currentQ?.option_b, score: currentQ?.score_b },
                        { text: currentQ?.option_c, score: currentQ?.score_c },
                        { text: currentQ?.option_d, score: currentQ?.score_d }
                    ].filter(o => o.text).map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(opt.score)}
                            className="group relative w-full text-left p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-blue-600/50 hover:bg-blue-600/[0.02] transition-all duration-300"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-400 group-hover:text-white transition-colors pr-8">
                                    {opt.text}
                                </span>
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300 shadow-lg">
                                    <ChevronRight size={20} className="text-gray-600 group-hover:text-white" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}