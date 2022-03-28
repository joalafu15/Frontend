import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { getSectorList } from 'src/services/sectorsSvc'

const useSector = (params) => {
  const [loading, setLoading] = useState(false)
  const [entities, setEntities] = useState([])
  const [error, setError] = useState()
  const arabic = i18next.language === 'ar'

  const getList = async (params, searchForOption) => {
    setLoading(true)
    try {
      const resp = await getSectorList(params)

      setEntities(resp?.data)
      setLoading(false)

      if (searchForOption) {
        return resp?.data.map((it) => ({
          value: it.id,
          label: it[arabic ? 'name' : 'name_en'],
        }))
      }

      return resp?.data
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getList({
      ...(typeof params === 'object'
        ? {
            filter: {
              ...params?.filter,
            },
          }
        : {
            filter: {
              limit: 10,
            },
          }),
    })

    return () => {}
  }, [])

  return {
    loading,
    data: entities,
    options: entities.map((it) => ({
      value: it.id,
      label: it[arabic ? 'name' : 'name_en'],
    })),
    error,
    search: getList,
  }
}

export default useSector
