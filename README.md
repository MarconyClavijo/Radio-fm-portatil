# Radio Online Minimalista

App de Radios Online de streaming de audio para la concentración y la desconexión, mediante música clásica y ambiental.

### Concepto

Diseñada bajo los principios de la **Ingeniería de Invisibilidad**: interfaz minimalista, consumo de recursos nulo y máxima eficiencia. Ideal para musica de fondo y  acompañar para flujos de trabajo de alta concentración.

### Stack Tecnológico

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
* **Infraestructura:** CDN (Content Delivery Network) mediante Vercel.
* **Arquitectura:** PWA instalable (Progressive Web App: Esto es una aplicación web que se comporta como una app nativa en móvil o escritorio al crear un acceso directo en el dispositivo).

### Método de Desarrollo (Cloud-Native)

Este proyecto se gestiona íntegramente en la nube:

1. **Edición:** Realizada directamente en el editor web de GitHub.(https://github.dev/github/dev))
2. **Sincronización:** El repositorio se conecta automáticamente a Vercel.(https://vercel.com/)
3. **Despliegue:** Cada *commit* a la rama principal dispara un despliegue optimizado en el Edge Network.

### Uso

Acceda a la URL de producción: https://radios-online.vercel.app/

* **Botón Power:** Inicializa/Detiene el stream (con manejo de excepciones de red).
* **Botones Prev/Next:** Navegación cíclica por la lista de emisoras (`STATIONS` en `js/script.js`).

### Estatus

**Estable (v1.0)**.
