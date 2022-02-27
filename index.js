import {
   existsSync,
   statSync,
   readFileSync,
   writeFile
} from "fs";
import {
   Client
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
   session: sessionData
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
      console.log(client.info)
      botIsUp = true;
      const text = `Bot is up. 🤖✅ (${Date.now()})`;
      console.log(text);
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
         const text = `Il numero ${N} è ${N > 0 ? "positivo" : "negativo"}, ${utils.isDivisibleFor(N, 2) ? "pari" : "dispari"}, ${utils.isPrime(N) ? "primo" : "non primo"}, ${utils.isSquare(N) ? "quadrato perfetto" : "non quadrato perfetto"}, ${utils.isSumSquare(N) ? "somma di due quadrati perfetti" : "non è la somma di due quadrati perfetti"}, ${utils.isPalindrome(N) ? "palindromo" : "non palindromo"}, preceduto da ${N - 1} e seguito da ${N + 1}, radice ${Math.sqrt(Math.abs(N))}, quadrato ${(N * N)}, metà ${N / 2}, doppio ${N * 2}, binario ${utils.intToBin(N)}, esadecimale: ${utils.intToBin(N)}, dotato di ${utils.numDivisor(N)} divisori e ${utils.fi(N)} numeri coprimi con esso.`;
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