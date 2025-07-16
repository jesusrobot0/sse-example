# ETH Price Widget - Server-Sent Events (SSE) Example

Un widget en tiempo real que muestra el precio de Ethereum usando **Server-Sent Events (SSE)** para actualizaciones continuas desde el servidor.

![ETH Price Widget](https://img.shields.io/badge/ETH-USD-blue) ![Real-time](https://img.shields.io/badge/Real--time-SSE-green) ![Node.js](https://img.shields.io/badge/Node.js-Express-yellow)

## 🚀 Demo

Widget minimalista que muestra:
- **Precio actual de ETH/USD** en tiempo real
- **Cambio porcentual 24h** con colores dinámicos (verde/rojo)
- **Fecha de última actualización**
- **Indicador visual** cuando se actualiza el precio

## 📋 Características

- ✅ **Actualizaciones cada 10 segundos** usando SSE
- ✅ **Datos reales** desde la API de Binance
- ✅ **Conexión persistente** sin polling
- ✅ **Reconexión automática** en caso de errores
- ✅ **Interfaz minimalista** y responsive
- ✅ **Indicadores visuales** de estado

## 🛠️ Instalación y Uso

### Prerrequisitos
- Node.js (v14 o superior)
- npm

### Instalación

```bash
# Clonar el repositorio
git clone <tu-repo>
cd SSE-example

# Instalar dependencias
npm install

# Ejecutar el servidor
npm run dev
```

### Acceso
Abre tu navegador en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
SSE-example/
├── index.js          # Servidor Express con SSE
├── package.json      # Dependencias del proyecto
├── public/
│   └── index.html    # Widget de ETH con EventSource
└── README.md         # Este archivo
```

## 📚 Notas Técnicas: Server-Sent Events (SSE)

### ¿Qué es SSE?

**Server-Sent Events (SSE)** es una tecnología web que permite a un navegador web recibir actualizaciones continuas y unidireccionales del servidor a través de una **única conexión HTTP abierta**.

### Contexto HTTP y Evolución

#### HTTP 1.0
- Funciona abriendo y cerrando conexiones constantemente
- Esto es muy costoso a nivel de recursos

#### HTTP 1.1 
- Mantiene una conexión TCP abierta hasta que el cliente la cierre
- Más eficiente que HTTP 1.0
- Soporta múltiples solicitudes sin esperar respuesta de la primera
- **Limitación:** Las respuestas deben llegar en el orden de las solicitudes

#### Limitaciones de HTTP para Apps en Tiempo Real
HTTP mejoró mucho, pero para aplicaciones que requieren comunicación proactiva y constante del servidor (como juegos o apps de bolsa) sigue siendo deficiente, incluso con técnicas como:
- **Polling:** Solicitudes constantes del cliente
- **Long Polling:** Mantener solicitudes abiertas por más tiempo

**WebSockets** vino a solucionar esto proporcionando comunicación **Full-Duplex (Bidireccional)** y persistente sobre una única conexión TCP.

## 🔄 SSE vs WebSockets

### Diferencias Clave

| Característica | SSE | WebSockets |
|----------------|-----|------------|
| **Dirección** | Unidireccional (servidor → cliente) | Bidireccional (full-duplex) |
| **Protocolo** | HTTP estándar | Protocolo WS sobre TCP |
| **Complejidad** | Simple | Más complejo |
| **Reconexión** | Automática | Manual |
| **Datos** | Solo texto (UTF-8) | Texto y binario |

### SSE: Comunicación Unidireccional
- El cliente abre la conexión
- Solo el servidor puede "empujar" eventos al cliente
- Si el cliente necesita enviar datos, debe usar solicitudes HTTP separadas (GET, POST, etc.)

### WebSockets: Comunicación Bidireccional
- Una vez establecida la conexión, tanto cliente como servidor pueden enviar y recibir mensajes en cualquier momento

## ✅ Ventajas de SSE

1. **🔧 Simplicidad**
   - Más sencillo de implementar que WebSockets
   - API `EventSource` integrada en navegadores
   - No requiere protocolos o librerías complejas

2. **🌐 Basado en HTTP**
   - Compatible con infraestructura web existente
   - Funciona con proxies, firewalls, balanceadores de carga
   - Sin configuraciones especiales

3. **⚡ Conexión Persistente Eficiente**
   - Elimina sobrecarga del polling/long polling
   - Actualizaciones unidireccionales optimizadas

4. **🔄 Reconexión Automática**
   - `EventSource` maneja reconexiones automáticamente
   - Facilita el manejo de resiliencia

5. **🎯 Enfoque Específico**
   - Perfecto para casos unidireccionales
   - Reduce complejidad innecesaria

6. **📋 Soporte de Último ID de Evento**
   - Cliente notifica último ID recibido
   - Servidor puede reanudar desde el punto correcto

## ❌ Desventajas de SSE

1. **➡️ Unidireccional**
   - No permite mensajes del cliente al servidor por la misma conexión
   - Requiere AJAX/Fetch adicional para interacción bidireccional

2. **📝 Solo Texto (UTF-8)**
   - No soporta datos binarios
   - Limitado a contenido textual

3. **🔢 Límite de Conexiones**
   - Navegadores limitan conexiones simultáneas por dominio (6-8)
   - Puede ser limitante para múltiples conexiones SSE

4. **🎮 Menos Versátil**
   - No ideal para aplicaciones de baja latencia
   - No adecuado para alta frecuencia bidireccional (juegos, videoconferencia)

5. **📚 Menor Adopción del Servidor**
   - Menos librerías maduras comparado con WebSockets
   - Ecosistema más pequeño

## 🎯 Cuándo Usar SSE

### ✅ Casos Ideales:
- **Dashboards en tiempo real**
- **Feeds de noticias/redes sociales**
- **Notificaciones push**
- **Actualizaciones de estado**
- **Monitores de precios** (como este proyecto)
- **Logs en vivo**

### ❌ Cuándo NO Usar SSE:
- **Chat bidireccional**
- **Juegos en tiempo real**
- **Colaboración en tiempo real** (docs compartidos)
- **Videoconferencia**
- **Transferencia de archivos binarios**

## 🔧 Implementación en Este Proyecto

### Servidor (Node.js + Express)
```javascript
// Configuración SSE
res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");

// Envío de eventos
const message = `id: ${eventId}\ndata: ${JSON.stringify(data)}\n\n`;
client.write(message);
```

### Cliente (JavaScript)
```javascript
// Conexión SSE
const eventSource = new EventSource("/events");

// Manejo de eventos
eventSource.onmessage = function(event) {
  const data = JSON.parse(event.data);
  updatePriceWidget(data);
};
```

## 📦 Dependencias

- **express**: Framework web para Node.js
- **node-fetch**: Cliente HTTP para obtener datos de APIs

## 🔄 API Utilizada

**Binance Public API**
- Endpoint: `https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT`
- Datos: Precio actual, cambio 24h, volumen
- Sin autenticación requerida

