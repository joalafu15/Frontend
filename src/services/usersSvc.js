import { getApi, postApi } from 'src/services/request'

export const postUser = (payload) => postApi('/users', payload)

export const getUserList = async (params) => {
  try {
    const { pagination = { limit: 10 }, order = {}, where = {} } = params
    const ordersBy = Object.keys(order).map((it) => `${it} ${order[it]}`)
    const whereIs = {}

    Object.keys(where).map((it) => {
      whereIs[it] = {
        like: `%${where[it]}%`,
      }
    })

    const paginationsIs = {
      limit: 10,
      skip: 0,
      ...pagination,
    }

    const objectQuery = {
      ...paginationsIs,
      ...(ordersBy.length > 0 && { order: ordersBy }),
      ...(Object.keys(whereIs).length > 0 && {
        where: whereIs,
      }),
    }

    const jsonQuery = escape(JSON.stringify(objectQuery))
    const [count, items] = await Promise.allSettled([
      getApi(`/users/count?filter=${jsonQuery}`),
      getApi(`/users?filter=${jsonQuery}`),
    ])

    return {
      data: items?.value.data,
      meta: count?.value?.data,
    }
  } catch (error) {
    throw error
  }
}
