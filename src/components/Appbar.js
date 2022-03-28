import React from 'react'
import { useDispatch } from 'react-redux'
import { fade, makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import Badge from '@material-ui/core/Badge'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MailIcon from '@material-ui/icons/Mail'
import NotificationsIcon from '@material-ui/icons/Notifications'
import MoreIcon from '@material-ui/icons/MoreVert'
import logo from '../img/logo.svg'
import albiladLogo from '../img/albilad-logo.png'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import get from 'lodash/get'

import useAuth from 'src/hooks/useAuth'
import withPrivateLayout from 'src/hocs/withPrivateLayout'
import { openTourAct } from 'src/redux/tour/actions'
import { Storage } from 'src/services/storage'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    marginBottom: '20px',
  },
  menuButton: {
    marginLeft: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      fontFamily: 'Tajawal',
      fontWeight: '800',
      cursor: 'pointer',
    },
  },
  cursorPointer: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    left: '0',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    borderRadius: '6px',
    background: '#F5F6F8',
    padding: theme.spacing(1.5),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },

  p: {
    fontFamily: 'Tajawal',
  },
}))

const PrimarySearchAppBar = () => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
  const { logout, userProfile } = useAuth()
  const dispatch = useDispatch()

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const { t } = useTranslation()

  const history = useHistory()

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  const handleOpenTour = () => {
    if (history.location.pathname !== '/main') redirectTo('main')
    const userTour = localStorage.getItem('userTour')
    dispatch(openTourAct({ ...JSON.parse(userTour), dismissed: false }))
    handleMenuClose()
  }

  const handleLogTitleClick = () => {
    const {
      location: { pathname },
    } = history

    if (
      get(userProfile, 'roles', []).includes('candidate') &&
      pathname !== '/main'
    ) {
      return redirectTo('main')
    } else if (
      get(userProfile, 'roles', []).includes('admin') &&
      pathname !== '/admin'
    ) {
      return redirectTo('admin')
    } else if (
      (
        get(userProfile, 'roles', []).includes('operations') ||
        get(userProfile, 'roles', []).includes('committee')
      ) &&
      pathname !== '/admin/candidates'
    ) {
      return redirectTo('admin/candidates')
    }

    return null
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* <MenuItem style={{ fontFamily: 'Tajawal' }} onClick={handleMenuClose}>
        {t('header.settings')}
      </MenuItem> */}

      {userProfile && Object.keys(userProfile).length > 0 ? (
        ((
          <MenuItem style={{ fontFamily: 'Tajawal' }} onClick={handleOpenTour}>
            {t('header.help')}
          </MenuItem>
        ),
        (
          <MenuItem style={{ fontFamily: 'Tajawal' }} onClick={logout}>
            {t('header.logout')}
          </MenuItem>
        ))
      ) : (
        <MenuItem
          style={{ fontFamily: 'Tajawal' }}
          onClick={() => history.push('')}
        >
          {t('header.login')}
        </MenuItem>
      )}
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* TODO: Implement this */}
      {/* <MenuItem>
        <IconButton aria-label="show 4 new mails" color="grey">
          <Badge badgeContent={4} color="grey">
            <MailIcon />
          </Badge>
        </IconButton>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="grey">
          <Badge badgeContent={17} color="grey">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </MenuItem> */}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p style={{ fontFamily: 'Tajawal' }}></p>
      </MenuItem>
    </Menu>
  )

  return (
    <div className={classes.grow}>
      <AppBar
        position="static"
        elevation={0}
        style={{ background: '#ffffff', color: '#8D99A6', padding: '10px' }}
      >
        <Toolbar>
          <img
            className={classes.cursorPointer}
            src={logo}
            width="64"
            height="64"
            alt="logo"
            onClick={() => handleLogTitleClick()}
          />
          <Typography
            className={classes.title}
            variant="h6"
            noWrap
            onClick={() => handleLogTitleClick()}
          >
            {t('common.appname')}
          </Typography>

          <div className={classes.grow} />

          <img
            className="albilad-logo"
            src={albiladLogo}
            height="64"
            alt={t('copyright.albilad')}
            onClick={() => handleLogTitleClick()}
          />

          <div className={classes.sectionDesktop}>
            {/* TODO: Implement this */}
            {/* <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="primary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  )
}

export default withPrivateLayout(PrimarySearchAppBar)
