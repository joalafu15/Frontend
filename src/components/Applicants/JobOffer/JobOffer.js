import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import Notification from 'src/components/Notification'
import useAuth from 'src/hooks/useAuth'
import { SettingsContext } from 'src/contexts/settings'

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import {
  postCandidateAcceptRejectOfferAct,
  getCandidateJobPositionDetailsAct,
  getCandidateDetailsAct
} from 'src/redux/candidates/actions'
import { selectCandidatesState } from 'src/redux/candidates/selectors'

import './JobOffer.css'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'

export default function JobOffer() {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const { jobPosition, loading } = useSelector(selectCandidatesState)
  const { userProfile } = useAuth()
  const { candidateId } = userProfile

  const settings = useContext(SettingsContext)

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  const submitConfirmation = (payload) => {
    confirmAlert({
      title: t('jobOffer.submitConfirmationTitle'),
      message: t(
        `jobOffer.submit${payload.accept ? 'Accept' : 'Reject'}Message`,
      ),
      buttons: [
        {
          label: t('common.yes'),
          onClick: () => handleAcceptRejectJobOffer(payload),
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  const handleAcceptRejectJobOffer = async (payload) => {
    try {
      const resp = await dispatch(
        postCandidateAcceptRejectOfferAct({ candidateId, payload }),
      )
      if (resp?.meta?.requestStatus === 'fulfilled') {
        if (resp?.meta?.arg?.payload?.accept) {
          toast.success(t('jobOffer.acceptSuccessMsg'))
        } else {
          toast.success(t('jobOffer.refuseSuccessMsg'))
        }
        redirectTo('main')
      } else if (resp?.meta?.requestStatus === 'rejected') {
        toast.error(t('jobOffer.somethingWrong'))
      }
    } catch (error) {
      toast.error(t('jobOffer.somethingWrong'))
    }
  }

  useEffect(() => {
    const fetchCandidate = async () => {
      if (candidateId) {
        dispatch(getCandidateJobPositionDetailsAct(candidateId))
        const { payload } = await dispatch(getCandidateDetailsAct(candidateId))
        if(payload.acceptedTermsAt == null){
          history.replace('/main');
        }
      } 
    }
    fetchCandidate()
  }, [candidateId])

  const displayActionButton = () => {
    return (
      !settings.isActive('lockPhase1') && jobPosition?.jobOfferAccepted === null && (
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
      )
    )
  }

  const displayAcceptRejectMessage = () => {
    if (jobPosition?.jobOfferAccepted === null)
      return <Notification color="info" message={t('jobOffer.infoMessage')} />
    const isAccepted = jobPosition?.jobOfferAccepted === true
    return (
      <Notification
        color={isAccepted ? 'success' : 'error'}
        message={t(
          `jobOffer.${isAccepted ? 'acceptedMessage' : 'refusedMessage'}`,
        )}
      />
    )
  }

  return (
    <div>
      <div className="container job-offer">
        {displayAcceptRejectMessage()}

        <div className="job-offer-details">
          <div className="container">
            <h5
              className="font-weight-bold"
              dangerouslySetInnerHTML={{ __html: jobPosition?.title }}
            />
            <h6
              dangerouslySetInnerHTML={{
                __html: jobPosition?.salaryDescription,
              }}
            />
            <hr />

            <div className="row mb-3">
              <div className="col-sm-3 font-weight-bold">
                {t('jobOffer.contractDuration')}
              </div>
              <div
                className="col-sm-9 px-4"
                dangerouslySetInnerHTML={{
                  __html: jobPosition?.contractDuration,
                }}
              />
            </div>
            <div className="row mb-3">
              <div className="col-sm-3 font-weight-bold">
                {t('jobOffer.expectedJoiningDate')}
              </div>
              <div
                className="col-sm-9 px-4"
                dangerouslySetInnerHTML={{
                  __html: jobPosition?.expectedJoiningDate,
                }}
              />
            </div>
            <div className="row mb-3">
              <div className="col-sm-3 font-weight-bold">
                {t('jobOffer.basicSalary')}
              </div>
              <div className="col-sm-9 px-4">
                {jobPosition?.basicSalary ?? '---'} ريال
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-3 font-weight-bold">
                {t('jobOffer.housingAllowance')}
              </div>
              <div className="col-sm-9 px-4">
                {jobPosition?.housing ?? '---'} ريال
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-3 font-weight-bold">
                {t('jobOffer.transportAllowance')}
              </div>
              <div className="col-sm-9 px-4">
                {jobPosition?.transportation ?? '---'} ريال
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-3 font-weight-bold">
                {t('jobOffer.salary')}
              </div>
              <div className="col-sm-9 px-4">
                {jobPosition?.totalSalary ?? '---'} ريال
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-3 font-weight-bold">
                {t('jobOffer.socialSecurity')}
              </div>
              <div className="col-sm-9 px-4">
                {jobPosition?.gosi ?? '---'} ريال
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-3 font-weight-bold">
                {t('jobOffer.netSalary')}
              </div>
              <div className="col-sm-9 px-4">
                {jobPosition?.netSalary ?? '---'} ريال
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-3 font-weight-bold">
                {t('jobOffer.vacationDays')}
              </div>
              <div
                className="col-sm-9 px-4"
                dangerouslySetInnerHTML={{ __html: jobPosition?.vacationDays }}
              />
            </div>
            <div className="row mb-3">
              <div className="col-sm-3 font-weight-bold">
                {t('jobOffer.medicalInsurance')}
              </div>
              <div
                className="col-sm-9 px-4"
                dangerouslySetInnerHTML={{
                  __html: jobPosition?.medicalInsurance,
                }}
              />
            </div>
            <div className="row mb-3">
              <div className="col-sm-3 font-weight-bold">
                {t('jobOffer.contractPeriod')}
              </div>
              <div
                className="col-sm-9 px-4"
                dangerouslySetInnerHTML={{
                  __html: jobPosition?.contractPeriod,
                }}
              />
            </div>
            <div className="row mb-3">
              <div
                className="col-sm-12"
                dangerouslySetInnerHTML={{ __html: jobPosition?.salaryNotice }}
              />
            </div>
            <hr />
            <h6
              dangerouslySetInnerHTML={{ __html: jobPosition?.offerNotice }}
            />
          </div>
        </div>
        <div className="job-offer-footer">{displayActionButton()}</div>
      </div>
      <OverlayLoader show={loading} />
    </div>
  )
}
