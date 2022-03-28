import reduce from 'lodash/reduce'

export const transformArrayToObject = (data, key) =>
  reduce(
    data,
    function (obj, param) {
      obj[param[key]] = param
      return obj
    },
    {},
  )
