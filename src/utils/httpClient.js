import Axios from 'axios'
import jwt_decode from 'jwt-decode'

import { Storage } from 'src/services/storage'
import environments from 'src/constants/environment.js'

const accessToken = localStorage.getItem('token')
const refreshToken = localStorage.getItem('refresh')
const userProfile = localStorage.getItem('userProfile')

/**
 * httpClient
 * Axios instance for all API requests
 */
const httpClient = Axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL ?? environments.apiBaseUrl,
})

/**
 * Refresh Token
 * Attempt to refresh the token on the server
 */
export const postRefreshToken = async () => {
  return Axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/refresh`, {
    refreshToken,
  })
}

/**
 * getLogout
 */
export const getLogout = (redirect) => {
  Storage.removeItem('token')
  Storage.removeItem('refresh')
  Storage.removeItem('userProfile')

  httpClient.defaults.headers.common['Authorization'] = null

  if (
    !(
      window?.location?.pathname === '/' ||
      window?.location?.pathname === '/sign-up' ||
      window?.location?.pathname === '/reset-password' ||
      window?.location?.pathname === '/mdcl'
    )
  ) {
    window?.location?.replace(redirect ?? '/')
  }

  return null
}

/**
 * login
 */
export const postLogin = async (payload) => {
  try {
    const loginResp = await Axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/users/login`,
      payload,
    )
    if (
      loginResp?.status === 200 &&
      loginResp?.data?.token &&
      loginResp?.data?.refresh
    ) {
      const accessToken = loginResp?.data?.token
      const refreshToken = loginResp?.data?.refresh
      const userProfile = jwt_decode(loginResp?.data?.token)

      Storage.setItem('token', accessToken)
      Storage.setItem('refresh', refreshToken)
      Storage.setItem('userProfile', userProfile)

      httpClient.defaults.headers.common['Authorization'] =
        'Bearer ' + loginResp?.token

      return {
        status: loginResp?.status,
        data: userProfile,
      }
    } else {
      throw new Error('Something went wrong!')
    }
  } catch (error) {
    throw error
  }
}

/**
 * Request interceptor for checking if the token is going to expire
 * soon and refresh it if it will
 */
httpClient.interceptors.request.use(
  function (config) {
    const currentTime = Date.now()
    if (!userProfile?.exp && currentTime >= userProfile?.exp) {
      postRefreshToken()
        .then((response) => {
          const respData = response.data
          Storage.setItem('token', respData?.token)
          httpClient.defaults.headers.common['Authorization'] =
            'Bearer ' + respData?.token
          return config
        })
        .catch(() => {
          getLogout()
          return
        })
    } else {
      return config
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

/**
 * Error interceptor for refreshing token if receiving a 401. This is
 * a last resort
 */
httpClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const originalRequest = error.config
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      return postRefreshToken()
        .then((response) => {
          const respData = response.data

          Storage.setItem('token', respData?.token)

          httpClient.defaults.headers.common['Authorization'] =
            'Bearer ' + respData?.token

          originalRequest.headers['Authorization'] = 'Bearer ' + respData?.token

          return Axios(originalRequest)
        })
        .catch(() => {
          getLogout()
          return
        })
    } else {
      return Promise.reject(error)
    }
  },
)

// Inject Authorization header if we have an access token
if (accessToken) {
  httpClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
}

export const setAuthTokenHeaders = (token) => {
  httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const removeAuthTokenHeaders = (token) => {
  httpClient.defaults.headers.common['Authorization'] = null
}

export default httpClient
