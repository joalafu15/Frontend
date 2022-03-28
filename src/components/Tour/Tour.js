import React, { useCallback, useEffect, useState } from 'react'
import Tour from 'reactour'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import styled from 'styled-components'

import { dismissTourAct, getTourHistoryAct } from 'src/redux/tour/actions'

const TourWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const UserTour = () => {
  const [isTourOpen, setOpenTour] = useState(false)
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const dispatch = useDispatch()
  const { step: { lastStep = 0, dismissed = false } = {} } = useSelector(
    (state) => state.tour,
  )

  const openTour = () => {
    return setOpenTour(true)
  }

  const closeTour = () => {
    return setOpenTour(false)
  }

  const handleDismiss = async () => {
    const newUserTourStep = {
      lastStep: currentStep,
      dismissed: true,
    }
    await dispatch(dismissTourAct(newUserTourStep))
    closeTour()
  }

  const handleGetTourHistory = useCallback(async () => {
    await dispatch(getTourHistoryAct())
  }, [])

  useEffect(() => {
    handleGetTourHistory()

    if (!dismissed) {
      setCurrentStep(lastStep)
      openTour()
    } else {
      setCurrentStep(lastStep)
      closeTour()
    }
  }, [dismissed, handleGetTourHistory, lastStep])

  const stepsTourConfig = [
    {
      content: () => (
        <TourWrapper>
          <div
            style={{
              marginBottom: '10px',
            }}
          >
            {t('tour.introductionStep')}
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={handleDismiss}
            style={{
              alignSelf: 'flex-end',
            }}
          >
            {t('tour.dismissTour')}
          </Button>
        </TourWrapper>
      ),
    },
    {
      selector: '[data-tut="applicant-data"]',
      content: () => (
        <TourWrapper>
          <div
            style={{
              marginBottom: '10px',
            }}
          >
            {t('tour.applicantData')}
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={handleDismiss}
            style={{
              alignSelf: 'flex-end',
            }}
          >
            {t('tour.dismissTour')}
          </Button>
        </TourWrapper>
      ),
    },
    {
      selector: '[data-tut="applicant-docs"]',
      content: () => (
        <TourWrapper>
          <div
            style={{
              marginBottom: '10px',
            }}
          >
            {t('tour.applicantDocs')}
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={handleDismiss}
            style={{
              alignSelf: 'flex-end',
            }}
          >
            {t('tour.dismissTour')}
          </Button>
        </TourWrapper>
      ),
    },
    {
      selector: '[data-tut="job-desc"]',
      content: () => (
        <TourWrapper>
          <div
            style={{
              marginBottom: '10px',
            }}
          >
            {t('tour.jobDesc')}
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={handleDismiss}
            style={{
              alignSelf: 'flex-end',
            }}
          >
            {t('tour.dismissTour')}
          </Button>
        </TourWrapper>
      ),
    },
    {
      selector: '[data-tut="applicant-region"]',
      content: () => (
        <TourWrapper>
          <div
            style={{
              marginBottom: '10px',
            }}
          >
            {t('tour.applicantRegion')}
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={handleDismiss}
            style={{
              alignSelf: 'flex-end',
            }}
          >
            {t('tour.dismissTour')}
          </Button>
        </TourWrapper>
      ),
    },
  ]

  return (
    <Tour
      steps={stepsTourConfig}
      rounded={5}
      isOpen={isTourOpen}
      onRequestClose={closeTour}
      closeWithMask={false}
      getCurrentStep={(current) => setCurrentStep(current)}
      goToStep={currentStep}
      onBeforeClose={handleDismiss}
      nextButton={<b>{t('tour.next')}</b>}
      prevButton={<b>{t('tour.previous')}</b>}
      lastStepNextButton={
        <Button
          variant="primary"
          size="sm"
          onClick={handleDismiss}
          style={{
            alignSelf: 'flex-end',
          }}
        >
          {t('tour.lastStep')}
        </Button>
      }
    />
  )
}

export default UserTour
