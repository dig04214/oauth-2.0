import axios from 'axios';
import { LOGIN_USER, REGISTER_USER, LOGOUT_USER, AUTH_USER } from './types';
export function loginUser (dataToSubmit) {
  const request = axios.post('/console/login', dataToSubmit)
    .then(response => response.data)

  return {
    type: LOGIN_USER,
    payload: request
  }
}
export function registerUser (dataToSubmit) {
  const request = axios.post('/console/register', dataToSubmit)
    .then(response => response.data)

  return {
    type: REGISTER_USER,
    payload: request
  }
}
export function logoutUser() {
  const request = axios.get('/console/logout')
  .then(res => res.data)
  return {
    type: LOGOUT_USER,
    payload: request
  }
}
export function auth(){
  const request = axios.get('/console/auth')
  .then(res => res.data)
  return {
    type: AUTH_USER,
    payload: request
  }
}