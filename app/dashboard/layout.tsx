"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkArchetype = async () => {
            // 1. Vérifier la session Auth
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push('/auth');
                return;
            }

            // 2. Vérifier l'archétype dans la DB
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('archetype')
                .eq('id', user.id)
                .single();

            // 3. Condition de blocage : si null, undefined ou 'Non défini'
            if (profileError || !profile || profile.archetype === 'Non défini' || !profile.archetype) {
                console.log("Accès refusé : Archétype manquant. Direction /test");
                router.push('/test');
            } else {
                // Tout est ok, on laisse passer
                setIsAuthorized(true);
            }
        };

        checkArchetype();
    }, [router]);

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center text-white font-black uppercase tracking-[0.3em]">
                <Loader2 className="animate-spin text-blue-600 mb-6" size={48} />
                <span>Vérification des accès...</span>
            </div>
        );
    }

    return <>{children}</>;
}