import axios from "axios";

export const allergyPost = async (data: { categories: number[] }) => {
  const response = await axios.post("/api/allergy", data);
  return response.data;
};
