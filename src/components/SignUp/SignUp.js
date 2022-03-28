import React, { useState } from 'react'
import './SignUp.css'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { SettingsContext } from 'src/contexts/settings'

import { postApi } from 'src/services/request'
import firebase from 'src/services/firebase'
import APIS from 'src/constants/api'

const UserActivation = () => {
  const [nationalId, setNationalId] = useState('')
  const [password, setPassword] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [recaptchaInit, setRecaptchaInit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const { t } = useTranslation()

  let history = useHistory()

  const settings = useContext(SettingsContext)

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  const configureCaptcha = () => {
    if (recaptchaInit) {
      window.recaptchaVerifier.reset()
      return
    }
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'challenge',
      {
        size: 'invisible',
      },
    )
    window.recaptchaVerifier.render()
    setRecaptchaInit(true)
  }

  const sendOTP = async (event) => {
    event.preventDefault()
    setSubmitLoading(true)
    try {
      configureCaptcha()
      const recaptchaToken = await window.recaptchaVerifier.verify()
      const res = await postApi(`${APIS.authentication.verifyNationalId}`, {
        nationalIdNumber: nationalId,
        recaptchaToken,
      })
      if (res?.status === 200 && res?.data?.success) {
        toast.success(t('common.successMessage'))
        setOtpSent(true)
      }
    } catch (err) {
      if (err?.data?.error?.message === 'You are not allowed to register') {
        toast.error(t('candidateSignUp.notAllowed'))
      } else if (
        err?.data?.error?.message === 'An account has been created already'
      ) {
        toast.error(t('candidateSignUp.userExists'))
      } else toast.error(t('candidateSignUp.somethingWrong'))
    } finally {
      setSubmitLoading(false)
    }
  }

  function validateForm() {
    return password.length > 7
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitLoading(true)
    try {
      const res = await postApi(`${APIS.authentication.candidateSignUp}`, {
        nationalIdNumber: nationalId,
        password: password,
      })
      if (res?.status === 200 && res?.data?.success) {
        redirectTo('')
        toast.success(t('candidateSignUp.successMsg'))
      }
    } catch (err) {
      if (err?.data?.error?.message === 'OTP is not valid') {
        toast.error(t('candidateSignUp.otpInvalid'))
      } else if (
        err?.data?.error?.message === 'An account has been created already'
      ) {
        toast.error(t('candidateSignUp.userExists'))
      } else toast.error(t('candidateSignUp.somethingWrong'))
    }
    setSubmitLoading(false)
  }

  if (loading) return <></>

  if (!otpSent)
    return (
      <>
        <div className="login__form-header">
          <div className="login__logo">
            <h5>{t('candidateSignUp.createAccount')}</h5>
          </div>
        </div>
        <div className="login__form">
          <Form onSubmit={sendOTP}>
            <div id="challenge" />
            <Form.Group size="lg" controlId="otpCode">
              <Form.Label className="label">
                {t('candidateSignUp.nationalId')}
              </Form.Label>
              <Form.Control
                autoFocus
                required
                type="number"
                value={nationalId}
                onChange={(e) => {
                  setNationalId(e.target.value)
                }}
                disabled={settings.isActive('lockPhase1')}
              />
            </Form.Group>
            <Button
              block
              id="send-otp"
              size="lg"
              type="submit"
              disabled={settings.isActive('lockPhase1') || nationalId.length === 0 || submitLoading}
            >
              {t(submitLoading ? 'common.loading' : 'candidateSignUp.verify')}
            </Button>
          </Form>
        </div>
      </>
    )

  return (
    <>
      <div className="login__form-header">
        <div className="login__logo">
          <h5>{t('candidateSignUp.createAccount')}</h5>
        </div>
      </div>
      <div className="login__form">
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="password">
            <Form.Label>
              {t('candidateSignUp.choosePassword')}
              <br />
              <small>{t('candidateSignUp.passwordRequirements')}</small>
            </Form.Label>
            <Form.Control
              required
              type="password"
              value={password}
              minLength={8}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              disabled={settings.isActive('lockPhase1')}
            />
          </Form.Group>
          <Button
            block
            size="lg"
            type="submit"
            disabled={settings.isActive('lockPhase1') || !validateForm() || submitLoading}
          >
            {t(submitLoading ? 'common.loading' : 'candidateSignUp.create')}
          </Button>
        </Form>
      </div>
    </>
  )
}

export default UserActivation
