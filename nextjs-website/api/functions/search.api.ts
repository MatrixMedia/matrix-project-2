import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";


export const GetChatResult = async (search: string, domain: string = 'felp') => {
  const res = await axiosInstance.get<any>(endpoints.search.chat, {
    params: {
      domain,
      search,
    },
  });
  return res.data;
};
