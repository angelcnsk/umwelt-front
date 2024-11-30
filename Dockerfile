# Utiliza la imagen de Node.js para la etapa de construcción
FROM node:18-alpine AS build-stage

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de tu aplicación al contenedor
COPY package*.json ./
COPY package-lock.json ./

# Instala las dependencias de la aplicación
RUN npm install
RUN npm -g add @quasar/cli

# Copia el resto de los archivos de la aplicación
COPY . .

# Construye la aplicación Quasar en modo PWA
RUN quasar build -m pwa

# Utiliza una imagen de Nginx para la etapa de producción
FROM nginx:stable-alpine AS production-stage

# Copia los archivos construidos desde la etapa de construcción
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copia el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]