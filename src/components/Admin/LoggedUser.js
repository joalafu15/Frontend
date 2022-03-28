import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Notification from '../Notification'
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

export default function LoggedUser() {
  const { t } = useTranslation()

  const classes = useStyles()

  return (
    <Grid container spacing={4} className='main-dashboard-header'>
      <Grid item xs={12} sm={3}>
        <div className='d-flex flex-column text-right'>
          <Typography
            variant='subtitle1'
            display='block'
            className={classes.title}
          >
            {t('dashboard.signInWith')}
          </Typography>
          <Typography
            variant='subtitle1'
            display='block'
            className={classes.title}
          >
            {t('adminDashboard.name')}
          </Typography>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} xl={5}>
        <Notification color='error' message={t('adminDashboard.infoMessage')} />
      </Grid>
    </Grid>
  )
}
