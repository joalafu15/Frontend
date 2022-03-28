import { deleteApi, getApi, patchApi, postApi, putApi } from './request'

import utf8 from 'utf8'

export const postJobPosition = (payload) => {
  return postApi('/job-positions', payload)
}

export const putJobPosition = (payload) => {
  return putApi(`/job-positions/${payload?.id}`, payload)
}

export const patchJobPosition = (payload) => {
  return patchApi(`/job-positions/${payload?.id}`, payload)
}

export const getJobPositionDetails = (jobPositionId) => {
  return getApi(`/job-positions/${jobPositionId}`)
}

export const deleteJobPosition = (payload) => {
  return deleteApi(`/job-positions/${payload?.id}`)
}

export const getJobPositionList = async (params) => {
  try {
    const { pagination = {}, order = {}, where = {} } = params

    const ordersBy = Object.keys(order).map((it) => `${it} ${order[it]}`)

    const whereIs = {}
    Object.keys(where).map((it) => {
      whereIs[it] = {
        like: `%${utf8.encode(where[it])}%`,
      }
    })

    const paginationsIs = {
      limit: 10,
      skip: 0,
      ...pagination,
    }

    const jsonQueries = escape(
      JSON.stringify({
        ...paginationsIs,
        ...(ordersBy.length > 0 && {
          order: ordersBy,
        }),
        ...(Object.keys(whereIs).length > 0 && {
          where: whereIs,
        }),
      }),
    )

    const [count, items] = await Promise.allSettled([
      getApi(`/job-positions/count?filter=${jsonQueries}`),
      getApi(`/job-positions?filter=${jsonQueries}`),
    ])

    return {
      data: items?.value?.data,
      meta: count?.value?.data,
    }
  } catch (error) {
    throw error
  }
}
