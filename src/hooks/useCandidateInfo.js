import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useAuth from './useAuth'

import { getCandidateDetailsAct } from 'src/redux/candidates/actions'
import { selectCandidatesState } from 'src/redux/candidates/selectors'

const useCandidateInfo = (filter) => {
  const dispatch = useDispatch()
  const { userProfile } = useAuth()
  const { entity, loading, error } = useSelector(selectCandidatesState)

  const handleGetCandidateDetails = useCallback(async () => {
    dispatch(
      getCandidateDetailsAct(
        filter
          ? { candidateId: userProfile?.candidateId, filter }
          : userProfile?.candidateId,
      ),
    )
  }, [userProfile?.candidateId])

  useEffect(() => {
    if (userProfile?.candidateId) {
      handleGetCandidateDetails()
    }
    return () => {}
  }, [userProfile?.candidateId])

  return {
    loading,
    data: entity,
    error,
    refetch: handleGetCandidateDetails,
  }
}

export default useCandidateInfo
