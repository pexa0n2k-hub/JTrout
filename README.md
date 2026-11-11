# J&T Route PWA v0.1

PWA para reportes de inicio y fin de ruta de J&T Express.

## Publicar desde GitHub

1. Crear un repositorio `JTRoute` en GitHub.
2. Subir **el contenido** de este ZIP a la raíz del repositorio, incluida la carpeta oculta `.github`.
3. En Settings > Pages > Build and deployment, seleccionar **GitHub Actions**.
4. Abrir Actions y ejecutar `Publish PWA` si no se ejecutó automáticamente.
5. Visitar `https://TU-USUARIO.github.io/JTRoute/`.
6. En Chrome Android, usar el menú > Agregar a pantalla principal / Instalar app.

## Compartir

Usa Web Share API para enviar captura original y texto mediante el selector nativo. El resultado depende del navegador y de la app receptora (WhatsApp puede mostrar el texto como pie de foto o manejarlo de otra manera). Si el envío conjunto no es compatible, se intenta copiar el texto para adjuntar la captura manualmente.

## Datos

Nombre, códigos postales e historial se guardan en localStorage en este dispositivo/navegador. No se sincronizan. Las capturas no se guardan en historial.

## Siguiente fase

Capacitor + compilación APK en GitHub Actions, con integración nativa de compartir si es necesaria.
