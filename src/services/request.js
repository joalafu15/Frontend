import httpClient from '../utils/httpClient'

function handleError(error) {
  console.log({ error })
  // TODO: Need to Handle Errors in Various Ways
  return Promise.reject(error.response)
}
export const getApi = (url, params = {}, settings) => {
  return httpClient
    .get(url, {
      params: params,
      ...settings
    })
    .catch((error) => handleError(error))
}

export const postApi = (url, body = {}) => {
  return httpClient.post(url, body).catch((error) => handleError(error))
}

export const putApi = (url, body = {}) => {
  return httpClient.put(url, body).catch((error) => handleError(error))
}

export const patchApi = (url, body = {}) => {
  return httpClient.patch(url, body).catch((error) => handleError(error))
}

export const deleteApi = (url) => {
  return httpClient.delete(url).catch((error) => handleError(error))
}
