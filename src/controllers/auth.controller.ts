import { Elysia, Context } from 'elysia';
import githubService from '../services/github.service';
import googleService from '../services/google.service';

export const authsController = (app: Elysia) => {
  app.group('/auth', auth =>
    auth
      .get('/github/get-user-data/:code', async (handler: Context<any>) => {
        try {
          const accessToken = await githubService.getGithubAccessToken(
            handler.params.code
          );
          const userData = await githubService.getUserData(accessToken);
          return userData;
        } catch (error) {
          return { message: error };
        }
      })
      .get('/google/get-user-data/:id_token', async (handler: Context<any>) => {
        try {
          const userData = await googleService.getUserData(
            handler.params.id_token
          );
          return userData;
        } catch (error) {
          return { message: error };
        }
      })
  );

  return app;
};
