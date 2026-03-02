"use client";
import React from 'react';
import { Mail, Lock, ChevronRight, Github, Chrome, User, Target, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#05070A] text-white font-poppins flex flex-col md:flex-row">

            {/* SECTION GAUCHE : LE MANIFESTE (PUNCHY) */}
            <div className="hidden md:flex md:w-[45%] bg-blue-700 p-16 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 mb-16">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-[900] text-blue-700 text-xl">O</div>
                        <span className="text-2xl font-[900] tracking-tighter uppercase text-white">OUT<span className="opacity-70">IA</span></span>
                    </Link>

                    <h2 className="text-6xl font-[900] uppercase italic leading-[0.9] tracking-tighter mb-8">
                        REJOINS <br /> <span className="text-blue-200">L'ÉLITE</span> <br /> STRATÉGIQUE.
                    </h2>

                    <ul className="space-y-6">
                        <li className="flex items-center gap-4 group">
                            <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                                <Target size={20} className="text-blue-100" />
                            </div>
                            <p className="font-bold text-sm tracking-tight">Débloque ton Archétype Dominant</p>
                        </li>
                        <li className="flex items-center gap-4 group">
                            <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                                <ShieldCheck size={20} className="text-blue-100" />
                            </div>
                            <p className="font-bold text-sm tracking-tight">Accès à l'Arsenal IA (19€/mois)</p>
                        </li>
                    </ul>
                </div>

                <div className="relative z-10">
                    <div className="flex -space-x-3 mb-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-700 bg-gray-800 flex items-center justify-center text-[10px] font-black italic">H</div>
                        ))}
                        <div className="w-10 h-10 rounded-full border-2 border-blue-700 bg-white text-blue-700 flex items-center justify-center text-[10px] font-black">+500</div>
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">Hustlers déjà actifs sur Out IA</p>
                </div>

                {/* Effet visuel de fond */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />
            </div>

            {/* SECTION DROITE : LE FORMULAIRE D'INSCRIPTION */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-[#05070A]">
                <div className="w-full max-w-md space-y-10">

                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-[900] uppercase tracking-tighter mb-3">Créer ton profil</h1>
                        <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] italic">
                            Commence ton diagnostic stratégique
                        </p>
                    </div>

                    {/* Social Auth Rapide */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest">
                            <Chrome size={18} /> Google
                        </button>
                        <button className="flex items-center justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest">
                            <Github size={18} /> Github
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black text-gray-700 tracking-[0.4em]"><span className="bg-[#05070A] px-6 italic">Ou Email</span></div>
                    </div>

                    {/* Formulaire */}
                    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">Nom Complet</label>
                            <div className="relative">
                                <input type="text" placeholder="Hustler Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all pl-12 text-sm font-bold" />
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">Adresse Email</label>
                            <div className="relative">
                                <input type="email" placeholder="nom@agence.com" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-blue-600 transition-all pl-12 text-sm font-bold" />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">Mot de passe</label>
                            <div className="relative">
                                <input type="password" placeholder="••••••••••••" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-blue-600 transition-all pl-12 text-sm font-bold" />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                            </div>
                        </div>

                        <div className="pt-6">
                            <Link href="/dashboard">
                                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl font-[900] text-sm uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                                    CRÉER MON ACCÈS ÉLITE
                                    <ChevronRight size={20} />
                                </button>
                            </Link>
                        </div>
                    </form>

                    <p className="text-center text-gray-600 text-[11px] font-bold uppercase tracking-widest">
                        Déjà membre de l'autorité ?
                        <Link href="/auth" className="text-blue-500 ml-2 hover:underline italic font-[900]">
                            Connexion
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}