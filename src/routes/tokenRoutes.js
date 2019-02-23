import { Router } from 'express';
import Axios from 'axios';
import Token from '../models/Token';

const routes = Router();

function genCredentials(auth) {
  const { id, secret } = auth;
  return `&client_id=${id}` + `&client_secret=${secret}`;
}

async function queryGitHubRemaining(appId, appSecret) {
  const url =
    `https://api.github.com/rate_limit?` +
    genCredentials({
      id: appId,
      secret: appSecret
    });
  const response = await Axios.get(url);
  const remaining = response.data.rate.remaining;
  return Promise.resolve(remaining);
}

routes.get('/available/:provider', (req, res) => {
  (async () => {
    try {
      const { provider } = req.params;
      const tokens = await Token.find({ provider });

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const { appId, appSecret } = token;
        const remaining = await queryGitHubRemaining(appId, appSecret);
        if (remaining > 50) {
          res.json({ token, remaining });
          return;
        }
      }

      res.json({ error: 'No available tokens!' });
    } catch (error) {
      console.error(error);
      res.json({ error: 'Exception occured when retrieving token.' });
    }
  })();
});

export default routes;
