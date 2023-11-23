require('dotenv').config();

const path = require('path');
const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');

let issuerId = process.env.ISSUER_ID;
let classSuffix = process.env.CLASS_SUFFIX;
const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 'certificates/shrss-demo-google-wallet.json';

const credentials = require(path.resolve(keyFilePath));
const genericObject = require(path.resolve('./helpers/jwt-google-pass-generator/templates/loyalty_card_pass.json'));

const _getObjectId = ()  => {
  //  const objectSuffix =  Math.floor(Date.now() / 1000).toString();
   const objectSuffix =  'codelab_object';
   return `${issuerId}.${objectSuffix}`;
}

// const httpClient = new GoogleAuth({
//   credentials: credentials,
//   scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
// });

const getJWTGooglePass = (data) => {

   genericObject.id = _getObjectId();
   genericObject.classId = `${issuerId}.${classSuffix}`;

   genericObject.header.defaultValue.value = data.memberNumber;
   genericObject.textModulesData[0].body.value = data.name;
   genericObject.textModulesData[1].body.value = data.tier;
   genericObject.barcode.value = data.memberNumber;

   const claims = {
     iss: credentials.client_email, // `client_email` in service account file.
     aud: 'google',
     origins: ['http://localhost:3000'],
     typ: 'savetowallet',
     payload: {
       genericObjects: [genericObject],
     },
   };

  //  console.log(JSON.stringify(claims));

   return jwt.sign(claims, credentials.private_key, {algorithm: 'RS256'});
}


module.exports = getJWTGooglePass;