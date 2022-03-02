"use strict"


import {
   existsSync,
   statSync,
   readFileSync,
   writeFile
} from "fs";
import {
   Client,
   LegacySessionAuth
} from "whatsapp-web.js";
const qrcode = require("qrcode-terminal");
import * as utils from "./utils.js";


let
   sessionData = null,
   botIsUp = false;

try {
   if (existsSync(utils.SESSION_FILE_PATH) && statSync(utils.SESSION_FILE_PATH).size > 0 && !botIsUp) {
      sessionData = JSON.parse(readFileSync(utils.SESSION_FILE_PATH));
      console.log(sessionData);
      console.log("Authentication...");
   }
} catch (error) {
   console.error(error);
}

let client = new Client({
   authStrategy: new LegacySessionAuth({
      session: sessionData
   })
});

client.on("qr", qr => {
   try {
      qrcode.generate(qr, {
         small: true
      });
   } catch (error) {
      console.error(error);
   }
});

client.on("auth_failure", message => console.warn(message));

client.on("authenticated", session => {
   try {
      console.log("Authenticated.");
      sessionData = JSON.stringify(session);
      writeFile(utils.SESSION_FILE_PATH, sessionData, error => {
         if (error)
            console.error(error);
      });
   } catch (error) {
      console.error(error);
   }
});

client.on("ready", async () => {
   try {
      botIsUp = true;
      const text = `Bot is up. 🤖✅ (${Date.now()})`;
      console.log(text);
      console.log(client.info)
      await client.sendMessage(`39${utils.NUMBERS_LIST[8]}@c.us`, text);
   } catch (error) {
      console.error(error);
   }
});

client.on("change_battery", batteryInfo => console.info(batteryInfo));

client.on("change_state", state => console.info("Changed state: " + state));

client.on("incoming_call", call => console.log(call));

client.on("message_create", async (message) => {
   try {
      const
         contact = await message.getContact(),
         chat = await message.getChat();
      if (message.fromMe) {
         console.log("Sended messsage: ");
         console.log(utils.getMessage(message, contact, chat));
      } else {
         console.log("Received messsage: ");
         console.log(utils.getMessage(message, contact, chat));
      }
      if (message.body.isNumber() && utils.NUMBERS_LIST.some(number => message.from.includes(number))) {
         const N = parseInt(new Number(message.body));
         const text = `Il numero ${N} è ${N > 0 ? "positivo" : "negativo"}, ${Math.isDivisibleFor(N, 2) ? "pari" : "dispari"}, ${Math.isPrime(N) ? "primo" : "non primo"}, ${Math.isSquare(N) ? "quadrato perfetto" : "non quadrato perfetto"}, ${Math.isSumSquare(N) ? "somma di due quadrati perfetti" : "non è la somma di due quadrati perfetti"}, ${Math.isPalindrome(N) ? "palindromo" : "non palindromo"}, ${Math.isPerfectNumber(N) ? "numero perfetto" : "numero non perfetto"}, preceduto da ${N - 1} e seguito da ${N + 1}, radice ${Math.sqrt(Math.abs(N))}, fattoriale ${Math.factorial(N)}, quadrato ${(N * N)}, opposto ${-1 * N}, inverso ${Math.pow(N, -1)}, metà ${N / 2}, doppio ${N * 2}, binario ${Math.intToBin(N)}, esadecimale ${Math.intToBin(N)}, Fibonacci ${Math.fibonacci(N)} , ascii '${Math.intToAscii(N)}', contrario ${Math.reverseNumber(N)}, dotato di ${Math.numDividers(N)} divisori e ${Math.fi(N)} numeri coprimi con esso.`;
         console.log(text);
         await message.reply(text);
         await client.sendMessage(chat.id._serialized, "Messaggio inviato da un bot, non da Matteo Lamb🥲");
      }
   } catch (error) {
      console.error(error);
   }
});

client.on("disconnected", reason => console.warn(reason));

process.on("SIGINT", async () => {
   try {
      if (botIsUp) {
         console.log(`Bot is off 🤖❌ (${Date.now()})`);
         await client.destroy();
      }
   } catch (error) {
      console.error(error);
   }
});


try {
   (async () => {
      await client.initialize();
   })();
} catch (error) {
   console.error(error);
}