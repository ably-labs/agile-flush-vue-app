const Ably = require('ably/promises');

module.exports = async function (context) {
    let id = 'id-' + Math.random().toString(36).substr(2, 16);
    const client = new Ably.Realtime(process.env.ABLY_API_KEY);
    const tokenRequestData = await client.auth.createTokenRequest({ clientId: id });
    context.res = { 
        headers: { "content-type": "application/json" },
        body: JSON.stringify(tokenRequestData) 
    };
};