# ACT6-C2-Exposicion-y-Consumo-de-API de Terceros-The Movie Database

Esta es la aplicación web integral (Frontend) para la Actividad 6, desarrollada con **Next.js (App Router)** y **TypeScript**. Basándonos en los principios de arquitecturas orientadas a servicios (SOA) y priorizando un desarrollo Frontend moderno.

## Cumplimiento de la Rúbrica (Buenas Prácticas y Arquitectura)

- **Patrón BFF (Backend for Frontend):** Para solucionar los problemas de **CORS** del navegador y garantizar el ocultamiento de las credenciales, el cliente (`page.tsx`) nunca se comunica con la API de TMDB directamente. Las peticiones fluyen hacia el servidor intermediario interno de Next.js (`/api/movies/route.ts`).
- **Estados en la UI y Asincronía:** Todas las peticiones implementan un riguroso esquema **async/await**. Además, la interfaz principal maneja explícitamente estados condicionales para dar retroalimentación UX:
  - **Loading:** Pantalla de carga mientras se resuelve la promesa de red.
  - **Success:** Renderizado exitoso de la cuadrícula de tarjetas de películas.
  - **Error:** Si la API falla o la llave se daña, el try-catch despliega una notificación de error en pantalla sin detener o "romper" la página web entera.
- **Cero Variables Hardcodeadas:** La *URL Base* y los *Tokens Bancarizados* para TMDB están fuera del código fuente, residiendo en un archivo local `.env` que el servidor lee directamente en tiempo de ejecución de manera segura y privada.

## Requisitos Previos y Archivo `.env`

Para correr la aplicación de forma local, necesitas crear un archivo `.env` en la raíz de esta carpeta `front/` con tus llaves y sin subirlas a git:

```env
TMDB_API_URL=https://api.themoviedb.org/3/
TMDB_API_TOKEN=Tu_API_Read_Access_Token_AQUI
```

## Ejecución Local

1. Instala las dependencias: `npm install`
2. Levanta el servidor: `npm run dev`
3. Abre: [http://localhost:3000](http://localhost:3000)

Alternativamente, para correr de forma automatizada usando contenedores en puertos aislados, consulta la carpeta `infra/`.
