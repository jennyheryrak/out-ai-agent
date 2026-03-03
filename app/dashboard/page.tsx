"use client";
import React, { useState, useEffect } from 'react';
import {
    Layout, MessageSquare, Lock, Target, TrendingUp,
    Rocket, Clock, Loader2, Sparkles, Settings,
    BarChart3, Image as ImageIcon, Video, Mail, Zap, ShieldCheck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PaywallModal from '../components/PaywallModal';

const getWelcomeMessage = (archetype: string) => {
    const primary = archetype?.split(' / ')[0] || "Leader";

    const messages: any = {
        "Leader": "Prêt à dominer ton marché et asseoir ton autorité ?",
        "Rebelle": "Prêt à briser les codes et disrupter ton industrie ?",
        "Sage": "Prêt à partager ton expertise et éclairer ton audience ?",
        "Créateur": "Prêt à donner vie à tes visions les plus folles ?",
        "Stratège": "Prêt à optimiser tes systèmes et scaler avec précision ?",
        "Mentor": "Prêt à transformer des vies et guider tes clients ?"
    };

    const names: any = {
        "Leader": "Hustler",
        "Rebelle": "Outlaw",
        "Sage": "Expert",
        "Créateur": "Visionnaire",
        "Stratège": "Architecte",
        "Mentor": "Guide"
    };

    return {
        text: messages[primary] || messages["Leader"],
        name: names[primary] || names["Leader"]
    };
};

export default function Dashboard() {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showPaywall, setShowPaywall] = useState(false);

    // ALGORITHME DE DÉCODAGE & PERSONNALISATION (Basé sur ton document)
    const getBrandingConfig = (archetypeStr: string) => {
        const primary = archetypeStr?.split(' / ')[0] || "Leader";

        const configs: Record<string, any> = {
            "Leader": {
                welcome: "Propulse ton Empire, Leader.",
                advice: "Incarne la dominance. Ton contenu doit respirer le pouvoir et l'autorité.",
                color: "text-blue-500",
                tone: "Autorité & Prestige"
            },
            "Rebelle": {
                welcome: "Casse les codes, Rebelle.",
                advice: "Ton audience attend de la disruption. Ne sois pas poli, sois impactant.",
                color: "text-red-500",
                tone: "Disruption & Impact"
            },
            "Sage": {
                welcome: "Partage ta vision, Sage.",
                advice: "Focus sur l'autorité intellectuelle. Les faits sont tes meilleures armes.",
                color: "text-emerald-500",
                tone: "Expertise & Analyse"
            }
        };
        return configs[primary] || configs["Leader"];
    };
    const welcome = getWelcomeMessage(user?.archetype);
    useEffect(() => {
        const initDashboard = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return router.push('/auth');

            const { data: profile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();

            if (profile) {
                setUser({
                    ...profile,
                    isPro: profile.plan === "PRO",
                    displayName: profile.full_name || "Entrepreneur"
                });
            }
            setLoading(false);
        };
        initDashboard();
    }, [router]);

    const handleAction = (type: string, isPremium: boolean = false) => {
        if (isPremium && !user?.isPro) {
            setShowPaywall(true);
            return;
        }
        router.push(`/dashboard/generator?type=${type}`);
    };

    const handleActionOracle = (type: string, isPremium: boolean = false) => {
        if (isPremium && !user?.isPro) {
            setShowPaywall(true);
            return;
        }
        router.push(`/dashboard/${type}`);
    };

    const handleActionPRO = (type: string, isPremium: boolean = false) => {
        // ALGORITHME DE VÉRIFICATION :
        // Si l'utilisateur n'est pas PRO ET qu'il n'a plus de crédits
        if (isPremium && !user?.isPro) {
            setShowPaywall(true);
            return;
        }

        // Sinon, on redirige vers la page de copywriting avec le bon type
        router.push(`/dashboard/copywriting?type=${type}`);
    };

    if (loading || !user) return <div className="min-h-screen bg-[#020408] flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

    const config = getBrandingConfig(user.archetype);



    return (
        <div className="flex min-h-screen bg-[#020408] text-white font-poppins relative">

            {/* SIDEBAR */}
            <aside className="w-72 border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen bg-[#020408] z-50">
                <div className="flex items-center gap-2 mb-12 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black shadow-lg shadow-blue-600/20">O</div>
                    <span className="font-black text-2xl tracking-tighter italic uppercase">OUT<span className="text-blue-600">IA</span></span>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem icon={<Layout size={18} />} label="Dashboard" active />
                    <NavItem icon={<MessageSquare size={18} />} label="Oracle IA" onClick={() => handleActionOracle('chatbot', true)} premium={!user.isPro} />
                    <NavItem icon={<Zap size={18} />} label="Communauté (9€)" onClick={() => window.open('https://t.me/...', '_blank')} />
                </nav>

                <div className="mt-auto p-5 rounded-2xl border border-white/5 bg-white/5">
                    <div className="flex justify-between text-[10px] font-black uppercase mb-3 text-gray-500">
                        <span>Power Reserve</span>
                        <span className="text-blue-500">{user.isPro ? 'MAX' : `${user.credits}/${user.max_credits}`}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${(user.credits / user.max_credits) * 100}%` }} />
                    </div>
                </div>
            </aside>

            {/* LE POP-UP */}
            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                user={user}
            />

            {/* MAIN */}
            <main className="flex-1 p-12 overflow-y-auto">
                <header className="mb-12">
                    {/* HERO SECTION PERSONNALISÉE */}
                    <section className="relative p-10 rounded-[3rem] bg-gradient-to-br from-blue-600/10 to-transparent border border-white/5 overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-blue-600/20 border border-blue-600/30 text-[10px] font-black uppercase tracking-widest text-blue-500">
                                    Status : {user?.isPro ? 'Membre Élite' : 'Explorateur'}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-[900] uppercase italic tracking-tighter mb-4">
                                Bienvenue, <span className="text-blue-600">{welcome.name} !</span>
                            </h1>

                            <p className="text-gray-400 text-lg font-medium italic max-w-xl">
                                {welcome.text} <br />
                                <span className="text-white">Ton arsenal Out IA est prêt pour l'offensive.</span>
                            </p>
                        </div>

                        {/* Décoration en arrière-plan basée sur l'archétype */}
                        <div className="absolute right-[-5%] top-[-10%] opacity-5 pointer-events-none text-[15rem] font-black uppercase italic select-none">
                            {welcome.name}
                        </div>
                    </section>
                </header>


                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    {/* OPTION 1 : STUDIO SOCIAL */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                            <TrendingUp size={16} /> 01. Studio Social (Gratuit)
                        </h2>
                        <div className="grid gap-4">
                            <ActionCard
                                title="LinkedIn Prophet"
                                desc="3 idées + Copy SEO + 5 Hooks"
                                icon={<TrendingUp />}
                                onClick={() => handleAction('linkedin')}
                                tag={`Ton : ${config.tone}`}
                            />
                            <ActionCard
                                title="Ads Killer"
                                desc="Facebook & Insta Ads à haute conversion"
                                icon={<Target />}
                                onClick={() => handleAction('facebook')}
                            />
                        </div>
                    </section>

                    {/* OPTION 2 : ARSENAL VENTE */}
                    <section className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                            <Rocket size={16} /> 02. Arsenal Vente (Premium)
                        </h2>
                        <div className="grid gap-4">
                            <ActionCard
                                title="Pavé de Vente Élite"
                                desc="Landing Page complète & Psychologie de vente"
                                icon={<Zap />}
                                // ON UTILISE LA VERSION PRO ICI
                                onClick={() => handleActionPRO('sales', true)} premium={!user.isPro}
                            />
                            <ActionCard
                                title="Sales Scripts"
                                desc="Scripts de closing personnalisés"
                                icon={<MessageSquare />}
                                // ON UTILISE LA VERSION PRO ICI
                                onClick={() => handleActionPRO('scripts', true)} premium={!user.isPro}
                            />
                        </div>
                    </section>

                    {/* OPTION 3 : PREMIUM TOOLS */}
                    <section className="col-span-1 xl:col-span-2 space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-widest text-purple-500 flex items-center gap-2">
                            <Sparkles size={16} /> 03. Outils Avancés IA (FOMO)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <PremiumToolCard icon={<MessageSquare />} label="Chatbot Custom" />
                            <PremiumToolCard icon={<ImageIcon />} label="Image Gen" />
                            <PremiumToolCard icon={<Video />} label="Video Scripts" />
                        </div>
                    </section>

                    {/* OPTION 4 : TRACKER */}
                    <section className="col-span-1 xl:col-span-2">
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between">
                            <div>
                                <h3 className="text-[10px] font-black uppercase text-gray-500 mb-2">Revenus générés estimés</h3>
                                <div className="text-4xl font-black italic">0,00 €</div>
                            </div>
                            <button className="bg-blue-600 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                                Rejoindre le club Privé (9€/mois)
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

function ActionCard({ title, desc, icon, onClick, tag, premium }: any) {
    return (
        <div onClick={onClick} className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-blue-600/40 transition-all cursor-pointer group flex items-center justify-between mb-2">
            <div>
                <h4 className="font-black uppercase text-sm group-hover:text-blue-500 mb-1">{title}</h4>
                <p className="text-[10px] text-gray-600 font-bold uppercase italic">{desc}</p>
                {tag && <p className="text-[9px] text-blue-500 font-black uppercase mt-3 italic">{tag}</p>}
                {premium && <Lock size={14} className="text-blue-600" />}
            </div>
            <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-600/10 group-hover:text-blue-500">{icon}</div>

        </div>
    );
}

function PremiumToolCard({ icon, label }: any) {
    return (
        <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 flex flex-col items-center justify-center gap-4 relative group cursor-not-allowed opacity-50">
            <Lock size={12} className="absolute top-4 right-4 text-purple-500" />
            <div className="text-gray-700">{icon}</div>
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
    );
}

function NavItem({ icon, label, active, onClick, premium }: any) {
    return (
        <div onClick={onClick} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
            <div className="flex items-center gap-4 font-black text-[10px] uppercase tracking-widest">{icon} {label}</div>
            {premium && <Lock size={14} className="text-blue-600" />}
        </div>
    );
}