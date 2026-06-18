# SoundWave-Roberto
Proyecto Plataforma SoundWave
# PASOS PARA COMENZAR:
## 1. Clonar el repo:
```bash
   git clone https://github.com/regueira2010/proyect-SoundWave.git
   cd proyect-SoundWave
```
## 2. Verificar conexion:
```bash  
   git remote -v
```
## 3. Traer cambios:
```bash    
   git pull origin main
```
## 4. Crear archivo .env con tus datos de PostgreSQL:
```bash   
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=soundwave_db
   PORT=3000
```
## 5. Instalar dependencias:
```bash    
   npm install
```
## 6. Crear base de datos en pgAdmin:
```bash    
   CREATE DATABASE soundwave_db;
```
## 7. Inicializar tablas y datos:
```bash    
   npm run sync
```
## 8. Verificar:
```bash    
   npm run check
```
## 9. Iniciar servidor:
```bash   
   npm run dev
```
## PARA ACTUALIZARSE (despues de la primera vez):
```bash
   git pull origin main

   npm install (si hay nuevas dependencias)

   npm run sync (si cambiaron los modelos)

   npm run dev
```
## COMANDOS UTILES:
```bash
   npm run sync   # Recrear tablas y cargar datos

   npm run check  # Verificar estado de la BD

   npm run dev    # Iniciar servidor modo desarrollo
```