import { getApi } from './request'

export const getSectorList = (params) => {
  const filter = typeof params === 'object' ? params.filter : undefined
  return getApi(`/sectors`, { filter })
}
