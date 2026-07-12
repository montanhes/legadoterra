import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost'

export const api = axios.create({
  baseURL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
  },
})

export async function ensureCsrfCookie() {
  await api.get('/sanctum/csrf-cookie')
}
