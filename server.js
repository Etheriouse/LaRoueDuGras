const express = require('express');
const app = express();
const path = require("path");

const PORT = 2700;

const { probabilityOfToday, addHistoryObject, canSpin } = require("./hungry.js")

app.use(express.json());

app.get('/', (req, res) => {
    res.redirect('/la-roue-du-gras');
});

app.get('/la-roue-du-gras', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
})

app.post('/proba', (req, res) => {
    const jsonProba = probabilityOfToday();
    res.json({ proba: jsonProba, canSpin: canSpin() });
});

app.post('/history', (req, res) => {
    addHistoryObject(req.body.type, req.body.label);
});


app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});


/*

        var probabilty = {};
        fetch('http://localhost:2700/proba', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                probabilty = data.proba;
            })
            .catch(error => console.error('Erreur :', error));


*/