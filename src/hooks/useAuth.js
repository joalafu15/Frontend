import { useCallback, useEffect, useState } from 'react'

import { Storage } from 'src/services/storage'
import { postLogin, getLogout } from 'src/utils/httpClient'
import { getUserAcls } from 'src/utils/authUtils'
import acls from 'src/constants/acl'

const UseAuth = () => {
  const [userProfile, setUserProfile] = useState({})
  const [loading, setLoading] = useState(false)
  const [userAcls, setUserAcls] = useState([])

  const loadUserProfile = useCallback(async () => {
    setLoading(true)
    try {
      const userProfile = await Storage.getItem('userProfile')
      if (userProfile && Object.keys(userProfile).length > 0) {
        setUserProfile(userProfile)
        setUserAcls(getUserAcls(acls, userProfile.roles))
      } else {
        logout()
      }
    } catch (error) {
      console.warn(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUserProfile()
  }, [])

  const login = async (payload) => {
    try {
      const loginResp = await postLogin(payload)
      return loginResp
    } catch (error) {
      throw error
    }
  }

  const logout = () => getLogout()

  return {
    loading,
    login,
    userProfile,
    userAcls,
    logout,
  }
}

export default UseAuth
