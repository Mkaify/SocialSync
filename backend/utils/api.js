// src/utils/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Register
export const registerUser = (userData) => apiClient.post('/auth/register', userData);

// Login
export const loginUser = (userData) => apiClient.post('/auth/login', userData);

// Connect Social Account
export const connectAccount = (token, accountData) =>
  apiClient.post('/social/connect', accountData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Post to Platforms
export const createPost = (token, postData) =>
  apiClient.post('/posts', postData, {
    headers: { Authorization: `Bearer ${token}` },
  });