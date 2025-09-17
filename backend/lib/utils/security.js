import crypto from 'crypto';

/**
 * Random string a-zA-Z0-9
 */
function gen(myLength, chars="AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890") {
    const randomArray = new Array(myLength);

    for (let i = 0; i < myLength; i++) {
        const randomIndex = crypto.randomInt(0, chars.length);
        randomArray[i] = chars[randomIndex];
    }

    const randomString = randomArray.join("");
    return randomString;
}

// function uniqid(prefix = "", random = false) {
//     const sec = Date.now() * 1000 + Math.random() * 1000;
//     const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
//     return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}` : ""}`;
// }

/**
 * Uniqid
 * 
 *  date_in_millis  ---- XXXXXXXXXX 0000 \
 *  crypto random   ---- ---------- RRRR \
 *  base36          ---- base36 (0-9a-z) \
 *  padding          0000 ------          
 * 
 * @param {*} prefix 
 * @param {*} random 
 * @returns uniqe ID based on time in millis, crypto-random (length: 14, base36: 0-9a-z)
 */
function uniqid(prefix = "", random = false) {
    const sec = Date.now() * 10000 + crypto.randomInt(0, 10000);
    const id = sec.toString(36).replace(/\./g, "").padStart(14, gen(1));
    return `${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}` : ""}`;
}


function empty(array, ...keys) {
    return !keys.every(key => array[key] != undefined);
}
function empty2(array, keys) {
    if (keys == undefined || keys.length == 0) return false;
    return !keys.every(key => array[key] != undefined && array[key].length != 0);
}
function isStrings(array, keys) {
    return keys.every(key => typeof array[key] === 'string')
}
function isNumbers(array, keys) {
    return keys.every(key => typeof array[key] === 'number' && array[key] != NaN && array[key] != Infinity)
}
function isBooleans(array, keys) {
    return keys.every(key => typeof array[key] === 'boolean')
}

/**
 * 
 * @param {*} array input
 * @param {*} strings 
 * @param {*} numbers 
 * @param {*} booleans 
 * @returns 
 */
function valid(array, strings, numbers, booleans) {
    if (empty2(array, strings) || empty2(array, numbers) || empty2(array, booleans)) return false;
    if (strings != undefined && !isStrings(array, strings)) return false;
    if (numbers != undefined && !isNumbers(array, numbers)) return false;
    if (booleans != undefined && !isBooleans(array, booleans)) return false;
    return true;
}

export {
    gen,
    uniqid,
    valid,
    isStrings,
    isNumbers,
    isBooleans,
}