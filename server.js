const express = require('express');
const app = express();
const path = require("path");

const PORT = 80;

const { probabilityOfToday, addHistoryObject, canSpin, whatIsDayResult } = require("./hungry.js")

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.redirect('/la-roue-du-gras');
});

app.get('/la-roue-du-gras', (req, res) => {
    const ip = getClientIp(req);
    console.log(`Nouvelle connexion depuis : ${ip}`);
    res.sendFile(path.join(__dirname, "public", "index.html"));
})

app.post('/proba', (req, res) => {
    const jsonProba = probabilityOfToday();
    res.json({ proba: jsonProba, canSpin: canSpin(), dayResult: whatIsDayResult() });
});

app.post('/history', (req, res) => {
    addHistoryObject(req.body.type, req.body.label);
});


app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

function getClientIp(req) {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Si IPv6 locale "::1", on retourne "127.0.0.1"
    if (ip === '::1') return '127.0.0.1';

    // Si IPv6 encapsule une IPv4, ex. "::ffff:192.168.1.25"
    if (ip.startsWith('::ffff:')) return ip.split(':').pop();

    return ip; // sinon IPv4 normale
}