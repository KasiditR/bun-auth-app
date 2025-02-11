import axios from 'axios';

const getUserData = async (idToken: string) => {
  const tokenInfoResponse = await axios.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
  );

  const userData = tokenInfoResponse.data;

  return {
    id: userData.sub,
    firstName: userData.given_name,
    lastName: userData.family_name,
    fullName: userData.name,
    email: userData.email,
    picture: userData.picture,
  };
};

export default {
  getUserData,
};
