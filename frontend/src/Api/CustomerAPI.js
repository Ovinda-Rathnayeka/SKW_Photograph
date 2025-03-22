import axios from 'axios';


const API_URL = 'http://localhost:5000/customer'; 

export const getCustomerById = async (_id) => {
  try {
    const response = await axios.get(`${API_URL}/customer/${_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer data:', error);
    throw error;
  }
};

export const updateCustomer = async (_id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/update/${_id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating customer data:', error);
    throw error;
  }
};
