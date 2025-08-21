export const baseUrl = process.env.NEXT_APP_BASE_URL;
export const baseUrlApi = `${process.env.NEXT_APP_BASE_URL}`;
export const baseUrlMedia = process.env.NEXT_APP_BASE_URL;

// api doc => https://militarymoves-admin.dedicateddevelopers.us/apidoc

export const mediaUrl = (url: string) => {
  return `${baseUrlMedia}/uploads/${url}`;
};

export const endpoints = {
  auth: {
    signup: "user/existence",
  },

  search: {
    chat: "/ai/chat",
  
  },
  cms:{
    about:"/about"
  }
};

export const sucessNotificationEndPoints = [
  endpoints.auth.signup,

];
