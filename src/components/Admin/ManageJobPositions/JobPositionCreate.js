import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import JobPositionForm from 'src/components/Admin/ManageJobPositions/components/JobPositionForm'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'

import { postJobPositionAct } from 'src/redux/jobPositions/actions'

const JobPositionCreate = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { push } = useHistory()
  const { loading } = useSelector((state) => state?.jobPositions)

  const handleSubmit = async (payload) => {
    try {
      const resp = await dispatch(postJobPositionAct(payload))
      if (resp?.meta?.requestStatus === 'fulfilled') {
        toast.success(t('common.successCreateMessage'))

        push('/admin/job-positions')
      } else if (resp?.meta?.requestStatus === 'rejected') {
        toast.error(t('common.errorMessage'))
      }
    } catch (error) {
      toast.error(t('common.errorMessage'))
    }
  }

  return (
    <>
      <JobPositionForm handleSubmit={handleSubmit} />
      <OverlayLoader show={loading} />
    </>
  )
}

export default JobPositionCreate
