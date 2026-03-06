# APP de Moraaa (Next.js App Router)

Esta es la aplicación web integral para la Actividad 6. Basándonos en los principios de arquitecturas orientadas a servicios (SOA) y priorizando un desarrollo Full-Stack.

## Arquitectura de Seguridad
La profesora estipuló firmemente: **"Variables de entorno hardcodeadas" están prohibidas.** Dado que estamos consumiendo la API de terceros The Movie Database (TMDB) que requiere un token bancarizado privado, es **inseguro** hacer peticiones directamente desde los componentes de React del cliente (`page.tsx`).

Para solucionar esto elegantemente sin necesidad de un repositorio extra:
1.  **Frontend (UI):** Interactúa y renderiza únicamente desde `src/app/page.tsx`. Reacciona al Loading, Success y Error estéticamente usando Grid.
2.  **Proxy de Next.js (API Route):** Construimos una ruta de servidor interna en `src/app/api/movies/route.ts`. 
3.  **Flujo Seguro:** La UI le pide las películas a nuestra propia ruta `/api/movies`. El servidor de Next.js lee el secreto en sus variables locales, se lo adjunta a la conexión, negocia con TMDB, y le regresa limpio el resultado al Cliente. Así, la llave jamás sale a internet.

## Requisitos Previos y .env
Para correr, necesitas crear un archivo `.env` en la raíz de esta carpeta `front/` con la siguiente llave (la cual no se subió a git por seguridad):

```env
TMDB_API_URL=https://api.themoviedb.org/3/
TMDB_API_TOKEN=Tu_API_Read_Access_Token_AQUI
```

## Despliegue con Docker Compose
Puedes ir a la carpeta vecina `infra/` y ejecutar:
```bash
docker compose up --build
```
Este comando levantará con éxito tanto el Cliente como el Servidor interno de Next.js en el puerto 80.
