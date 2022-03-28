import { useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import CandidateForm from 'src/components/Admin/ManageApplicants/components/CandidateForm'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'

import {
  putCandidateAct,
  getCandidateDetailsWithRelationsAct,
  resetCandidateStateAct,
} from 'src/redux/candidates/actions'

const CandidateEdit = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { push } = useHistory()
  const { candidateId } = useParams()
  const { loading, entity } = useSelector((state) => state?.candidates)

  const handleSubmit = async (payload) => {
    try {
      const resp = await dispatch(putCandidateAct({ candidateId, payload }))
      if (resp?.meta?.requestStatus === 'fulfilled') {
        toast.success(t('manageApplicants.successUpdateMessage'))

        push('/admin/candidates')
      } else if (resp?.meta?.requestStatus === 'rejected') {
        toast.error(t('common.errorMessage'))
      }
    } catch (error) {
      toast.error(t('common.errorMessage'))
    }
  }

  const handleGetCandidateDetails = useCallback(() => {
    if (candidateId) {
      dispatch(getCandidateDetailsWithRelationsAct(candidateId))
    }
  }, [candidateId])

  useEffect(() => {
    handleGetCandidateDetails()

    return () => {
      dispatch(resetCandidateStateAct())
    }
  }, [])

  return (
    <>
      <CandidateForm
        loading={loading}
        handleSubmit={handleSubmit}
        entity={entity}
      />
      <OverlayLoader show={loading} />
    </>
  )
}

export default CandidateEdit
