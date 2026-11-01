# cse340-course-repo-2026

## Descripción del Proyecto
Este proyecto es una aplicación web dinámica inspirada en el modelo de **www.JustServe.org**. Su objetivo principal es promover el servicio a la comunidad conectando a voluntarios dispuestos con oportunidades y proyectos de servicio en su área local.

Esta plataforma se está construyendo paso a paso como el proyecto central del curso **CSE 340**. A lo largo del semestre, el sitio evolucionará desde una estructura básica de vistas hasta una aplicación backend completa con integración de bases de datos, ruteo avanzado y autenticación.

## Estructura Actual
El sitio cuenta actualmente con un sistema de plantillas dinámicas que renderiza las siguientes secciones:
- **Home:** Landing page con la misión de la red de servicio y estadísticas generales.
- **Organizations:** Directorio de organizaciones comunitarias y fundaciones asociadas.
- **Service Projects:** Catálogo de proyectos de voluntariado activos (ej. limpieza de parques, recolección de alimentos).
- **Categories:** Clasificación de las oportunidades de servicio (Ambiental, Educativo, Servicio Comunitario, Salud y Bienestar).

## Tecnologías Utilizadas (Stack)
- **Entorno de Ejecución:** Node.js
- **Framework Backend:** Express.js
- **Motor de Plantillas:** EJS (Embedded JavaScript)
- **Estilos:** CSS3 responsivo
- **Despliegue (Hosting):** Render.com

## Instalación y Desarrollo Local
Para ejecutar este proyecto en un entorno local, sigue estos pasos:

1. Clona este repositorio en tu computadora.
2. Abre la terminal en la raíz del proyecto y ejecuta `npm install` para instalar todas las dependencias.
3. Crea un archivo `.env` en la raíz del proyecto y configura tus variables de entorno:
   ```env
   PORT=3000
   NODE_ENV=development