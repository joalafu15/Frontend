import { deleteApi, getApi, postApi } from 'src/services/request'

import { putApi } from './request'

export const postSetting = (payload) => postApi('/settings', payload)

export const getSettingList = (params) => {
  const { pagination = { limit: 10 }, where = {} } = params

  const whereIs = {}
  Object.keys(where).map((it) => {
    whereIs[it] = {
      like: `%${where[it]}%`,
    }
  })

  const jsonQuery = escape(JSON.stringify({ ...pagination, where: whereIs }))

  return getApi(`/settings?filter=${jsonQuery}`)
}

export const getSettingDetails = (settingId) => {
  return getApi(`/settings/${settingId}`)
}

export const putSetting = (payload) => {
  return putApi(`/settings/${payload?.id}`, payload)
}

export const deleteSetting = (payload) => {
  return deleteApi(`/settings/${payload?.id}`)
}
