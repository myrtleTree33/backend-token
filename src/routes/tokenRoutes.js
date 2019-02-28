import { Router } from 'express';
import Axios from 'axios';
import shuffle from 'shuffle-array';

import Token from '../models/Token';

const routes = Router();

async function queryGitHubRemaining(authToken) {
  const url = 'https://api.github.com/rate_limit';
  const response = await Axios.get(url, {
    headers: {
      Authorization: `token ${authToken}`
    }
  });
  const remaining = response.data.rate.remaining;
  return Promise.resolve(remaining);
}

routes.get('/available/:provider', (req, res) => {
  (async () => {
    try {
      const { provider } = req.params;
      const tokens = await Token.find({ provider });

      // shuffle array
      shuffle(tokens);

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const { authToken } = token;
        const remaining = await queryGitHubRemaining(authToken);
        if (remaining > 50) {
          res.json({ token, remaining });
          return;
        }
        console.log(`Exhausted ${name}..`);
      }

      res.json({ error: 'No available tokens!' });
    } catch (error) {
      console.error(error);
      res.json({ error: 'Exception occured when retrieving token.' });
    }
  })();
});

export default routes;
