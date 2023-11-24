'use strict';

const getJWTGooglePass = require('../../helpers/jwt-google-pass-generator');

module.exports = async function (fastify, opts) {
  fastify.post('/loyaltycard/:accountnumber', async function (request, reply) {
    reply.header('Content-Type', 'text/plain; charset=UTF-8');
    reply.send(getJWTGooglePass(request.body));
  });
}