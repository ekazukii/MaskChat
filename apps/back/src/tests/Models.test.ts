import { addPublicKey, getPublicKey, removePublicKey } from '../models/Address';
import { addMessage, getMessages, getContactsOf, removeConversation } from '../models/Message';
import { addSessionKey, getSessionKey, getSessionsOf, removeSessionKey } from '../models/Session';
import { ETHAddress } from '../utils';

describe('Model', () => {
  const nonce = Math.random().toPrecision(3);
  const address: ETHAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
  const address2: ETHAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';
  const address3: ETHAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const address4: ETHAddress = '0xDA9dfA130Df4dE4673b89022EE50ff26f6EA73Cf';

  beforeAll(done => {
    setTimeout(async () => {
      done();
    }, 4400);
  });

  describe('Add Key', () => {
    it('Should remove if exist public key of address', async () => {
      await expect(removePublicKey(address)).resolves.not.toThrow();
    });

    it('Should add public key to db', async () => {
      await expect(addPublicKey(address, `TestPublicKey${nonce}`)).resolves.not.toThrow();
    });

    it('Should throw error when adding the same key', async () => {
      await expect(addPublicKey(address, `TestPublicKey${nonce}`)).rejects.toThrow();
    });

    it('Should get the public key', async () => {
      expect((await getPublicKey(address)).pubKey).toEqual(`TestPublicKey${nonce}`);
    });

    it('Should remove public key of address', async () => {
      await expect(removePublicKey(address)).resolves.not.toThrow();
      expect(await getPublicKey(address)).toBeNull();
    });
  });

  describe('Session', () => {
    it('Should remove if exist session key between two address', async () => {
      await expect(removeSessionKey(address, address2)).resolves.not.toThrow();
      await expect(removeSessionKey(address, address3)).resolves.not.toThrow();
    });

    it('Should add SessionKey for conversation', async () => {
      await expect(
        addSessionKey(address, address2, `Asession1${nonce}`, `Bsession1${nonce}`)
      ).resolves.not.toThrow();

      await expect(
        addSessionKey(address, address3, `Asession2${nonce}`, `Bsession2${nonce}`)
      ).resolves.not.toThrow();
    });

    it('Should throw error when updating SessionKey for conversation', async () => {
      await expect(
        addSessionKey(address, address2, `Asession1${nonce}`, `Bsession1${nonce}`)
      ).rejects.toThrow();
    });

    it('Should return the good number of contact of address', async () => {
      expect(await getSessionsOf(address2)).toHaveLength(1);
      expect(await getSessionsOf(address)).toHaveLength(2);
    });
  });

  describe('Message', () => {
    it('Should remove all messages between two address', async () => {
      await expect(removeConversation(address, address2)).resolves.not.toThrow();
      await expect(removeConversation(address, address3)).resolves.not.toThrow();
      await expect(removeConversation(address2, address3)).resolves.not.toThrow();
      await expect(removeConversation(address4, address2)).resolves.not.toThrow();
    });

    it('Should add messages between addresses', async () => {
      await expect(addMessage(address, address2, `message1${nonce}`)).resolves.not.toThrow();
      await expect(addMessage(address, address3, `message2${nonce}`)).resolves.not.toThrow();
      await expect(addMessage(address2, address3, `message3${nonce}`)).resolves.not.toThrow();
      await expect(addMessage(address4, address2, `message4${nonce}`)).resolves.not.toThrow();
    });

    it('Should get the conversation between addresses', async () => {
      const messages = await getMessages(address, address3);

      expect(messages).toHaveLength(1);
      expect(messages[0].sender).toBe(address);
      expect(messages[0].receiver).toBe(address3);
      expect(messages[0].message).toBe(`message2${nonce}`);
    });

    it('Should return the same conversation if we switch addr1 and addr2', async () => {
      const messages = await getMessages(address, address2);
      const messages2 = await getMessages(address2, address);

      expect(messages).toEqual(messages2);
    });

    it('Should have conversation even if address only receive message', async () => {
      const messages = await getMessages(address, address3);
      expect(messages).toHaveLength(1);
    });

    it('Should have conversation even if address only send message', async () => {
      const messages = await getMessages(address2, address4);
      expect(messages).toHaveLength(1);
    });

    it('Should remove conversation', async () => {
      await expect(removeConversation(address, address2)).resolves.not.toThrow();
      await expect(removeConversation(address, address3)).resolves.not.toThrow();
      await expect(removeConversation(address2, address3)).resolves.not.toThrow();
      await expect(removeConversation(address4, address2)).resolves.not.toThrow();

      expect(await getMessages(address2, address)).toHaveLength(0);
    });

    it('Should remove session', async () => {
      await expect(removeSessionKey(address, address2)).resolves.not.toThrow();
      await expect(removeSessionKey(address, address3)).resolves.not.toThrow();

      expect(await getSessionKey(address, address3)).toBeNull();
    });
  });
});
