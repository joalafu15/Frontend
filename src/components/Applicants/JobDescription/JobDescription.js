import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import 'react-confirm-alert/src/react-confirm-alert.css'
import { confirmAlert } from 'react-confirm-alert'

import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'
import Notification from '../../Notification'
import useAuth from 'src/hooks/useAuth'
import { SettingsContext } from 'src/contexts/settings'

import {
  getCandidateJobPositionDetailsAct,
  postCandidateAcceptRejectTermsAct,
  getCandidateDetailsAct
} from 'src/redux/candidates/actions'
import { selectCandidatesState } from 'src/redux/candidates/selectors'

import './JobDescription.css'

export default function JobDescription() {
  const history = useHistory()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const candidateState = useSelector(selectCandidatesState)
  const { userProfile } = useAuth()

  const { candidateId } = userProfile
  const { jobPosition } = candidateState

  const settings = useContext(SettingsContext)

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  const submitConfirmation = (payload) => {
    confirmAlert({
      title: t('job.submitConfirmationTitle'),
      message: t(`job.submit${payload.accept ? 'Accept' : 'Reject'}Message`),
      buttons: [
        {
          label: t('common.yes'),
          onClick: () => handleAcceptRejectJobTerms(payload),
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  const handleAcceptRejectJobTerms = async (payload) => {
    try {
      const resp = dispatch(
        postCandidateAcceptRejectTermsAct({ candidateId, payload }),
      )
      if (resp?.error) {
        toast.error(t('jobPosition.somethingWrong'))
      } else {
        toast.success(t('jobPosition.successMsg'))

        if (payload.accept) {
          redirectTo('job-offer')
        } else {
          redirectTo('job-offer')
        }
      }
    } catch (error) {
      toast.error(t('jobPosition.somethingWrong'))
    }
  }

  useEffect(() => {
    const fetchCandidate = async () => {
      if (candidateId) {
        dispatch(getCandidateJobPositionDetailsAct(candidateId))
        const { payload } = await dispatch(getCandidateDetailsAct(candidateId))
        if(payload.submittedAttachmentsAt == null){
          history.replace('/main');
        }
      } 
    }
    fetchCandidate()
  }, [candidateId])

  const displayActionButton = () => {
    return (
      <>
        {!settings.isActive('lockPhase1') && jobPosition?.jobTermsAccepted === null && (
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => submitConfirmation({ accept: true })}
            >
              {t('common.accept')}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => submitConfirmation({ accept: false })}
            >
              {t('common.refusal')}
            </button>
          </>
        )}
        {jobPosition?.jobTermsAccepted === true && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => redirectTo('job-offer')}
          >
            {t('job.viewOffer')}
          </button>
        )}
      </>
    )
  }

  const displayAcceptRejectMessage = () => {
    if (jobPosition?.jobTermsAccepted === null)
      return <Notification color="info" message={t('job.infoMessage')} />
    const isAccepted = jobPosition?.jobTermsAccepted === true
    return (
      <Notification
        color={isAccepted ? 'success' : 'error'}
        message={t(`job.${isAccepted ? 'acceptedMessage' : 'refusedMessage'}`)}
      />
    )
  }

  return (
    <div>
      <div className="container job-description">
        {displayAcceptRejectMessage()}

        <div className="job-description-details">
          <div className="job-description-section mb-4">
            <h5 className="ml-2 font-weight-bold"> {t('job.jobLabel')} :</h5>
            <h6 dangerouslySetInnerHTML={{ __html: jobPosition?.title }} />
          </div>
          <div className="job-description-section-col">
            <h5 className="ml-2 font-weight-bold">{t('job.jobDetail')}: </h5>
            <p>
              <div dangerouslySetInnerHTML={{ __html: jobPosition?.terms }} />
            </p>
          </div>
          <div className="job-description-section-col">
            <h5 className="ml-2 font-weight-bold">{t('job.description')}: </h5>
            <div
              dangerouslySetInnerHTML={{ __html: jobPosition?.description }}
            />
          </div>
        </div>
        <div className="job-description-footer">{displayActionButton()}</div>
      </div>
      <OverlayLoader show={candidateState?.loading} />
    </div>
  )
}
