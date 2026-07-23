const crypto = require('crypto');


const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Encrypts plaintext using AES-256-GCM.
 * @param {string} plaintext - The text to encrypt
 * @returns {{ encrypted: string, iv: string, authTag: string }} Hex-encoded components
 * @throws {Error} If ENCRYPTION_KEY is not set or invalid
 */
function encrypt(plaintext) {
  if (!plaintext) {
    throw Object.assign(new Error('Plaintext is required'), { name: 'ValidationError' });
  }

  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag
  };
}

/**
 * Decrypts ciphertext that was encrypted with AES-256-GCM.
 * @param {{ encrypted: string, iv: string, authTag: string }} cipherObj - Hex-encoded components
 * @returns {string|null} Decrypted plaintext, or null on failure (tampered data)
 */
function decrypt(cipherObj) {
  if (!cipherObj || !cipherObj.encrypted || !cipherObj.iv || !cipherObj.authTag) {
    return null;
  }

  try {
    const key = getKey();
    const iv = Buffer.from(cipherObj.iv, 'hex');
    const authTag = Buffer.from(cipherObj.authTag, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(cipherObj.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (err) {
    // Authentication failed (tampered data) or invalid input
    return null;
  }
}

/**
 * Retrieves the encryption key from environment.
 * @returns {Buffer} 32-byte key buffer
 * @throws {Error} If key is missing or invalid
 */
function getKey() {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw Object.assign(
      new Error('ENCRYPTION_KEY must be a 32-byte hex string (64 hex chars)'),
      { name: 'ServerError' }
    );
  }
  return Buffer.from(keyHex, 'hex');
}

module.exports = { encrypt, decrypt };
