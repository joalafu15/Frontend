import { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import JobPositionForm from 'src/components/Admin/ManageJobPositions/components/JobPositionForm'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'

import {
  putJobPositionAct,
  getJobPositionDetailsAct,
  resetJobPositionStateAct,
} from 'src/redux/jobPositions/actions'

const JobPositionEdit = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { push } = useHistory()
  const { jobPositionId } = useParams()
  const { loading, entity } = useSelector((state) => state?.jobPositions)

  const handleSubmit = async (payload) => {
    try {
      const resp = await dispatch(putJobPositionAct(payload))
      if (resp?.meta?.requestStatus === 'fulfilled') {
        toast.success(t('common.successUpdateMessage'))

        push('/admin/job-positions')
      } else if (resp?.meta?.requestStatus === 'rejected') {
        toast.error(t('common.errorMessage'))
      }
    } catch (error) {
      toast.error(t('common.errorMessage'))
    }
  }

  const handleGetJobPositionDetails = useCallback(() => {
    if (jobPositionId) {
      dispatch(getJobPositionDetailsAct(jobPositionId))
    }
  }, [jobPositionId])

  useEffect(() => {
    handleGetJobPositionDetails()

    return () => {
      dispatch(resetJobPositionStateAct())
    }
  }, [])

  return (
    <>
      <JobPositionForm handleSubmit={handleSubmit} entity={entity} />
      <OverlayLoader show={loading} />
    </>
  )
}

export default JobPositionEdit
