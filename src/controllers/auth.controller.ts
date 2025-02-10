import { Elysia, Context } from "elysia";
import axios from "axios";

export const authsController = (app: Elysia) => {
  app.group("/auth", (auth) =>
    auth.get("/get-user-data/:code", async (handler: Context<any>) => {
      try {
        const accessToken = await getGithubAccessToken(handler.params.code);
        const userData = await getUserData(accessToken);
        return { userData };
      } catch (error) {
        return { message: error };
      }
    })
  );

  return app;
};

const getGithubAccessToken = async (code: string) => {
  const tokenResponse = await axios.post(
    `https://github.com/login/oauth/access_token`,
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_SECRET,
      code: code,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  return tokenResponse.data.access_token;
};

const getUserData = async (accessToken: string) => {
  const userProfileResponse = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const emailResponse = await axios.get("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const userData = userProfileResponse.data;
  const emailData = emailResponse.data;

  const primaryEmail = emailData.find((e: any) => e.primary == true);

  const nameParts = userData.name ? userData.name.split(" ") : [];
  const firstName = nameParts[0] || null;
  const lastName = nameParts.slice(1).join(" ") || null;

  return {
    id: userData.id,
    firstName: firstName,
    lastName: lastName,
    fullName: userData.name,
    email: primaryEmail ? primaryEmail.email : null,
    picture: userData.avatar_url,
  };
};
