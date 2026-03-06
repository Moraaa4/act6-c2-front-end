# Reporte Técnico: Arquitectura SOA y Desacoplamiento (The Movie Database)

## Estructura Implementada
El desarrollo de esta actividad cumple estrictamente con el principio de aislamiento en una Arquitectura Orientada a Servicios (SOA). La lógica centralizada en Node.js funciona como un intermediario o _Proxy_ entre el cliente final (la UI en el navegador) y el servicio externo (la API de terceros, TMDB).

### Aislamiento de Servicios (Decoupling) y "Cero Hardcoding"

Para aislar y proteger el manejo de la información, el Back-end Node.js se estructuró en tres capas fundamentales:

1. **La Capa de Servicios (`/src/services/tmdbService.js`)**: Esta carpeta encapsula toda la interacción directa con la API externa (usando la librería `axios`). 
   - **Por qué**: Si el día de mañana la API de TMDB cambia de versión o credenciales, **CUALQUIER modificación se limita EXCLUSIVAMENTE a esta capa.** El resto de la aplicación permanece completamente ajena al cambio.
   - **Cero Hardcoding**: La `URL Base` y el `Bearer Token` de autenticación nunca se exponen ni se queman en el código fuente. Son inyectados dinámicamente mediante variables de entorno a través del archivo `.env`, garantizando total seguridad del token.

2. **La Capa de Controladores (`/src/controllers/movieController.js`)**: Actúa como el puente lógico entre las rutas expuestas y la capa de servicios.
   - **Por qué**: Su objetivo es "hacer la petición asíncrona" al servicio (`fetchPopularMovies()`), capturar los datos, e interceptar cualquier fallo. Luego formatea la respuesta hacia el cliente bajo una convención estandarizada JSON (Ej. `{ success: true, data: [...] }`). 

3. **Las Rutas (`/src/routes/movieRoutes.js`)**: Encargadas únicamente de exponer el recurso interno `/api/movies`.
   - **El Resultado Final**: El bloque de *Frontend* (dentro de la carpeta `/public`) solo conoce **este endpoint interno**. Ignora completamente qué ocurre en el backend, originando un robusto aislamiento del proveedor original de los datos.

### Estados de la Interfaz
La lógica del _Frontend App_ maneja dinámicamente tres escenarios:
- **Loading:** Despliega un asincrónico loader (Cargando películas populares...) hasta que la petición a `/api/movies` es resuelta.
- **Success:** En caso satisfactorio de respuesta (`HTTP 200`), las películas extraídas de la matriz se envuelven en el DOM para inyectarse como tarjetas dinámicas estéticas. Éstas muestran el **Póster (solicitado dinámicamente al CDN de TMDB)**, el Título, y la Calificación Promedio (`vote_average`). 
- **Error:** Un manejador explícito (try/catch) asiste al cliente si falla el token o la respuesta. Por ejemplo, al invalidar el _Bearer Token_, el Frontend pinta dinámicamente un mensaje rojo de alerta en pantalla y expone el recurso fallido al usuario para facilitar el depurado.
