require('dotenv').config();
const { GoogleAuth } = require('google-auth-library');
const tierColors = require('../helpers/shrss-google-wallet/tierColors.json');

const WALLET_GOOGLE_API_BASE_URL = process.env.WALLET_GOOGLE_API_BASE_URL;
const objectUrl = `${WALLET_GOOGLE_API_BASE_URL}/genericObject/`;

const credentials = {
   type: process.env.CREDENTIALS_TYPE,
   project_id: process.env.CREDENTIALS_PROJECT_ID,
   private_key_id: process.env.CREDENTIALS_PRIVATE_KEY_ID,
   private_key: process.env.CREDENTIALS_PRIVATE_KEY,
   client_email: process.env.CREDENTIALS_CLIENT_EMAIL,
   client_id: process.env.CREDENTIALS_CLIENT_ID,
   auth_uri: process.env.CREDENTIALS_AUTH_URI,
   token_uri: process.env.CREDENTIALS_TOKEN_URI,
   auth_provider_x509_cert_url: process.env.CREDENTIALS_AUTH_PROVIDER_X509_CERT_URL,
   client_x509_cert_url: process.env.CREDENTIALS_CLIENT_X509_CERT_URL,
   universe_domain: process.env.CREDENTIALS_UNIVERSE_DOMAIN
}

const scopes = process.env.CREDENTIALS_SCOPE;

const httpClient = new GoogleAuth({ credentials, scopes });


const updateLoyaltyCardService = async (data) => {
      
   let checkLoyaltyCardExists;

   const { objectSuffix, updateFields } = data;

   try {

      checkLoyaltyCardExists = await httpClient.request({
         url: `${objectUrl}${objectSuffix}`,
         method: 'GET'
       });

   } catch (error) {
      if (error.response && error.response.status === 404) {
         console.log(`Object ${objectSuffix} not found!`);
         return `${objectSuffix}`;
      } else {
         // Something else went wrong...
         console.log(error);
         return `${objectSuffix}`;
      }
   }

   // check if the object exists
   let updatedObject = checkLoyaltyCardExists.data;

   if (updatedObject['textModulesData']) {
      if (updateFields.tier){
         updatedObject.hexBackgroundColor = tierColors[updateFields.tier];
         updatedObject['textModulesData'][1].body = updateFields?.tier;
      }
      if (updateFields.expirationDate){
         updatedObject['linksModuleData'][2].body = updateFields?.expirationDate;
      }
   }
   
   await httpClient.request({
      url: `${objectUrl}${objectSuffix}`,
      method: 'PUT',
      data: updatedObject
   });

   return `${objectSuffix}`;
}

module.exports = updateLoyaltyCardService;