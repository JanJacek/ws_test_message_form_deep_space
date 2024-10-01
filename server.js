const WebSocket = require('ws');
const url = require('url');

// Fałszywy token do autoryzacji
const VALID_TOKEN = 'testtoken123';

// Tworzenie serwera WebSocket
const wss = new WebSocket.Server({ port: 8082 });

wss.on('connection', (ws, req) => {
  // Pobierz token z zapytania URL
  const query = url.parse(req.url, true).query;
  const token = query.token;

  // Weryfikacja tokenu
  if (token !== VALID_TOKEN) {
    console.log('Nieprawidłowy token:', token);
    ws.close(); // Zamknij połączenie, jeśli token jest nieprawidłowy
    return;
  }

  console.log('Token zweryfikowany:', token);

  const MILLISECONDS_IN_A_YEAR = 1000 * 60 * 60 * 24 * 365.25;
  const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;
  const MILLISECONDS_IN_AN_HOUR = 1000 * 60 * 60;
  const MILLISECONDS_IN_A_MINUTE = 1000 * 60;
  
  const startTime = Date.now() - (423 * MILLISECONDS_IN_A_YEAR) - (10 * MILLISECONDS_IN_A_DAY) - (5 * MILLISECONDS_IN_AN_HOUR) - (30 * MILLISECONDS_IN_A_MINUTE);
  
  function getTransmissionRunTime() {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor((elapsed / 1000) % 60);
    const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
    const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
    const days = Math.floor((elapsed / (1000 * 60 * 60 * 24)) % 365.25);
    const years = Math.floor(elapsed / MILLISECONDS_IN_A_YEAR);
  
    return `${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  // Obsługa wiadomości od klienta
  ws.on('message', (message) => {
    console.log('Otrzymano wiadomość:', message);
  });

  // Co 30 sekund wysyłaj komunikat do klienta
  const interval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      const response = {
        mode: 'Repetitive',
        transmission_run_time: getTransmissionRunTime(),
        sector: 'Epsilon-4',
        drift: '0.002 AU/h',
        coordinates: '12h 42m 12s, -12° 42′ 12″',
        message: 'Help!',
      };
      ws.send(JSON.stringify(response));
    }
  }, 10000); // 10 sekund

  // Obsługa zamknięcia połączenia
  ws.on('close', () => {
    console.log('Połączenie WebSocket zamknięte');
    clearInterval(interval); // Zatrzymaj wysyłanie wiadomości po zamknięciu połączenia
  });

  // Obsługa błędów
  ws.on('error', (error) => {
    console.error('Błąd WebSocket:', error);
  });
});

console.log('Serwer WebSocket działa na porcie 8082');
