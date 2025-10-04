import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL + "/restaurant";
const api = axios.create({ baseURL });

const UserRepository = {
  async fetchRestaurants() {
    const response = await api.get("/");
    return response.data;
  },
};

export default UserRepository;
