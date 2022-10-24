
import * as jose from 'https://deno.land/x/jose@v4.9.0/index.ts'
import { verify } from "https://deno.land/x/djwt@v2.7/mod.ts";
import { decode as base64Decode } from 'https://deno.land/std@0.82.0/encoding/base64.ts';


const response = await fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');

const publicKeys = await response.json();

const algorithm = 'RS256';


const getAuthToken = (req, _res, next) => {
    // Authorization: "Bearer 123asdasdasd"
    if (req.headers.get('authorization') && req.headers.get('authorization').split(' ')[0] === 'Bearer') {
        req.authToken = req.headers.get('authorization').split(" ")[1];
    } else {
        req.authToken = null;
    }
    next();
}

const checkIfAuthenticated = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const { authToken } = req;

            const header64 = authToken.split('.')[0];

            const decodedHeader = JSON.parse(new TextDecoder().decode(base64Decode(header64)));

            const headerKid = decodedHeader['kid'];

            const rsaPublicKey = await jose.importX509(publicKeys[headerKid], algorithm);

            const payload = await verify(authToken, rsaPublicKey);
                
            req.authId = payload.user_id;
            return next();
        } catch(e) {
            return res.setStatus(401).json({ error: 'You are not authorized!'})
        }
    });
}

export { checkIfAuthenticated };