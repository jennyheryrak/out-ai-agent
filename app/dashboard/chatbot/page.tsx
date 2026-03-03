"use client";
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
    ArrowLeft, Send, User, Bot, RefreshCw, Zap,
    ShieldCheck, MessageCircle, Terminal, Eye, Target, X, Flame
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // Ton export createBrowserClient

// Types pour la clarté
interface Message {
    id: string;
    session_id: string;
    content: string;
    role: 'user' | 'assistant';
    created_at: string;
}

interface ChatSession {
    id: string;
    title: string;
    archetype_at_creation: string;
    created_at: string;
}

export default function ChatbotPage() {
    // ÉTATS
    const [user, setUser] = useState<any>(null);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // ARCHÉTYPE (À lier à ton état global ou base de données)
    const userArchetype = "Rebelle / Stratège";
    const primaryArchetype = userArchetype.split(' / ')[0];

    // 1. CONFIGURATION VISUELLE DYNAMIQUE
    const getTheme = () => {
        if (primaryArchetype === "Rebelle") return { color: "text-red-500", bg: "bg-red-600", border: "border-red-600/20", lightBg: "bg-red-600/5", shadow: "shadow-red-600/20" };
        if (primaryArchetype === "Leader") return { color: "text-blue-500", bg: "bg-blue-600", border: "border-blue-600/20", lightBg: "bg-blue-600/5", shadow: "shadow-blue-600/20" };
        if (primaryArchetype === "Sage") return { color: "text-emerald-500", bg: "bg-emerald-600", border: "border-emerald-600/20", lightBg: "bg-emerald-600/5", shadow: "shadow-emerald-600/20" };
        return { color: "text-orange-500", bg: "bg-orange-600", border: "border-orange-600/20", lightBg: "bg-orange-600/5", shadow: "shadow-orange-600/20" };
    };
    const theme = getTheme();

    // 2. INITIALISATION : Charger User & Sessions
    useEffect(() => {
        const initChat = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                fetchSessions(session.user.id);
            }
        };
        initChat();
    }, []);

    const fetchSessions = async (userId: string) => {
        const { data } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (data) setSessions(data);
    };

    // 3. CHARGER UNE SESSION
    const loadSession = async (sessionId: string) => {
        setCurrentSessionId(sessionId);
        const { data } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });
        if (data) setMessages(data);
    };

    // 4. ENVOYER UN MESSAGE
    const handleSend = async () => {
        if (!input.trim() || !user || isTyping) return;

        let sessionId = currentSessionId;

        // Création auto de session si vide
        if (!sessionId) {
            const { data: newSession } = await supabase
                .from('chat_sessions')
                .insert([{
                    user_id: user.id,
                    title: input.substring(0, 30),
                    archetype_at_creation: userArchetype
                }])
                .select()
                .single();

            if (newSession) {
                sessionId = newSession.id;
                setCurrentSessionId(sessionId);
                setSessions(prev => [newSession, ...prev]);
            }
        }

        // Sauvegarde message utilisateur
        const { data: userMsg } = await supabase
            .from('chat_messages')
            .insert([{ session_id: sessionId, content: input, role: 'user' }])
            .select()
            .single();

        if (userMsg) setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput("");
        setIsTyping(true);

        // --- APPEL n8n (Logique de discussion réelle) ---
        try {
            const response = await fetch('https://n8n.chinese-kool.com/webhook/dd22dade-63ad-4b6f-889d-f2da6e7865d9', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: currentInput,
                    sessionId: sessionId,
                    archetype: userArchetype,
                    tool: "oracle",
                    history: messages.slice(-4) // Envoie le contexte récent
                }),
            });
            const n8nData = await response.json();

            // Sauvegarde réponse assistant
            const { data: botMsg } = await supabase
                .from('chat_messages')
                .insert([{
                    session_id: sessionId,
                    content: n8nData.output || "L'Oracle est indisponible.",
                    role: 'assistant'
                }])
                .select()
                .single();

            if (botMsg) setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            console.error("Erreur n8n", err);
        } finally {
            setIsTyping(false);
        }
    };

    // 5. SUPPRIMER SESSION
    const deleteSession = async (id: string) => {
        await supabase.from('chat_sessions').delete().eq('id', id);
        setSessions(prev => prev.filter(s => s.id !== id));
        if (currentSessionId === id) {
            setMessages([]);
            setCurrentSessionId(null);
        }
    };

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, isTyping]);

    return (
        <div className="flex h-screen bg-[#020408] text-white font-poppins overflow-hidden">

            {/* SIDEBAR */}
            <aside className="hidden lg:flex w-80 border-r border-white/5 flex-col p-6 bg-[#020408]">
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-10 group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Retour Arsenal
                </Link>

                {/* PROFIL ANALYSÉ */}
                <div className="mb-8">
                    <h3 className="text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4">Profil Analysé</h3>
                    <div className={`p-4 rounded-2xl ${theme.lightBg} border ${theme.border} flex items-center gap-3`}>
                        <ShieldCheck size={18} className={theme.color} />
                        <div>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${theme.color}`}>{userArchetype}</p>
                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter">Oracle Connecté</p>
                        </div>
                    </div>
                </div>

                {/* NOUVELLE SESSION */}
                <button
                    onClick={() => { setCurrentSessionId(null); setMessages([]); }}
                    className="w-full py-4 mb-8 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={14} /> Nouvelle Analyse
                </button>

                {/* HISTORIQUE */}
                <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
                    <h3 className="text-[10px] font-black uppercase text-gray-600 tracking-[0.3em] mb-4">Anciennes Oracles</h3>
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            onClick={() => loadSession(session.id)}
                            className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${currentSessionId === session.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <MessageCircle size={14} className={currentSessionId === session.id ? theme.color : "text-gray-600"} />
                                <span className={`text-[11px] font-medium truncate ${currentSessionId === session.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                    {session.title}
                                </span>
                            </div>
                            <X size={12} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all" onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }} />
                        </div>
                    ))}
                </div>
            </aside>

            {/* CHAT MAIN */}
            <main className="flex-1 flex flex-col relative bg-[#05070A]/50">

                {/* MESSAGES */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 no-scrollbar">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                            <Bot size={48} className="mb-4" />
                            <p className="text-xs font-black uppercase tracking-[0.5em]">L'Oracle attend vos ordres</p>
                        </div>
                    )}
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                            <div className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-white text-black' : `${theme.bg} text-white`}`}>
                                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                                </div>
                                <div className={`p-6 rounded-[2rem] text-sm md:text-base leading-relaxed ${msg.role === 'user' ? 'bg-white/5 border border-white/10 rounded-tr-none' : `${theme.lightBg} border ${theme.border} rounded-tl-none italic font-medium text-gray-200`}`}>
                                    {msg.role === 'assistant' ? (
                                        <div className="markdown-container prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50">
                                            <ReactMarkdown>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className={`flex gap-4 items-center ${theme.lightBg} px-6 py-4 rounded-full border ${theme.border} text-[10px] font-black uppercase ${theme.color} tracking-widest animate-pulse`}>
                                <RefreshCw size={14} className="animate-spin" /> Analyse en cours...
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
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Entrez une commande stratégique..."
                            className={`w-full bg-[#020408] border border-white/10 rounded-2xl py-6 px-8 pr-20 outline-none focus:${theme.border} transition-all shadow-2xl text-sm md:text-base`}
                        />
                        <button onClick={handleSend} disabled={isTyping} className={`absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 ${theme.bg} rounded-xl flex items-center justify-center hover:opacity-80 transition-all shadow-lg ${theme.shadow} disabled:opacity-50`}>
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Composant Helper pour les capacités (Sidebar)
function CapabilityItem({ icon, label, theme, active = false }: any) {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors cursor-default ${active ? 'text-white bg-white/5' : 'text-gray-600 opacity-40'}`}>
            <div className={active ? theme.color : ''}>{icon}</div>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
    );
}

// Icône Plus manquante dans lucide
function Plus({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}