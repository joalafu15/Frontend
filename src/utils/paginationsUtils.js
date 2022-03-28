/**
 *
 * @param limit
 * @param offset
 * @returns number current page
 */

export const getCurrentPage = (limit, offset) => {
  return Math.ceil((offset - 1) / limit) + 1
}

/**
 *
 * @param currentPage
 * @param limit
 * @returns number offset
 */
export const getOffsetFromCurrentPage = (currentPage, limit) =>
  (currentPage - 1) * limit

/**
 *
 * @param {*} limit
 * @param {*} count
 * @returns
 */
export const getTotalPage = (limit, count) => Math.ceil(count / limit)
