import axios from 'axios';


const API_URL = 'http://localhost:5000/customer'; 

export const getCustomerById = async (_id) => {
  const response = await axios.get(`http://localhost:5000/customer/${_id}`);
  return response.data;
};


export const updateCustomer = async (_id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/update/${_id}`, updatedData);
    const user = response.data.customer;
    console.log(user);
    return user;
  } catch (error) {
    console.error('Error updating customer data:', error);
    throw error;
  }
};
