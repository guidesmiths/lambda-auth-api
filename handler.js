const { get } = require('axios');

const isTokenValidForGoogle = token => get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
  .then(response => response.data)
  .catch(err => err);

const buildErrorBody = (err, code = 500) => {
  console.error(err);
  return { statusCode: code };
};

const buildSuccessBody = (data = {}) => ({
  statusCode: 200,
  body: JSON.stringify(data)
});


module.exports.auth = async event => {
  try {
    const token = event["queryStringParameters"]['token']
    if (!token) throw new Error('Missing token');
    const payloadFromGoogle = await isTokenValidForGoogle(token);
    // if (payloadFromGoogle.aud !== gsAppsKnownIds) throw new Error('Invalid token');
    if (!(payloadFromGoogle.email && payloadFromGoogle.email.endsWith('guidesmiths.com'))) {
      throw new Error('Invalid email - you need a GuideSmiths email to browse this app');
    }
		return buildSuccessBody(payloadFromGoogle);
	} catch (err) {
		return buildErrorBody(err);
	}
};
