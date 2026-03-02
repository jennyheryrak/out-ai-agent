"use client";
import React, { useState } from 'react';
import { Mail, Lock, ChevronRight, Github, Chrome, Loader2, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // États inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            if (isLogin) {
                // CONNEXION
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                
                if (error) throw error;

                if (data.user) {
                    setSuccessMessage("Accès autorisé. Initialisation...");
                    setTimeout(() => router.push('/dashboard'), 1500);
                }
            } else {
                // INSCRIPTION
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                        // Redirection automatique après confirmation mail (si configuré)
                        emailRedirectTo: `${window.location.origin}/dashboard`,
                    },
                });

                if (error) throw error;

                // Gestion du cas où la confirmation mail est activée
                if (data.user && data.session === null) {
                    setSuccessMessage("Check tes mails pour valider ton accès Elite.");
                    // On ne bascule pas direct en login pour laisser l'utilisateur lire
                } else {
                    setSuccessMessage("Empire créé ! Bienvenue.");
                    setTimeout(() => router.push('/dashboard'), 1500);
                }
            }
        } catch (err: any) {
            // Traduction des erreurs courantes pour le style
            let msg = err.message;
            if (msg.includes("Invalid login credentials")) msg = "Identifiants invalides. Es-tu vraiment des nôtres ?";
            if (msg.includes("User already registered")) msg = "Cet email appartient déjà à l'élite.";
            setErrorMessage(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05070A] text-white flex flex-col md:flex-row font-poppins selection:bg-blue-600/30">

            {/* CÔTÉ GAUCHE : VISUEL */}
            <div className="hidden md:flex md:w-1/2 bg-blue-600 p-16 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 mb-16 group">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-[900] text-blue-600 text-xl group-hover:scale-110 transition-transform shadow-lg">O</div>
                        <span className="text-2xl font-[900] tracking-tighter uppercase text-white">OUT<span className="opacity-70">IA</span></span>
                    </Link>

                    <div className="space-y-6">
                        <h2 className="text-6xl font-[900] uppercase italic leading-[0.85] tracking-tighter animate-in slide-in-from-left duration-700">
                            {isLogin ? "Content de te revoir, Hustler." : "Rejoins l'élite stratégique."}
                        </h2>
                        <p className="text-blue-100 text-xl font-medium max-w-sm leading-relaxed opacity-80 italic">
                            {isLogin
                                ? "Reprends le contrôle de ton empire digital."
                                : "Automatise ton autorité avec l'IA."}
                        </p>
                    </div>
                </div>

                <div className="relative z-10 bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 max-w-md shadow-2xl">
                    <Sparkles className="text-white/40 mb-4" size={24} />
                    <p className="text-sm italic font-bold tracking-tight leading-relaxed">
                        "Le branding n'est pas ce que vous dites, c'est ce qu'ils ressentent. OutIA sculpte ce sentiment."
                    </p>
                </div>

                {/* Décoration sphérique */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-black/20 rounded-full blur-[80px]" />
            </div>

            {/* CÔTÉ DROIT : FORMULAIRE */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-[#05070A] relative overflow-hidden">
                
                <div className="w-full max-w-md space-y-10 relative z-10">

                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-4xl font-[900] uppercase tracking-tighter italic">
                            {isLogin ? "Connexion" : "Inscription"}
                        </h1>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">
                            Accède à ton arsenal stratégique
                        </p>
                    </div>

                    {/* MESSAGES D'ÉTAT STYLISÉS */}
                    <div className="min-h-[60px]">
                        {errorMessage && (
                            <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-[11px] font-black uppercase tracking-tight italic animate-in fade-in zoom-in duration-300">
                                <AlertCircle size={18} /> {errorMessage}
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 text-emerald-500 text-[11px] font-black uppercase tracking-tight italic animate-in fade-in zoom-in duration-300">
                                <CheckCircle2 size={18} /> {successMessage}
                            </div>
                        )}
                    </div>

                    {/* Formulaire */}
                    <form className="space-y-4" onSubmit={handleAuth}>
                        {!isLogin && (
                            <div className="space-y-2 group animate-in slide-in-from-top-4 duration-300">
                                <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">Nom complet</label>
                                <div className="relative">
                                    <input
                                        required
                                        type="text"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl focus:outline-none focus:border-blue-600 transition-all pl-12 text-sm font-bold placeholder:text-gray-700 focus:bg-white/[0.05]"
                                    />
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 italic font-black text-xs">@</div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">Email Stratégique</label>
                            <div className="relative">
                                <input
                                    required
                                    type="email"
                                    placeholder="hustler@outia.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl focus:outline-none focus:border-blue-600 transition-all pl-12 text-sm font-bold placeholder:text-gray-700 focus:bg-white/[0.05]"
                                />
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">Mot de passe</label>
                            <div className="relative">
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 p-5 rounded-2xl focus:outline-none focus:border-blue-600 transition-all pl-12 text-sm font-bold placeholder:text-gray-700 focus:bg-white/[0.05]"
                                />
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-6 rounded-2xl font-[900] text-xs uppercase tracking-[0.4em] shadow-[0_15px_40px_rgba(37,99,235,0.25)] transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50 mt-10"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    {isLogin ? "Lancer la session" : "Créer mon empire"}
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-6">
                        <p className="text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
                            {isLogin ? "Nouveau dans l'arène ?" : "Déjà membre de l'élite ?"}
                            <button
                                type="button"
                                onClick={() => { setIsLogin(!isLogin); setErrorMessage(""); setSuccessMessage(""); }}
                                className="text-blue-500 ml-2 hover:text-blue-400 italic transition-colors underline underline-offset-4 decoration-blue-500/20 hover:decoration-blue-500"
                            >
                                {isLogin ? "Inscris-toi" : "Connecte-toi"}
                            </button>
                        </p>
                    </div>

                </div>

                {/* Background décoratif discret */}
                <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] -z-10" />
            </div>
        </div>
    );
}