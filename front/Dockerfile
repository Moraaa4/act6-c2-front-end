FROM node:20-alpine

WORKDIR /app

# Instalar las dependencias basándose en el gestor de paquetes preferido
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar el resto de la aplicación
COPY . .

# Construir Next.js
RUN npm run build

# Exponer el puerto 3000
EXPOSE 3000

# Iniciar el servidor de Next.js
CMD ["npm", "start"]
