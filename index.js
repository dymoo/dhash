const crypto = require('crypto');

const randombytesAsync = require('util').promisify(crypto.randomBytes);

const sha512 = (v) =>
  crypto.createHash('sha512').update(v, 'utf-8').digest('hex');

const hash = async (password, saltlen = 2) => {
  const salt = (await randombytesAsync(saltlen)).toString('hex');
  return `dhash,${saltlen},${sha512(password + salt)}`;
};

const verify = (hash, password) => {
  const parsedHash = hash.split(',');

  if (parsedHash.length !== 3 || !parsedHash[0] === 'dhash') {
    throw Error('Not dhash or malformed hash!');
  }

  const saltlen = parseInt(parsedHash[1]);
  const saltspace = Math.pow(saltlen, 16);

  for (var i = 0; i < saltspace; i++) {
    const salt = i.toString(16);
    if (parsedHash[2] === sha512(password + salt)) {
      return true;
    }
  }

  return false;
};

const password = 'hello123';

hash(password).then((hash) => {
  console.log('hash:', hash);
  console.log('correct password:', verify(hash, password));
  console.log('incorrect password:', verify(hash, 'wrong123'));
});
