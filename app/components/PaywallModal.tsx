"use client";
import React from 'react';
import { X, Zap, CheckCircle2, Crown, Rocket, ShieldCheck } from 'lucide-react';

export default function PaywallModal({ isOpen, onClose, user }: any) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Overlay sombre */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-[500px] bg-[#0A0C10] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-500/10 animate-in zoom-in-95 duration-300">

                {/* Header avec Image/Icon */}
                <div className="bg-gradient-to-b from-blue-600/20 to-transparent p-12 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-gray-500 hover:text-white transition-all"
                    >
                        <X size={24} />
                    </button>

                    <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/40 rotate-12">
                        <Crown size={40} className="text-white" />
                    </div>

                    <h2 className="text-3xl font-[900] italic uppercase tracking-tighter mb-2">
                        Passe au Niveau <span className="text-blue-500">PRO</span>
                    </h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                        Débloque la puissance maximale d'OutIA
                    </p>
                </div>

                {/* Liste des avantages */}
                <div className="px-10 pb-6 space-y-4">
                    <Benefit icon={<Zap size={18} />} text="Crédits illimités (Génération infinie)" />
                    <Benefit icon={<ShieldCheck size={18} />} text="Accès Arsenal de Vente (Landing Pages)" />
                    <Benefit icon={<Rocket size={18} />} text="Scripts de Closing Haute-Conversion" />
                    <Benefit icon={<CheckCircle2 size={18} />} text="Support Prioritaire 24/7" />
                </div>

                {/* Footer / Action */}
                <div className="p-10 pt-0 text-center">
                    <button
                        onClick={() => window.location.href = '/checkout'} // Remplace par ton lien Stripe
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white p-6 rounded-2xl font-[900] text-sm uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 mb-6 group"
                    >
                        <span className="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                            Devenir un Leader PRO <Rocket size={18} />
                        </span>
                    </button>

                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest italic">
                        Abonnement mensuel sans engagement • 19€/mois
                    </p>
                </div>
            </div>
        </div>
    );
}

function Benefit({ icon, text }: any) {
    return (
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
            <div className="text-blue-500">{icon}</div>
            <span className="text-xs font-bold uppercase tracking-wide text-gray-300">{text}</span>
        </div>
    );
}