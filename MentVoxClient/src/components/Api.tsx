import axios from "axios";

const BASE_URL = "http://localhost:7059/api/auth"; // ודאי שהפורט נכון

export const login = async (
  UserName: string,
  Password: string
): Promise<any> => {
  return axios.post(`${BASE_URL}/login`, { UserName, Password });
};

export const register = async (
  UserName: string,
  Password: string,
  Email: string
): Promise<any> => {
  return axios.post(`${BASE_URL}/register`, {
    UserName,
    Password,
    Email,
  });
};
