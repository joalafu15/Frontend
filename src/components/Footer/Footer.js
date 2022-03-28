import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PrivayPolicyDailog from './PrivacyPolicyDailog'
import { i18 } from 'src/i18n'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

const Footer = () => {
  const { t } = useTranslation()
  const [openPrivacyDailog, setOpenPrivacyDailog] = useState(false)

  const handlePrivacyDailogClose = () => {
    setOpenPrivacyDailog(false)
  }

  const changeLanguage = (language) => {
    i18.changeLanguage(language)
  }

  return (
    <div className="app-footer">
      <div>
        <button
          className="privacy-policy"
          onClick={() => setOpenPrivacyDailog(true)}
        >
          {t('copyright.privacyPolicy')}
        </button>
        <PrivayPolicyDailog
          open={openPrivacyDailog}
          handleClose={handlePrivacyDailogClose}
        />
      </div>
      <div>
        <span>{t('common.language')}</span>&nbsp;
        <Select
          value={i18.language}
          onChange={(event) => changeLanguage(event.target.value)}
        >
          <MenuItem value={'en'}>English</MenuItem>
          <MenuItem value={'ar'}>عربى</MenuItem>
        </Select>
      </div>
      <div className="support">
        {t('common.support')}
        &nbsp;
        <a href="tel:920033247">920033247</a>
      </div>
      <div className="powered">
        <a href="https://cloudtoday.com" target="_blank" rel="noreferrer">
          {t('copyright.poweredByCloudtoday')}
        </a>
      </div>
    </div>
  )
}

export default Footer
