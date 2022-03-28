import React from 'react'

import { useHistory } from 'react-router-dom'
import { Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import useAuth from 'src/hooks/useAuth'
import Notification from 'src/components/Notification'
import { actionAllowed } from 'src/utils/authUtils'
import './AdminDashboard.css'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  title: {
    fontFamily: 'Tajawal',
    marginRight: '4px',
  },
}))

export default function AdminDashboard() {
  const { t } = useTranslation()
  const { userProfile, userAcls } = useAuth()
  const history = useHistory()
  const classes = useStyles()

  const redirectTo = (link) => history.push(`/${link}`)
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
              {t('adminDashboard.name')} : {userProfile?.name}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={6} xl={5}>
          <Notification
            color="error"
            message={t('adminDashboard.infoMessage')}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} className="admin-actions">
        <div className="w-75 container d-flex align-items-center justify-content-center flex-column">
          <div className="row w-100">
            <div className="col-lg module-box">
              <h4>23736</h4>
              <h6>{t('adminDashboard.totalRegistered')}</h6>
            </div>
            <div className="col-lg module-box">
              <h4>2119</h4>
              <h6>{t('adminDashboard.totalQualified')}</h6>
            </div>
            <div className="col-lg module-box">
              <h4>1613</h4>
              <h6>{t('adminDashboard.bookedInterviews')}</h6>
            </div>
          </div>
          <div className="row w-100">
            <div className="col-lg module-box">
              <h4>1540</h4>
              <h6>{t('adminDashboard.signedContracts')}</h6>
            </div>
            <div className="col-lg module-box">
              <h4>53</h4>
              <h6>{t('adminDashboard.totalQualifiers')}</h6>
            </div>
            <div className="col-lg module-box">
              <h4>0</h4>
              <h6>{t('adminDashboard.entrants')}</h6>
            </div>
          </div>
          <div className="row w-100">
            {actionAllowed('manage_job_positions', userAcls) && (
              <div
                className="col-lg module-box box-btn"
                onClick={() => redirectTo('admin/job-positions')}
              >
                <h6 className="mb-0">
                  {t('adminDashboard.manageJobPositions')}
                </h6>
              </div>
            )}
            {actionAllowed('manage_all_applicants', userAcls) && (
              <div
                className="col-lg module-box box-btn"
                onClick={() => redirectTo('admin/candidates')}
              >
                <h6 className="mb-0">
                  {t('adminDashboard.manageAllApplicants')}
                </h6>
              </div>
            )}
            {actionAllowed('system_configuration', userAcls) && (
              <div
                className="col-lg module-box box-btn"
                onClick={() => redirectTo('admin/system-management')}
              >
                <h6 className="mb-0">
                  {t('adminDashboard.systemConfigurations')}
                </h6>
              </div>
            )}
            {/* TODO: Implement later */}
            {/* <div
              className="col-lg module-box box-btn"
              onClick={() => redirectTo('admin/qualification-stages')}
            >
              <h6 className="mb-0">
                {t('adminDashboard.manageDifferentStages')}
              </h6>
            </div> */}
          </div>
        </div>
      </Grid>
    </div>
  )
}
