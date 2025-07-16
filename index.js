const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let clients = [];
let eventId = 0;

async function getEthereumPrice() {
  try {
    const endpoint = "https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT";
    console.log('Haciendo petición a:', endpoint);
    
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.symbol) {
      return {
        usd: parseFloat(data.lastPrice),
        eur: parseFloat(data.lastPrice) * 0.85, // Aproximación EUR/USD
        change_24h: parseFloat(data.priceChangePercent),
        volume_24h: parseFloat(data.volume) * parseFloat(data.lastPrice), // Volumen en USD
        market_cap: null // Binance no proporciona market cap directamente
      };
    } else {
      throw new Error('No se pudieron obtener datos de Ethereum');
    }
  } catch (error) {
    console.error('Error obteniendo precio de ETH:', error.message);
    return null;
  }
}

app.get("/events", (req, res) => {
  // Configuración de los encabezados de respuesta para SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache"); // Evita que los proxies y navegadores cacheen el stream
  res.setHeader("Connection", "keep-alive"); // Mantiene la conexión abierta
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permitir CORS

  // Enviar un comentario inicial para mantener la conexión viva y detectar proxys
  // y para informar al cliente que la conexión está activa.
  res.write(":ok\n\n");

  // Almacenar el objeto de respuesta (res) del cliente
  // Esto para permitir enviarle eventos más tarde
  clients.push(res);
  console.log(`Cliente ${clients.length} conectado a SSE`);

  // Enviar datos inmediatamente cuando se conecta un cliente
  sendEthereumData();

  // Manejar la desconexión del cliente
  req.on("close", () => {
    console.log(`Cliente desconectado de SSE`);
    clients = clients.filter((client) => client !== res);
    res.end();
  });
});

function sendEventToAllClients(data) {
  eventId++;
  const message = `id: ${eventId}\ndata: ${JSON.stringify(data)}\n\n`;

  // Itera sobre todos los clientes conectados y envía el evento
  clients.forEach((client) => {
    client.write(message);
  });

  console.log(`Evento enviado: ${message.trim()}`);
}

async function sendEthereumData() {
  const ethData = await getEthereumPrice();
  
  if (ethData) {
    const date = new Date();
    sendEventToAllClients({
      type: 'ethereum_price',
      message: `Precio actual de Ethereum`,
      timestamp: date.toISOString(),
      data: ethData
    });
  } else {
    // Si no se pueden obtener datos, enviar un mensaje de error
    const date = new Date();
    sendEventToAllClients({
      type: 'error',
      message: `Error obteniendo datos de Ethereum`,
      timestamp: date.toISOString(),
      error: 'No se pudieron obtener los datos del precio'
    });
  }
}

setInterval(sendEthereumData, 10000); // 10 segundos

app.listen(PORT, () => {
  console.log(`Servidor SSE escuchando en http://localhost:${PORT}`);
});