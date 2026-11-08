# Prompts para las nuevas imágenes de las tarjetas

## Separación de recursos

- **Tarjetas:** generar dos ilustraciones nuevas con los prompts de este archivo. Destinos: `public/images/projects/amara/card-cover.png` y `public/images/projects/obstetricare/card-cover.png`.
- **Saber más:** mostrar un mini video del sistema en funcionamiento y usar las imágenes actuales como imagen previa (`poster`): `public/images/projects/amara/cover.png` y `public/images/projects/obstetricare/cover.png`. Conservar estos archivos.
- Todavía no hay videos en Portfolio. Destinos propuestos: `public/videos/amara-demo.mp4` y `public/videos/obstetricare-demo.mp4`.

## Formato e integración prevista

En escritorio, la imagen ocupa 5 de 12 columnas con altura variable según el contenido, de al menos 420 px. En móvil ocupa todo el ancho con un mínimo de 280 px. No existe una resolución que encaje exactamente en todos los tamaños sin recorte.

Generar imágenes **verticales 4:5, idealmente 2048 × 2560 px**, para favorecer el panel alto de escritorio. Las nuevas imágenes deberán integrarse con **object-fit: cover y posición centrada**, llenando el espacio sin franjas. El componente actual usa `contain`; cambiarlo será parte de la integración cuando estén las imágenes nuevas.

Los elementos imprescindibles deben concentrarse en el **60 % central del ancho y el 35 % central del alto**. Es una guía para tolerar recortes, no un marco visible. El resto del lienzo debe contener una escena continua con detalles secundarios. Evitar texto en la ilustración: el título ya aparece al lado de la imagen.

## Prompt: tarjeta de Amará

```text
Genera UNA imagen nueva para la tarjeta de presentación de Amará, una plataforma web de bienestar emocional. Debe comunicar registrar emociones, reconocer patrones y conversar con un asistente de IA.

FORMATO: vertical 4:5, idealmente 2048 × 2560 px. Ilustración completa a sangre: la escena llega a los cuatro bordes. Se mostrará en el panel de una tarjeta responsive con object-fit: cover y recorte centrado, tanto en un espacio alto de escritorio como en uno más ancho de móvil. No añadas bandas, márgenes, marcos exteriores, transparencias ni zonas vacías de color sólido.

COMPOSICIÓN: una escena envolvente de bienestar con una persona tranquila y herramientas de Amará integradas visualmente. Concentra dentro del 60 % central del ancho y el 35 % central del alto un calendario de emociones con celdas de colores suaves, una curva de evolución emocional y dos burbujas de conversación con un símbolo discreto de asistente. Evita encerrar todo en una pantalla panorámica. Distribuye la escena verticalmente, con profundidad suave y elementos conectados.

EXTENSIÓN: continúa el entorno hasta todos los bordes con vegetación, luz cálida, texturas suaves y detalles discretos de música o respiración. La parte superior e inferior deben contener ilustración real, aunque puedan recortarse. Los detalles periféricos son secundarios. No coloques caras ni símbolos esenciales cerca de los bordes; la idea debe entenderse al ver únicamente la zona central.

COLORES REALES DE AMARÁ: rosa empolvado #D4A5A5 como principal, rosa claro #F5E6E6 y crema #F9F8F4 para superficies, verde salvia #7CA08B como acento y marrón tierra #352923 para detalles oscuros. Puedes añadir arena #F6F0E8 y arcilla #C98C6C. Integra los colores dentro de objetos, iluminación y ambiente; no los uses para crear franjas de relleno. Identidad cálida, natural y acogedora.

ESTILO: ilustración editorial de producto, profesional y cercana, con formas suaves, profundidad sutil, contraste suficiente y pocos elementos bien definidos. Debe entenderse al reducirse a una tarjeta. No incluyas texto, nombres, letras, marcas de agua, porcentajes ni afirmaciones terapéuticas. No es una captura exacta de la aplicación.

Si adjunto la ilustración horizontal actual de Amará, úsala solo como referencia de estilo e identidad. Crea una composición vertical nueva: no pegues esa imagen en el centro ni la completes con bandas de color. Entrega solo la imagen final.
```

Destino: `public/images/projects/amara/card-cover.png`.

## Prompt: tarjeta de ObstetriCare

```text
Genera UNA imagen nueva para la tarjeta de presentación de ObstetriCare, un sistema de apoyo clínico para la alerta temprana del riesgo de parto prematuro. Debe comunicar seguimiento de gestantes, evaluación de riesgo con Machine Learning y priorización de la atención.

FORMATO: vertical 4:5, idealmente 2048 × 2560 px. Ilustración completa a sangre: la escena llega a los cuatro bordes. Se mostrará en el panel de una tarjeta responsive con object-fit: cover y recorte centrado, tanto en un espacio alto de escritorio como en uno más ancho de móvil. No añadas bandas, márgenes, marcos exteriores, transparencias ni zonas vacías de color sólido.

COMPOSICIÓN: una escena de atención materna con una profesional de salud y herramientas clínicas representadas visualmente. Concentra dentro del 60 % central del ancho y el 35 % central del alto un símbolo respetuoso de atención materna, un expediente con silueta de gestante y un indicador de riesgo. Incorpora un pequeño flujo conectado de análisis, alerta y revisión clínica. Evita encerrar todo en una pantalla panorámica. Organiza la escena verticalmente con una jerarquía visual sencilla.

EXTENSIÓN: continúa el entorno clínico hasta los cuatro bordes con luz suave, planos arquitectónicos discretos y elementos secundarios de consulta. La parte superior e inferior deben contener ilustración real, aunque puedan recortarse. Mantén rostros y símbolos importantes lejos de los bordes. La idea debe entenderse al ver únicamente la zona central.

COLORES REALES DE OBSTETRICARE: ciruela #612853 como principal, rosa suave #F9CFD9 como secundario y blanco para superficies clínicas. Aplica estos colores a objetos, ropa, interfaz y ambiente; no los conviertas en franjas de relleno. Reserva verde #16A34A, ámbar #F59E0B, naranja y rojo #BA1A1A para pequeños indicadores de triaje, acompañados de símbolos para no depender solo del color.

ESTILO: ilustración editorial de producto, profesional y humana, con formas suaves, profundidad sutil, contraste suficiente y pocos elementos bien definidos. Mantén el lenguaje visual de la nueva portada de Amará, respetando la identidad ciruela y rosa de ObstetriCare. Debe entenderse al reducirse a una tarjeta. No incluyas texto, nombres, letras, datos personales, marcas de agua, cifras de precisión ni sellos de validación. Representa apoyo al personal de salud sin sugerir diagnóstico automático. No es una captura exacta de la aplicación.

Si adjunto la ilustración horizontal actual de ObstetriCare, úsala solo como referencia de estilo e identidad. Crea una composición vertical nueva: no pegues esa imagen en el centro ni la completes con bandas de color. Entrega solo la imagen final.
```

Destino: `public/images/projects/obstetricare/card-cover.png`.

Estos prompts describen la siguiente integración; no sustituyen todavía las imágenes de la web ni habilitan un reproductor sin los videos. Conservar las portadas actuales para los futuros videos. Mantener la extensión real de las imágenes generadas o convertirlas; renombrar la extensión no convierte el formato.
