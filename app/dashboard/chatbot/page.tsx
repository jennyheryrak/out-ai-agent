"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft, Send, Sparkles, User,
    Bot, RefreshCw, Zap, ShieldCheck,
    MessageCircle, Terminal
} from 'lucide-react';
import Link from 'next/link';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Je suis votre Oracle OutIA. Mon analyse de votre profil 'Leader' est prête. Quelle décision stratégique devons-nous valider aujourd'hui ?", sender: 'bot' }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll vers le bas
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Simulation de la réponse de l'IA
        setTimeout(() => {
            const botMsg: Message = {
                id: Date.now() + 1,
                text: "Analyse en cours... En tant que Leader, votre priorité ne doit pas être la validation, mais la domination du marché. Votre question suggère une hésitation que nous allons éliminer par une structure de données stricte.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="flex h-screen bg-[#020408] text-white font-poppins overflow-hidden">

            {/* SIDEBAR CHAT (Historique & Status) */}
            <aside className="hidden lg:flex w-80 border-r border-white/5 flex-col p-6 bg-[#020408]">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-12 group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Quitter le mode Oracle
                </Link>

                <div className="flex-1 space-y-6">
                    <div>
                        <h3 className="text-[10px] font-black uppercase text-blue-500 tracking-[0.3em] mb-4">Statut de l'IA</h3>
                        <div className="p-4 rounded-2xl bg-blue-600/5 border border-blue-600/20 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-xs font-bold italic italic">Mode Dominance Actif</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4">Capacités Débloquées</h3>
                        <CapabilityItem icon={<Zap size={14} />} label="Analyse de Concurrence" />
                        <CapabilityItem icon={<ShieldCheck size={14} />} label="Validation d'Offre" />
                        <CapabilityItem icon={<Terminal size={14} />} label="Optimisation de Pitch" />
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 mt-auto">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Crédits Oracle</p>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-3/4" />
                    </div>
                </div>
            </aside>

            {/* CHAT INTERFACE */}
            <main className="flex-1 flex flex-col relative bg-[#05070A]/50">

                {/* HEADER MOBILE/TABLET */}
                <header className="p-6 border-b border-white/5 flex items-center justify-between lg:justify-end bg-[#020408]">
                    <div className="lg:hidden flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-[900]">O</div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <MessageCircle size={16} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Oracle Session #402</span>
                    </div>
                </header>

                {/* MESSAGES AREA */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                            <div className={`flex gap-4 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${msg.sender === 'user' ? 'bg-white text-black' : 'bg-blue-600 text-white'}`}>
                                    {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                                </div>
                                <div className={`p-6 rounded-[2rem] text-sm md:text-base leading-relaxed ${msg.sender === 'user' ? 'bg-white/5 border border-white/10 rounded-tr-none' : 'bg-blue-600/10 border border-blue-600/20 rounded-tl-none italic'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start animate-pulse">
                            <div className="flex gap-4 items-center bg-blue-600/5 px-6 py-4 rounded-full border border-blue-600/10 text-[10px] font-black uppercase text-blue-400 tracking-widest">
                                <RefreshCw size={14} className="animate-spin" />
                                L'Oracle réfléchit...
                            </div>
                        </div>
                    )}
                </div>

                {/* INPUT AREA */}
                <div className="p-6 md:p-12 bg-gradient-to-t from-[#020408] to-transparent">
                    <div className="max-w-4xl mx-auto relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Posez votre question stratégique..."
                            className="w-full bg-[#020408] border border-white/10 rounded-2xl py-6 px-8 pr-20 outline-none focus:border-blue-600 transition-all shadow-2xl text-sm md:text-base font-medium"
                        />
                        <button
                            onClick={handleSend}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all active:scale-90 shadow-lg shadow-blue-600/20"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <p className="text-center mt-6 text-[8px] font-bold text-gray-700 uppercase tracking-[0.5em]">Toutes les conversations sont cryptées et privées.</p>
                </div>
            </main>
        </div>
    );
}

function CapabilityItem({ icon, label }: any) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default text-gray-400 hover:text-white">
            <div className="text-blue-500">{icon}</div>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
    );
}

