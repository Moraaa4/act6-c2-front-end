import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const tmdbUrl = process.env.TMDB_API_URL || 'https://api.themoviedb.org/3/';
        const tmdbToken = process.env.TMDB_API_TOKEN;

        if (!tmdbToken) {
            console.error('[Next API Error]: TMDB_API_TOKEN is missing in environment variables.');
            return NextResponse.json(
                { success: false, message: 'Falta configurar el Token de acceso a TMDB en el servidor.' },
                { status: 500 }
            );
        }

        const response = await fetch(`${tmdbUrl}movie/popular?language=es-MX&page=1`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdbToken}`,
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Next API Error]: TMDB Connection failed - ${response.status} ${response.statusText}`, errorText);
            return NextResponse.json(
                { success: false, message: 'Hubo un error al comunicarse con el servicio externo de películas.' },
                { status: 502 }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            success: true,
            data: data.results,
        });
    } catch (error: any) {
        console.error(`[Next API Error]: ${error.message}`);
        return NextResponse.json(
            { success: false, message: 'Fallo inesperado consultando las películas.', error: error.message },
            { status: 500 }
        );
    }
}
