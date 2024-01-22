import CryptoJS from 'crypto-js';

var PKCS7Encoder = {};

PKCS7Encoder.decode = function (text) {
  var pad = text[text.length - 1];
  if (pad < 1 || pad > 32) {
    pad = 0;
  }
  return text.slice(0, text.length - pad);
};

PKCS7Encoder.encode = function (text) {
  var blockSize = 32;
  var textLength = text.length;
  var amountToPad = blockSize - (textLength % blockSize);
  var result = CryptoJS.lib.WordArray.create(amountToPad);
  result.fill(amountToPad);
  return CryptoJS.lib.WordArray.create(text.concat(result));
};

var WXBizMsgCrypt = function (token, encodingAESKey, id) {
  if (!token || !encodingAESKey || !id) {
    throw new Error('please check arguments');
  }
  this.token = token;
  this.id = id;

  var AESKey = CryptoJS.enc.Base64.parse(encodingAESKey + '=');
  if (AESKey.words.length !== 8) {
    throw new Error('encodingAESKey invalid');
  }
  this.key = AESKey;
  this.iv = AESKey.clone().words.slice(0, 4);
};

WXBizMsgCrypt.prototype.getSignature = function (timestamp, nonce, encrypt) {
  var shasum = CryptoJS.algo.SHA1.create();
  var arr = [this.token, timestamp, nonce, encrypt].sort();
  shasum.update(arr.join(''));
  return shasum.finalize().toString();
};

WXBizMsgCrypt.prototype.decrypt = function (text) {
  var decipher = CryptoJS.algo.AES.createDecryptor(this.key, { iv: CryptoJS.lib.WordArray.create(this.iv) });
  decipher.padding = CryptoJS.pad.NoPadding;
  var encryptedData = CryptoJS.enc.Base64.parse(text);
  var decrypted = decipher.process(encryptedData);
  decrypted.concat(decipher.finalize());
  var deciphered = PKCS7Encoder.decode(decrypted.toString(CryptoJS.enc.Hex));
  var content = deciphered.slice(32);
  var length = parseInt(content.substr(0, 8), 16);
  return {
    message: CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(content.substr(8, length * 2))),
    id: CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(content.substr(length * 2 + 8)))
  };
};

WXBizMsgCrypt.prototype.encrypt = function (text) {
  var randomString = CryptoJS.lib.WordArray.random(16);
  var msg = CryptoJS.enc.Utf8.parse(text);
  var msgLength = msg.words.length;
  var id = CryptoJS.enc.Utf8.parse(this.id);
  var bufMsg = CryptoJS.lib.WordArray.create().concat(randomString).concat(CryptoJS.lib.WordArray.create([msgLength])).concat(msg).concat(id);
  var encoded = PKCS7Encoder.encode(bufMsg.toString());
  var cipher = CryptoJS.algo.AES.createEncryptor(this.key, { iv: CryptoJS.lib.WordArray.create(this.iv) });
  cipher.padding = CryptoJS.pad.NoPadding;
  var cipheredMsg = cipher.process(encoded.concat(CryptoJS.lib.WordArray.create()));
  cipheredMsg.concat(cipher.finalize());
  return cipheredMsg.toString(CryptoJS.enc.Base64);
};


export default WXBizMsgCrypt;