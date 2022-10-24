import { opine, json } from "https://deno.land/x/opine@2.2.0/mod.ts";
import { opineCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { translationController } from "./controllers/translation-controller.js";

const app = opine();
app.use(opineCors());
app.use(json());
app.use('/translations', translationController);


app.listen(
    3000,
    () => console.log("server has started on http://localhost:3000 💀"),
);
