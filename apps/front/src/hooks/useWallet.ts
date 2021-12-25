import * as nacl from 'tweetnacl';
import * as naclUtil from 'tweetnacl-util';

export function encodeMessage(message: string, pubKey: string) {
  const ephemeralKeyPair = nacl.box.keyPair();
  const pubKeyUInt8Array = naclUtil.decodeBase64(pubKey);
  const msgParamsUInt8Array = naclUtil.decodeUTF8(message);
  const nonce = nacl.randomBytes(nacl.box.nonceLength);

  const encryptedMessage = nacl.box(
    msgParamsUInt8Array,
    nonce,
    pubKeyUInt8Array,
    ephemeralKeyPair.secretKey
  );

  return {
    version: 'x25519-xsalsa20-poly1305',
    nonce: naclUtil.encodeBase64(nonce),
    ephemPublicKey: naclUtil.encodeBase64(ephemeralKeyPair.publicKey),
    ciphertext: naclUtil.encodeBase64(encryptedMessage)
  };
}
