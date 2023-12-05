'use strict';

const SHRSSGoogleWallet = require('../../helpers/shrss-google-wallet');

async function createLoyaltyCard(fastify, opts) {
  fastify.post('/loyaltycard/:accountnumber', async function (request, reply) {
    reply.header('Content-Type', 'text/plain; charset=UTF-8');
    reply.send(SHRSSGoogleWallet.createJWTLoyaltyCard(request.body));
  });
}


async function updateLoyaltycard(fastify, opts) {
  fastify.put('/loyaltycard/:accountnumber', async function (request, reply) {
    reply.header('Content-Type', 'text/plain; charset=UTF-8');
    reply.send(await SHRSSGoogleWallet.updateJWTLoyaltyCard(request.body));
  });
}

module.exports = {
  createLoyaltyCard,
  updateLoyaltycard
}