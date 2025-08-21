import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export const fetchAboutUs = async () => {
  const res = await axiosInstance.get<any>(endpoints.cms.about);
  return res;
};

