require('dotenv').config();
const path = require('path');
const jwt = require('jsonwebtoken');

const tierColors = require('./tierColors.json');
const updateLoyaltyCardService = require('../../services/updateLoyaltyCard.service');

const WALLET_ISSUER_ID = process.env.WALLET_ISSUER_ID;
const WALLET_CLASS_SUFFIX = process.env.WALLET_CLASS_SUFFIX;
const CLIENT_EMAIL = process.env.CREDENTIALS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.CREDENTIALS_PRIVATE_KEY;

const genericObject = require(path.resolve('./helpers/shrss-google-wallet/templates/loyalty_card_pass.json'));
console.log(process.cwd());

const _getObjectId = ()  => {
  //  const objectSuffix =  Math.floor(Date.now() / 1000).toString();
   const OBJECTSUFFIX = '9876543210';
   return `${WALLET_ISSUER_ID}.${OBJECTSUFFIX}`;
}

const createJWTLoyaltyCard = (data) => {

  genericObject.hexBackgroundColor = tierColors[data.tier];
  genericObject.classId = `${WALLET_ISSUER_ID}.${WALLET_CLASS_SUFFIX}`;
  genericObject.id = _getObjectId();
  // genericObject.genericType = 'LoyaltyCard';
  genericObject.header.defaultValue.value = data.accountNumber;
  genericObject.textModulesData[0].body = data.name;
  genericObject.textModulesData[1].body = data.tier;
  genericObject.barcode.value = data.accountNumber;
  genericObject.barcode.alternateText = data.accountNumber;

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


const updateJWTLoyaltyCard = async (data) => {
  return await updateLoyaltyCardService(data);
}


module.exports = { createJWTLoyaltyCard, updateJWTLoyaltyCard };