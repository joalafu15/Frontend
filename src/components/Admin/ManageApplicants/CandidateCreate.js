import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import CandidateForm from 'src/components/Admin/ManageApplicants/components/CandidateForm'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'

import { postCandidateAct } from 'src/redux/candidates/actions'

const CandidateCreate = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { push } = useHistory()
  const { loading } = useSelector((state) => state?.candidates)

  const handleSubmit = async (payload) => {
    try {
      const resp = await dispatch(postCandidateAct(payload))
      if (resp?.meta?.requestStatus === 'fulfilled') {
        toast.success(t('manageApplicants.successCreateMessage'))

        push('/admin/candidates')
      } else if (resp?.meta?.requestStatus === 'rejected') {
        toast.error(t('common.errorMessage'))
      }
    } catch (error) {
      toast.error(t('common.errorMessage'))
    }
  }

  return (
    <>
      <CandidateForm handleSubmit={handleSubmit} />
      <OverlayLoader show={loading} />
    </>
  )
}

export default CandidateCreate
