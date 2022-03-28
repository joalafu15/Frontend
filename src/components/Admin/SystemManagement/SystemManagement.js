import './SystemManagement.css'

import { Grid, Typography } from '@material-ui/core'

import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined'
import GroupIcon from '@material-ui/icons/Group'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import MessageOutlinedIcon from '@material-ui/icons/MessageOutlined'
import Notification from '../../Notification'
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive'
import React from 'react'
import SettingIcon from '@material-ui/icons/Settings'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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

export default function SystemManagement() {
  const { t } = useTranslation()
  const classes = useStyles()
  const { push } = useHistory()
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
              {t('adminDashboard.name')}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={7}>
          <Notification
            color="error"
            message={t('adminDashboard.infoMessage')}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} className="admin-actions">
        <div className="w-75 container d-flex align-items-center justify-content-center flex-column">
          <div className="row w-100">
            <div
              className="col-lg module-box"
              onClick={() => push('/admin/users')}
            >
              <GroupIcon />
              <h6>{t('systemManagement.userManagement')}</h6>
            </div>
            <div className="col-lg module-box"
              onClick={() => push('/admin/settings')}
            >
              <SettingIcon />
              <h6>{t('systemManagement.settings')}</h6>
            </div>
            <div className="col-lg module-box">
              <NotificationsActiveIcon />
              <h6>{t('systemManagement.manageNotifications')}</h6>
            </div>
          </div>
          <div className="row w-100">
            <div className="col-lg module-box">
              <MailOutlineIcon />
              <h6>{t('systemManagement.mailSettings')}</h6>
            </div>
            <div className="col-lg module-box">
              <MessageOutlinedIcon />
              <h6>{t('systemManagement.messageManagement')}</h6>
            </div>
            <div className="col-lg module-box">
              <AssessmentOutlinedIcon />
              <h6>{t('systemManagement.reports')}</h6>
            </div>
          </div>
        </div>
      </Grid>
    </div>
  )
}
