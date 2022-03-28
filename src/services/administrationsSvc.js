import utf8 from 'utf8'

import { getApi } from './request'

export const getAdministrationsList = (params = { filters: {} }) => {
  const { pagination = {}, order = {}, where = {} } = params

  const ordersBy = Object.keys(order).map((it) => `${it} ${order[it]}`)
  const whereIs = {}

  Object.keys(where).map((it) => {
    if (it === 'administrationId' || it === 'nationalIdNumber') {
      return Object.assign(whereIs, {
        [it]: {
          like: `%${utf8.encode(where[it])}%`,
        },
      })
    } else if (it === 'jobPositionId') {
      return Object.assign(whereIs, {
        [it]: {
          eq: where[it],
        },
      })
    } else {
      return Object.assign(whereIs, {
        [it]: {
          neq: where[it],
        },
      })
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

  const queryParams = escape(JSON.stringify(objectQuery))

  return getApi(`/administrations?filter=${queryParams}`)
}

export const getAdministrationCandidateList = async (
  administrationId,
  params = {},
) => {
  try {
    const { pagination = {}, order = {}, where = {} } = params

    const ordersBy = Object.keys(order).map((it) => `${it} ${order[it]}`)
    const whereIs = {}

    Object.keys(where).map((it) => {
      return Object.assign(whereIs, {
        [it]: {
          like: `%${utf8.encode(where[it])}%`,
        },
      })
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
      include: [{ relation: 'sector' }, { relation: 'interviewTimeSlot' }],
    }

    const queryParams = escape(JSON.stringify(objectQuery))
    const [count, items] = await Promise.allSettled([
      getApi(
        `/administrations/${administrationId}/candidates/count?filter=${queryParams}`,
      ),
      getApi(
        `administrations/${administrationId}/candidates?filter=${queryParams}`,
      ),
    ])
    return {
      data: items?.value.data,
      meta: count?.value?.data,
    }
  } catch (error) {
    throw error
  }
}
