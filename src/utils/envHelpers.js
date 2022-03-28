export const generateAclObjectFormEnv = () => {
  const acls = process.env.REACT_APP_ACL || ''

  const aclsPerRole = acls.split('&') || []
  const finalAcls = {}

  aclsPerRole.length > 0 &&
    aclsPerRole.map((it) => {
      const perRoleObject = it.split(':')
      finalAcls[perRoleObject[0]] = perRoleObject[1].split(',')
    })

  return finalAcls
}
