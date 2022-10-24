import { MongoClient } from "https://deno.land/x/mongo@v0.31.0/mod.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

const client = new MongoClient();

await client.connect(Deno.env.get('MONGODB_URI'));
/*
interface UserSchema {
    _id: ObjectId;
    username: string;
    password: Binary;
}

interface WordSchema {
    _id: ObjectId;
    word: string;
    traductions: Array<string>;
}

interface TraductionSchema {
    _id: ObjectId;
    word: string;
    traduction: string;
    accepted: boolean;
}

*/
const db = client.database('traductionsdb');

const wordCollection = db.collection/*<WordSchema>*/('word');
//deberia cambiar en la db de traduction a translation.
const translationCollection = db.collection/*<TraductionSchema>*/('traduction');
const userCollection = db.collection/*<UserSchema>*/('user');

export { db, wordCollection, translationCollection, userCollection }
//export type { UserSchema, WordSchema, TraductionSchema }

