import { Router } from "https://deno.land/x/opine@2.2.0/mod.ts";
import { translationCollection, wordCollection } from "../helpers/dbconnect.js";
import { checkIfAuthenticated } from "../helpers/firebase-auth-middleware.js";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.0/mod.ts";

const translationController = Router();

translationController.post('/new', async (req, res) => {

    const word = req.body.word;

    const translation = req.body.translation;

    const wordRecord = await wordCollection.findOne({word: word});

    const translationRecord = await translationCollection.findOne({ word: word.trim(), traduction: translation.trim()});

    if(!wordRecord) wordCollection.insertOne({ word: word, traductions: [] });

    if(!translationRecord) translationCollection.insertOne({ word: word.trim(), traduction: translation.trim(), accepted: false });
    
    res.json({ msg: 'Traduccion agregada!'});
});

translationController.delete('/reject', checkIfAuthenticated, async (req, res) => {
    const { translationId } = req.query;
    await translationCollection.deleteOne({ _id: new ObjectId(translationId) });
    res.json({ msg: 'Traduccion rechazada! '});
});

translationController.get('/get-all', checkIfAuthenticated, async (_req, res) => {
    const traductions = await translationCollection.find({}).toArray();
    res.json({ traductions });
});

translationController.post('/get-words', async (req, res) => {
    const { words } = req.body;
    const splittedWords = words.split(' ');
    const translations = [];


    for (const w of splittedWords) {
        const wordWithTranslations = await wordCollection.findOne({ word: w });
        translations.push(wordWithTranslations);
    }
    res.json({ words: translations });
});


translationController.post('/accept', checkIfAuthenticated, async (req, res) => {

    const wordText = req.body.word;

    const translationId = req.body.translationId;

    const translationRecord = await translationCollection.findOne({ _id: new ObjectId(translationId) })

    await translationCollection.updateOne({ _id: new ObjectId(translationId) }, { $set: { accepted: true } });

    await wordCollection.updateOne({ word: wordText }, { $push: { traductions: translationRecord.traduction }});

    res.json({ msg: 'Traduccion confirmada!'});
});

export { translationController };

