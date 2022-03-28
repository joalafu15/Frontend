import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import cm from 'classnames'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    margin: '1rem auto',
  },
  title: {
    fontFamily: 'Tajawal',
    marginRight: '4px',
  },
}))

export default function SimpleAlerts({ color, message, className }) {
  const classes = useStyles()

  return (
    <div className={cm(classes.root, className)}>
      <Alert severity={color}>
        <div className={classes.title}>{message}</div>
      </Alert>
    </div>
  )
}
