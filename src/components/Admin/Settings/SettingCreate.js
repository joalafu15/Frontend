import 'react-confirm-alert/src/react-confirm-alert.css'

import { useDispatch, useSelector } from 'react-redux'

import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'
import SettingForm from 'src/components/Admin/Settings/components/SettingForm'
import { confirmAlert } from 'react-confirm-alert'
import { postSettingAct } from 'src/redux/settings/actions'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SettingCreate = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { push } = useHistory()
  const { loading } = useSelector((state) => state?.settings)

  const handleSubmit = async (payload) => {
    try {
      const resp = await dispatch(postSettingAct(payload))
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

  return (
    <>
      <SettingForm handleSubmit={handleSubmit} />
      <OverlayLoader show={loading} />
    </>
  )
}

export default SettingCreate
