# cse340-course-repo-2026

## Descripción del Proyecto
Este proyecto es una aplicación web dinámica inspirada en el modelo de **www.JustServe.org**. Su objetivo principal es promover el servicio a la comunidad conectando a voluntarios dispuestos con oportunidades y proyectos de servicio en su área local.

Esta plataforma se está construyendo paso a paso como el proyecto central del curso **CSE 340**. A lo largo del curso, el sitio evoluciona desde una estructura básica de vistas hasta una aplicación backend completa con integración de bases de datos relacionales, arquitectura MVC, ruteo avanzado y autenticación.

## Estructura Actual
El sitio cuenta con una arquitectura MVC conectada a PostgreSQL que renderiza dinámicamente las siguientes secciones:
- **Home (`/`):** Landing page con la misión de la red de servicio y estadísticas generales.
- **Organizations (`/organizations`):** Directorio de organizaciones comunitarias y fundaciones asociadas extraídas dinámicamente de la base de datos (`public.organization`).
- **Service Projects (`/projects`):** Catálogo de proyectos de voluntariado activos con sus fechas y organizaciones patrocinadoras vinculadas mediante llaves foráneas (`public.project` + `JOIN` con `organization`).
- **Categories (`/categories`):** Clasificación de oportunidades de servicio gestionadas mediante relaciones muchos a muchos (`public.category` y `public.project_category`).

## Tecnologías Utilizadas (Stack)
- **Entorno de Ejecución:** Node.js (ES Modules)
- **Framework Backend:** Express.js 5
- **Motor de Plantillas:** EJS (Embedded JavaScript)
- **Base de Datos:** PostgreSQL en Render.com
- **Cliente DB:** `pg` (node-postgres) con Connection Pooling
- **Estilos:** CSS3 responsivo
- **Despliegue (Hosting):** Render.com

## Instalación y Desarrollo Local

1. Clona este repositorio en tu computadora:
   ```bash
   git clone https://github.com/tu-usuario/cse340-course-repo.git
   cd cse340-course-repo
   ```

2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto y configura tus variables de entorno:
   ```env
   PORT=3000
   NODE_ENV=development
   ENABLE_SQL_LOGGING=true
   DB_URL=postgresql://usuario:password@host:port/database
   ```

4. Configura la base de datos:
   Ejecuta el script SQL ubicado en `src/setup.sql` en tu instancia de PostgreSQL (usando pgAdmin o la consola SQL de Render) para crear las tablas (`organization`, `project`, `category`, `project_category`) e insertar los datos iniciales.

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre tu navegador en `http://127.0.0.1:3000`.
