import {randomBytes, pbkdf2} from "node:crypto";

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const iterations = 100000;
  const keyLength = 64;
  const digest = 'sha512';

  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
      if (err) {
        return reject(err);
      }
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

export async function verifyPassword(storedHash: string, password: string): Promise<boolean> {
  const [salt, key] = storedHash.split(':');
  const iterations = 100000;
  const keyLength = 64;
  const digest = 'sha512';

  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
      if (err) {
        return reject(err);
      }
      resolve(derivedKey.toString('hex') === key);
    });
  });
}