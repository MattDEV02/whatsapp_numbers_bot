const SESSION_FILE_PATH = "./session.json";

String.prototype.isNumber = function () {
   return (this !== null) && (this !== undefined) && (this !== "") && (this !== false) && !isNaN(new Number(this))
};

Date.now = function () {
   let actual_datetime = new Date();
   actual_datetime.setHours(actual_datetime.getHours() + 1);
   return actual_datetime.toUTCString().replace(" GMT", '')
};

const isPrime = num => {
   let
      i = 2,
      s = Math.sqrt(num);
   for (; i <= s; i++)
      if (num % i === 0)
         return false;
   return num > 1;
};

const isSquare = num => num % Math.sqrt(num) === 0;

const isSumSquare = num => {
   let
      i = 1,
      j = 1,
      result = false;
   if(num >= 0) {
      for (;
         (i * i) <= num; i++)
         for (;
            (j * j) <= num; j++)
            if ((i * i) + (j * j) === num)
               result = true;
   } else 
      result = false;
   return result;
};

const isPalindrome = num => {
   num = String(num);
   const num_length = num.length;
   let
      i = 0,
      pali = true;
   for (;
      (i < (num_length / 2)) && pali === true; i++) {
      if (num[i] !== num[num_length - 1 - i])
         pali = false;
   }
   return pali;
};

const isDivisibleFor = (x, y) => x % y === 0;

const numDivisor = num => {
   num = Math.abs(num);
   let
      div = 0,
      i = 0;
   for (; i <= num; i++) {
      if (isDivisibleFor(num, i))
         div++;
   }
   return div;
};

const gcd = (x, y) => (y === 0) ? x : gcd(y, x % y);

const fi = num => {
   num = Math.abs(num);
   let i = 0,
      count = 0;
   for (; i <= num; i++) {
      if (gcd(num, i) === 1)
         count++;
   }
   return count;
};

const intToBin = num => new Number(num).toString(2);

const intToHex = num => new Number(num).toString(16);

const getPhoneNumber = phone => phone.slice(2, 1) + phone.slice(2, phone.indexOf("@"));

const getMessage = (message, contact, chat) => {
   const from = getPhoneNumber(message.from);
   const to = getPhoneNumber(message.to);
   const newMessage = {
      name: contact.name || process.env.MY_NAME,
      pushname: contact.pushname || process.env.MY_PUSH_NAME,
      body: message.body,
      type: message.type,
      from,
      to,
      deviceType: message.deviceType,
      datetime: Date.now(),
      unreadCount: chat.unreadCount,
      isGroup: chat.isGroup,
      isMe: message.fromMe,
      isMyContact: contact.isMyContact,
      isBusiness: contact.isBusiness || false,
      isBroadcast: message.broadcast || false
   };
   return newMessage;
};

const NUMBERS_LIST = [
   "3206145662", // Elisa
   process.env.MY_PHONE_NUMBER, // IO
   "3339720994", // Silvia
   "3450451527", // Bruno
   "3495604013", // Mamma
   "3667488559", // Giovanni
   "3779987656", // Epifani
   "3881081304", // Cristian 
   "3911700268", // Carol
   "3917319168" // Papà
];

export {
   SESSION_FILE_PATH,
   NUMBERS_LIST,
   getMessage,
   isPrime,
   isDivisibleFor,
   isSquare,
   isSumSquare,
   isPalindrome,
   numDivisor,
   gcd,
   fi,
   intToBin,
   intToHex
};