import 'react-confirm-alert/src/react-confirm-alert.css'

import {
  getSettingDetailAct,
  postSettingAct,
  putSettingAct,
  resetSettingStateAct,
} from 'src/redux/settings/actions'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'
import SettingForm from 'src/components/Admin/Settings/components/SettingForm'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const SettingEdit = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { push } = useHistory()
  const { settingId } = useParams()
  const { loading, entity } = useSelector((state) => state?.settings)

  const handleSubmit = async (payload) => {
    try {
      const resp = await dispatch(putSettingAct(payload))
      if (resp?.meta?.requestStatus === 'fulfilled') {
        toast.success(t('common.successCreateMessage'))
        push('/admin/settings')
      } else if (resp?.meta?.requestStatus === 'rejected') {
        toast.error(t('common.errorMessage'))
      }
    } catch (error) {
      toast.error(t('common.errorMessage'))
    }
  }

  const handleGetSettingDetails = useCallback(() => {
    if (settingId) {
      dispatch(getSettingDetailAct(settingId))
    }
  }, [settingId])
  useEffect(() => {
    handleGetSettingDetails()

    return () => {
      dispatch(resetSettingStateAct())
    }
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <SettingForm handleSubmit={handleSubmit} entity={entity} />
      <OverlayLoader show={loading} />
    </>
  )
}

export default SettingEdit
