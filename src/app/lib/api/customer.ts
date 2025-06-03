import api from "../axios";

export const fetchCustomerCount = async (): Promise<number> => {
  const response = await api.get("/customers/count");
  return response.data.count;
};

export const fetchNewCustomersToday = async () => {
  const response = await api.get("/customers/new-today");
  return response.data;
};
