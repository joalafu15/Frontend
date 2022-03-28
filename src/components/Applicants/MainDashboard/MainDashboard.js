import React, { useEffect } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ContactPhoneIcon from '@material-ui/icons/ContactPhone'
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import TodayIcon from '@material-ui/icons/Today'
import cm from 'classnames'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import StepCard from 'src/components/Applicants/MainDashboard/components/StepCard/StepCard'
import Notification from 'src/components/Notification'
import Tour from 'src/components/Tour/Tour'
import useCandidateInfo from 'src/hooks/useCandidateInfo'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'

import { useSettings } from 'src/contexts/settings'

import 'react-confirm-alert/src/react-confirm-alert.css'
import './MainDashboard.css'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  title: {
    fontFamily: 'Tajawal',
    fontWeight: '400',
    marginRight: '4px',
  },
}))

export default function MainDashboard({ isDisabled }) {
  const classes = useStyles()
  const history = useHistory()
  const { t } = useTranslation()
  const { loading, data } = useCandidateInfo({
    include: ['sector'],
  })
  const settings = useSettings()

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  useEffect(() => {
    if (!!data?.passedInterviewAt && !!data?.contractUrl) {
      redirectTo('applicant-contract')
    }
  }, [data])

  const renderNotificationBanner = () => {
    // Phase locks
    if (settings.isActive('lockPhase1') && !data?.submittedPhaseOneAt) {
      return (
        <Notification
          className="notification-bar"
          color="info"
          message={t('dashboard.phaseOneEnded')}
        />
      )
    }
    if (settings.isActive('lockPhase2') && !data?.submittedPhaseTwoAt) {
      return (
        <Notification
          className="notification-bar"
          color="info"
          message={t('dashboard.phaseTwoEnded')}
        />
      )
    }

    // Phase one related
    if (!data?.submittedPhaseOneAt) {
      return (
        <Notification
          className="notification-bar"
          color="error"
          message={t('dashboard.notSubmittedYet')}
        />
      )
    }
    if (!!data?.submittedPhaseOneAt && !data?.qualifiedSectorId) {
      return (
        <Notification
          className="notification-bar"
          color="info"
          message={t('dashboard.submittedPhaseOne')}
        />
      )
    }

    // Phase two related
    if (!!data?.submittedPhaseOneAt && !data?.submittedInterViewTimeSlotAt) {
      return (
        <Notification
          className="notification-bar"
          color="info"
          message={t('dashboard.qualified', { sector: data?.sector?.name })}
        />
      )
    }
    if (
      !!data?.submittedPhaseOneAt &&
      !!data?.submittedInterViewTimeSlotAt &&
      !data?.submittedPhaseTwoAt
    ) {
      return (
        <Notification
          className="notification-bar"
          color="error"
          message={t('dashboard.notSubmittedYet')}
        />
      )
    }
    if (!!data?.submittedPhaseTwoAt) {
      return (
        <Notification
          className="notification-bar"
          color="success"
          message={t(
            `dashboard.${
              settings.isActive('lockPhase2')
                ? 'phaseTwoEnded'
                : 'submittedPhaseTwo'
            }`,
          )}
        />
      )
    }
  }

  return (
    <div>
      <Grid container spacing={4} className="main-dashboard-header">
        <Grid item xs={12} sm={3}>
          <div className="d-flex flex-column text-right">
            <Typography
              variant="subtitle1"
              display="block"
              className={classes.title}
            >
              {t('dashboard.signInWith')}
            </Typography>
            <Typography
              variant="subtitle1"
              display="block"
              className={classes.title}
            >
              {t('dashboard.name')}: {data?.fullName}
            </Typography>
            <Typography
              variant="subtitle1"
              display="block"
              className={classes.title}
            >
              {t('dashboard.number')}: {data?.nationalIdNumber}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} xl={5}>
          {renderNotificationBanner()}
        </Grid>
      </Grid>
      <Grid container spacing={4} className="phases mb-4">
        <div className="container phase-1">
          <div className="row">
            <StepCard
              data-tut="applicant-data"
              disable={false /* This one will be always enabled */}
              onClick={() => redirectTo('applicant-data')}
              icon={
                <ContactPhoneIcon
                  fontSize="large"
                  style={{
                    color: cm('var(--icons-color)'),
                  }}
                />
              }
              label={t('dashboard.yourData')}
              stepNumber={1}
            />

            <StepCard
              data-tut="applicant-docs"
              disable={!data?.submittedInformationAt}
              onClick={() =>
                data?.submittedInformationAt &&
                redirectTo('applicant-documents')
              }
              icon={
                <DescriptionOutlinedIcon
                  fontSize="large"
                  style={{
                    color: cm(
                      !data?.submittedInformationAt
                        ? 'var(--icons-color-disable)'
                        : 'var(--icons-color)',
                    ),
                  }}
                />
              }
              label={t('dashboard.documents')}
              stepNumber={2}
            />

            <StepCard
              data-tut="job-desc"
              disable={!data?.submittedAttachmentsAt}
              onClick={() =>
                data?.submittedAttachmentsAt && redirectTo('job-description')
              }
              icon={
                <DescriptionOutlinedIcon
                  fontSize="large"
                  style={{
                    color: cm(
                      !data?.submittedAttachmentsAt
                        ? 'var(--icons-color-disable)'
                        : 'var(--icons-color)',
                    ),
                  }}
                />
              }
              label={t('dashboard.jobDescription')}
              stepNumber={3}
            />

            {/* TODO: Get new place for Terms and Conditions if they're being used for real */}
            {/* <div className="col-lg module-box">
              <ListIcon
                fontSize="large"
                style={{ color: 'var(--icons-color)' }}
              />
              <span className="mt-2">{t('dashboard.termsAndConditions')}</span>
            </div> */}
          </div>
        </div>
      </Grid>
      <Grid container spacing={4} className="phases mt-4">
        <div className="container phase-1">
          <div className="row">
            <StepCard
              data-tut="applicant-region"
              disable={!data?.acceptedTermsAt || !data?.acceptedOfferAt}
              onClick={() =>
                data?.acceptedTermsAt &&
                data?.acceptedOfferAt &&
                redirectTo('applicant-region')
              }
              icon={
                <LocationOnIcon
                  fontSize="large"
                  style={{
                    color: cm(
                      !data?.acceptedTermsAt || !data?.acceptedOfferAt
                        ? 'var(--icons-color-disable)'
                        : 'var(--icons-color)',
                    ),
                  }}
                />
              }
              label={t('dashboard.regionSelection')}
              stepNumber={4}
            />

            <StepCard
              disable={
                !data?.submittedPhaseOneAt ||
                data['qualifiedSectorId'] === undefined ||
                data['qualifiedSectorId'] === null
              }
              onClick={() =>
                data?.submittedPhaseOneAt &&
                data['qualifiedSectorId'] !== undefined &&
                data['qualifiedSectorId'] !== null &&
                redirectTo('applicant-interview')
              }
              icon={
                <TodayIcon
                  fontSize="large"
                  style={{
                    color: cm(
                      data?.submittedPhaseOneAt &&
                        data['qualifiedSectorId'] !== undefined &&
                        data['qualifiedSectorId'] !== null
                        ? 'var(--icons-color)'
                        : 'var(--icons-color-disable)',
                    ),
                  }}
                />
              }
              label={t('dashboard.bookInterview')}
              stepNumber={5}
            />

            <StepCard
              disable={!data?.canSelectSchool}
              onClick={() =>
                data?.canSelectSchool && redirectTo('applicant-school')
              }
              icon={
                <MenuBookIcon
                  fontSize="large"
                  style={{
                    color: cm(
                      !data?.canSelectSchool
                        ? 'var(--icons-color-disable)'
                        : 'var(--icons-color)',
                    ),
                  }}
                />
              }
              label={t('dashboard.schoolChoice')}
              stepNumber={6}
            />
          </div>
        </div>
      </Grid>

      <Tour />
      <OverlayLoader show={loading} />
    </div>
  )
}
