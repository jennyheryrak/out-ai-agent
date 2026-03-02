import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    // On définit explicitement 'value' comme une chaîne vide 
                    // pour éviter l'erreur "No value exists in scope"
                    request.cookies.set({
                        name: name,
                        value: '',
                        ...options
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name: name,
                        value: '',
                        ...options
                    })
                },
            },
        }
    )

    // IMPORTANT: Ne pas supprimer cet appel. 
    // Il rafraîchit le token de session si nécessaire.
    await supabase.auth.getUser()

    return response
}

export const config = {
    matcher: [
        /*
         * Match tous les chemins sauf :
         * - _next/static (fichiers statiques)
         * - _next/image (optimisation d'images)
         * - favicon.ico (icône du site)
         * - les fichiers avec extensions (svg, jpg, etc.)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}