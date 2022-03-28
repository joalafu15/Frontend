import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import get from 'lodash/get'

import useAuth from 'src/hooks/useAuth'

import { getApi } from 'src/services/request'

export const SettingsContext = createContext()

export const SettingsProvider = (props) => {
  const [settings, setSettings] = useState([])
  const [loading, setLoading] = useState(false)
  const { userProfile } = useAuth()

  const loadSettings = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getApi(
        `/candidates/${userProfile?.candidateId}/settings`,
      )

      setSettings(response?.data)
    } catch (error) {
      console.warn(error)
    } finally {
      setLoading(false)
    }
  }, [userProfile?.roles, userProfile?.candidateId])

  useEffect(() => {
    if (
      get(userProfile, 'roles', []).includes('candidate') &&
      userProfile?.candidateId
    ) {
      loadSettings()
    }
  }, [userProfile?.roles, userProfile?.candidateId])

  const isActive = (key) => {
    if (!settings.length) return null
    return settings?.find((s) => s.setting === key)?.active
  }

  return (
    <SettingsContext.Provider value={{ loading, settings, isActive }}>
      {props.children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
