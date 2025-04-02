import CryptoJS from 'crypto-js';

const encryptionKey = "PHnBl3IFFVmLzXdPGaaJvF8pCrCmRuCHjp0GhtU3bt8=";

export function encryptData(data) {
    try {
        const jsonString = JSON.stringify(data);
        return CryptoJS.AES.encrypt(jsonString, encryptionKey).toString();
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
}

export function decryptData(encryptedData) {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
        const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

export function saveToLocalStorage(key, data) {
    const encrypted = encryptData(data);
    if (encrypted) {
        localStorage.setItem(key, encrypted);
        return true;
    }
    return false;
}

export function loadFromLocalStorage(key) {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decryptData(encrypted);
}