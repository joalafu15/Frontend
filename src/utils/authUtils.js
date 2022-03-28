export const hasRole = (user, role) => {
  if (user?.roles?.length > role?.length) {
    return user?.roles?.map((it) => role?.includes(it)).includes(true)
  }
  return role?.map((it) => user?.roles?.includes(it)).includes(true)
}

export const getUserAcls = (acls, roles) => {
  return roles?.map((role) => acls[role])[0]
}

export const actionAllowed = (acl, userAcls) => {
  return userAcls?.includes(acl)
}

const authUtils = {
  hasRole,
  getUserAcls,
}

export default authUtils
