const fs = require('fs');
const path = require('path');

var lastSpin = null;
var dayResult = null;

function whatIsDayResult() {
    return dayResult;
}

function canSpin() {
    if(lastSpin != null) {
        return new Date().toISOString().substring(0, 10) != lastSpin.toISOString().substring(0, 10);
    } else {
        return true;
    }
}

const history = JSON.parse(fs.readFileSync(path.join(__dirname, 'bdd', "history.json")));

const probabilty = [
    { label: "RU", color: "#f39c12", type: "sain", weight: 0.1 },
    { label: "Sushi", color: "#e74c3c", type: "sain", weight: 0.1 },
    { label: "Ange", color: "#3498db", type: "normal", weight: 0.1 },
    { label: "Carrefour", color: "#2ecc71", type: "normal", weight: 0.1 },
    { label: "Carrefour City", color: "#9b59b6", type: "normal", weight: 0.1 },
    { label: "Caféteria CROUS", color: "#f1c40f", type: "normal", weight: 0.1 },
    { label: "Mcdo", color: "#e67e22", type: "fast-food", weight: 0.1 },
    { label: "KFC", color: "#1abc9c", type: "fast-food", weight: 0.1 },
    { label: "BK", color: "#8e44ad", type: "fast-food", weight: 0.1 },
    { label: "Holly's", color: "#c0392b", type: "fast-food", weight: 0.1 }
]

function adjustOthers(segments, targetLabel, newWeight) {
    const target = segments.find(s => s.label === targetLabel);
    target.weight = newWeight;

    const others = segments.filter(s => s.label !== targetLabel);
    const othersSum = others.reduce((sum, s) => sum + s.weight, 0);

    const total = segments.reduce((sum, s) => sum + s.weight, 0);
    const diff = total - 1; // si on veut que la somme =1

    others.forEach(s => {
        s.weight -= s.weight * (diff / othersSum);
    });
}

async function addHistoryObject(type, label) {

    lastSpin = new Date();
    dayResult = label;
   
    history.unshift({ type, label, date: new Date() });

    fs.writeFile(
        path.join(__dirname, "bdd", "history.json"),
        JSON.stringify(history),
        "utf-8",
        (err) => {
            if (err) console.error("Erreur d'écriture :", err);
        }
    );
}


function probabilityOfToday() {


    const today = 5 // (new Date().getDay());

    const proba = probabilty.map(p => ({ ...p }));

    proba.forEach(p => {
        switch (p.label) {
            case "RU":
                if ([1, 3, 5].includes(today))
                    adjustOthers(proba, "RU", p.weight * 0.55);
                if ([2, 4].includes(today))
                    adjustOthers(proba, "RU", p.weight * 1.20);
                break;

            case "BK":
                if (today === 3)
                    adjustOthers(proba, "BK", p.weight * 1.50);
                break;

            case "Caféteria CROUS":
                adjustOthers(proba, "Caféteria CROUS", p.weight * 0.70);
                break;

            case "KFC":
                if (today === 2)
                    adjustOthers(proba, "KFC", p.weight * 1.90);
                else
                    adjustOthers(proba, "KFC", p.weight * 0.40);
                break;

            case "Holly's":
                adjustOthers(proba, "Holly's", p.weight * 0.20);
                break;
        }
    });

    proba.forEach(p => p.weight *= 100);

    if (history.length > 0) {
        if ((today > 1 && history[0].type === "fast-food")) {
            return proba.filter(r => r.type != "fast-food")                           
        }
    }

    return proba;
}

module.exports = { probabilityOfToday, addHistoryObject, canSpin, whatIsDayResult }