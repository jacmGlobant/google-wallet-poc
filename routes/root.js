'use strict'

const loyaltycard = require('./loyaltycard');
const health = require('./health');

module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
  fastify.register(loyaltycard.createLoyaltyCard);
  fastify.register(loyaltycard.updateLoyaltycard);
  fastify.register(health);
}
