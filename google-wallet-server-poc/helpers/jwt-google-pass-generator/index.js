require('dotenv').config();

const path = require('path');
const jwt = require('jsonwebtoken');

let issuerId = process.env.ISSUER_ID;
let classSuffix = process.env.CLASS_SUFFIX;

const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const genericObject = require(path.resolve('./helpers/jwt-google-pass-generator/templates/loyalty_card_pass.json'));

const _getObjectId = ()  => {
   const objectSuffix =  Math.floor(Date.now() / 1000).toString();
   return `${issuerId}.${objectSuffix}`;
}

const mapBgToTier = {
  'Star': '#C12033',
  'Legend': '#226093',
  'Icon': '#CF9F35',
  'X': '#101820'
}

const getJWTGooglePass = (data) => {

  genericObject.hexBackgroundColor = mapBgToTier[data.tier];
  genericObject.id = _getObjectId();
  genericObject.classId = `${issuerId}.${classSuffix}`;
  genericObject.header.defaultValue.value = data.accountNumber;
  genericObject.textModulesData[0].body = data.name;
  genericObject.textModulesData[1].body = data.tier;
  genericObject.barcode.value = data.accountNumber;

   const claims = {
     iss: CLIENT_EMAIL,
     aud: 'google',
     origins: ['http://localhost:3000'],
     typ: 'savetowallet',
     payload: {
       genericObjects: [genericObject],
     },
   };

   return jwt.sign(claims, PRIVATE_KEY, {algorithm: 'RS256'});
}


module.exports = getJWTGooglePass;