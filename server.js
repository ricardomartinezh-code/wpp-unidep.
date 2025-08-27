const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '2mb' }));

// Servir las páginas de políticas
app.use(express.static(path.join(__dirname, 'public')));
app.get('/politica-privacidad', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'politica-privacidad.html'))
);
app.get('/data-deletion', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'data-deletion.html'))
);

// Webhook de WhatsApp
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'mi-token-secreto';

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post('/webhook', (req, res) => {
  console.log('EVENTO WEBHOOK >>>', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor listo en puerto ${port}`));
