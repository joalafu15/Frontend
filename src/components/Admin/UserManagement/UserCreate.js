import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import UserForm from 'src/components/Admin/UserManagement/components/UserForm'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'

import { postUserAct } from 'src/redux/users/actions'

const JobPositionCreate = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { push } = useHistory()
  const { loading } = useSelector((state) => state?.users)

  const handleSubmit = async (payload) => {
    try {
      const resp = await dispatch(postUserAct(payload))
      if (resp?.meta?.requestStatus === 'fulfilled') {
        toast.success(t('common.successCreateMessage'))
        if (resp?.payload?.roles.includes('candidate')) {
          confirmAlert({
            title: t('usersManagement.createCandidate'),
            message: t('usersManagement.redirectToCreateCandidateMessage'),
            buttons: [
              {
                label: t('common.yes'),
                onClick: () =>
                  push(`/admin/candidates/create?userId=${resp.payload.id}`),
                className: 'btn btn-primary',
              },
              {
                label: t('common.no'),
                className: 'btn btn-secondary',
                onClick: () => push('/admin/users'),
              },
            ],
          })
        } else {
          push('/admin/users')
        }
      } else if (resp?.meta?.requestStatus === 'rejected') {
        toast.error(t('common.errorMessage'))
      }
    } catch (error) {
      toast.error(t('common.errorMessage'))
    }
  }

  return (
    <>
      <UserForm handleSubmit={handleSubmit} />
      <OverlayLoader show={loading} />
    </>
  )
}

export default JobPositionCreate
