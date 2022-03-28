import React, { useCallback, useEffect, useState, useContext } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import Notification from 'src/components/Notification'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'
import Select from 'src/components/UIKit/Select/Select'
import useAuth from 'src/hooks/useAuth'
import { Storage } from '../../../services/storage'

import {SettingsContext} from 'src/contexts/settings'

import {
  getCandidateDetailsAct,
  getCandidateSectorsAct,
  postCandidateSectorsAct,
} from 'src/redux/candidates/actions'
import { getCandidateAvailableSectors } from 'src/services/candidatesSvc'
// import { getSectorList } from 'src/services/sectorsSvc'

import './ApplicantRegion.css'

const initialForm = {
  1: { choice: 1, sectorId: null },
  2: { choice: 2, sectorId: null },
  3: { choice: 3, sectorId: null },
  4: { choice: 4, sectorId: null },
  5: { choice: 5, sectorId: null },
  6: { choice: 6, sectorId: null },
  7: { choice: 7, sectorId: null },
  8: { choice: 8, sectorId: null },
  9: { choice: 9, sectorId: null },
  10: { choice: 10, sectorId: null },
}

export default function ApplicantRegion() {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const [form, setForm] = useState(initialForm)
  const [options, setOption] = useState([])
  const { userProfile, loading } = useAuth()
  const [submitStatus, setSubmitStatus] = useState(true)

  const settings = useContext(SettingsContext);

  const { candidateId } = userProfile

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  const handleGetOptions = useCallback(async () => {
    /**
     * The following section is a workaround requested by Saad.
     *
     * This will be removed and migrated to its own table for versatility,
     * but at a later moment.
     */
    // TODO: Remove this workaround and its imports
    const { candidateId } = await Storage.getItem('userProfile')
    const resp = await getCandidateAvailableSectors(candidateId)
    // End of workaround section

    // const resp = await getSectorList()
    const opts = resp?.data?.map((it) => ({
      value: it.id,
      label: it.name,
    }))

    setOption(opts)
  }, [])

  const handleGetCandidateSectors = useCallback(async () => {
    const { payload } = await dispatch(getCandidateSectorsAct(candidateId))
    setForm({ ...form, ...payload })
  }, [candidateId])

  const handleInputChange = (value) => {
    setForm({ ...form, [value.choice]: value })
  }

  const isValidateForm = () => {
    const formFilled = Object.keys(form).filter(
      (k) => form[k].sectorId !== null,
    )
    return formFilled.length > 0
  }

  const submitConfirmation = () => {
    confirmAlert({
      title: t('applicantRegion.submitConfirmationTitle'),
      message: t('applicantRegion.submitConfirmationMessage'),
      buttons: [
        {
          label: t('common.yes'),
          onClick: handleAddCandidateSectors,
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  const handleAddCandidateSectors = async () => {
    try {
      const payload = []

      Object.keys(form).map((it) => {
        if (form[it].sectorId === null) {
          delete form[it]
        } else {
          payload.push({
            choice: form[it].choice,
            sectorId: form[it].sectorId,
          })
        }
      })

      const resp = await dispatch(
        postCandidateSectorsAct({ candidateId, payload }),
      )
      if (resp?.error) {
        return toast.error(t('applicantRegion.somethingWrong'))
      }
      redirectTo('main')
      return toast.success(t('applicantRegion.successMsg'))
    } catch (error) {
      toast.error(t('applicantRegion.somethingWrong'))
    }
  }

  const getDefaultValue = (formVal) => {
    const label =
      options.filter((it) => it.value === formVal.sectorId).length > 0
        ? options.filter((it) => it.value === formVal.sectorId)[0].label
        : null
    const defValue = {
      value: formVal.sectorId,
      label: label,
    }

    return defValue
  }

  const getMapSelectorOptions = () => {
    return options?.map((it) => {
      const isDisabled = Object.keys(form)
        .map((key) => form[key].sectorId === it.value)
        .includes(true)
      return {
        value: it.value,
        label: it.label,
        isDisabled,
      }
    })
  }

  useEffect(() => {
    // TODO: Refactor
    const fetchCandidate = async () => {
      const { candidateId } = await Storage.getItem('userProfile')
      const { payload } = await dispatch(getCandidateDetailsAct(candidateId))
      setSubmitStatus(payload.submittedSectorPreferencesAt)
      if(payload.acceptedTermsAt == null || payload.acceptedOfferAt == null){
        history.replace('/main');
      }
    }
    fetchCandidate()
  }, [])

  useEffect(() => {
    handleGetOptions()
  }, [])

  // Run effect only if we have the candidateId
  useEffect(() => {
    if (candidateId) handleGetCandidateSectors()
  }, [candidateId])

  return (
    <div>
      <div className="container applicant-region">
        {!submitStatus && (
          <Notification color="info" message={t('applicantRegion.infoMessage')} />
        )}
        <div className="applicant-region-details">
          <div className="container">
            <form className="w-100">
              <div className="form-group row">
                <label
                  htmlFor="firstChoice"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicantRegion.firstChoice')}
                </label>
                <div className="col-sm-10">
                  <Select
                    id="firstChoice"
                    placeholder={t('common.pleaseChoose')}
                    options={getMapSelectorOptions()}
                    defaultValue={getDefaultValue(form[1])}
                    isDisabled={settings.isActive('lockPhase1') || submitStatus !== null}
                    value={getDefaultValue(form[1])}
                    onChange={(val) =>
                      handleInputChange({ choice: 1, sectorId: val.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="secondChoice"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicantRegion.secondChoice')}
                </label>
                <div className="col-sm-10">
                  <Select
                    id="secondChoice"
                    placeholder={t('common.pleaseChoose')}
                    isDisabled={settings.isActive('lockPhase1') || submitStatus !== null || !form[1].sectorId}
                    defaultValue={getDefaultValue(form[2])}
                    value={getDefaultValue(form[2])}
                    options={getMapSelectorOptions()}
                    onChange={(val) =>
                      handleInputChange({ choice: 2, sectorId: val.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="thirdChoice"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicantRegion.thirdChoice')}
                </label>
                <div className="col-sm-10">
                  <Select
                    id="thirdChoice"
                    placeholder={t('common.pleaseChoose')}
                    isDisabled={settings.isActive('lockPhase1') || submitStatus !== null || !form[2].sectorId}
                    options={getMapSelectorOptions()}
                    defaultValue={getDefaultValue(form[3])}
                    value={getDefaultValue(form[3])}
                    onChange={(val) =>
                      handleInputChange({ choice: 3, sectorId: val.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="fourthChoice"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicantRegion.fourthChoice')}
                </label>
                <div className="col-sm-10">
                  <Select
                    id="fourthChoice"
                    placeholder={t('common.pleaseChoose')}
                    isDisabled={settings.isActive('lockPhase1') || submitStatus !== null || !form[3].sectorId}
                    defaultValue={getDefaultValue(form[4])}
                    value={getDefaultValue(form[4])}
                    options={getMapSelectorOptions()}
                    onChange={(val) =>
                      handleInputChange({ choice: 4, sectorId: val.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="fifthChoice"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicantRegion.fifthChoice')}
                </label>
                <div className="col-sm-10">
                  <Select
                    id="fifthChoice"
                    placeholder={t('common.pleaseChoose')}
                    isDisabled={settings.isActive('lockPhase1') || submitStatus !== null || !form[4].sectorId}
                    options={getMapSelectorOptions()}
                    defaultValue={getDefaultValue(form[5])}
                    value={getDefaultValue(form[5])}
                    onChange={(val) =>
                      handleInputChange({ choice: 5, sectorId: val.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="sixthChoice"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicantRegion.sixthChoice')}
                </label>
                <div className="col-sm-10">
                  <Select
                    id="sixthChoice"
                    placeholder={t('common.pleaseChoose')}
                    isDisabled={settings.isActive('lockPhase1') || submitStatus !== null || !form[5].sectorId}
                    options={getMapSelectorOptions()}
                    defaultValue={getDefaultValue(form[6])}
                    value={getDefaultValue(form[6])}
                    onChange={(val) =>
                      handleInputChange({ choice: 6, sectorId: val.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="seventhChoice"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicantRegion.seventhChoice')}
                </label>
                <div className="col-sm-10">
                  <Select
                    id="seventhChoice"
                    placeholder={t('common.pleaseChoose')}
                    isDisabled={settings.isActive('lockPhase1') || submitStatus !== null || !form[6].sectorId}
                    options={getMapSelectorOptions()}
                    defaultValue={getDefaultValue(form[7])}
                    value={getDefaultValue(form[7])}
                    onChange={(val) =>
                      handleInputChange({ choice: 7, sectorId: val.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="eigthChoice"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicantRegion.eigthChoice')}
                </label>
                <div className="col-sm-10">
                  <Select
                    id="eigthChoice"
                    placeholder={t('common.pleaseChoose')}
                    isDisabled={settings.isActive('lockPhase1') || submitStatus !== null || !form[7].sectorId}
                    options={getMapSelectorOptions()}
                    defaultValue={getDefaultValue(form[8])}
                    value={getDefaultValue(form[8])}
                    onChange={(val) =>
                      handleInputChange({ choice: 8, sectorId: val.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="ninthChoice"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicantRegion.ninthChoice')}
                </label>
                <div className="col-sm-10">
                  <Select
                    id="ninthChoice"
                    placeholder={t('common.pleaseChoose')}
                    isDisabled={settings.isActive('lockPhase1') || submitStatus !== null || !form[8].sectorId}
                    options={getMapSelectorOptions()}
                    defaultValue={getDefaultValue(form[9])}
                    value={getDefaultValue(form[9])}
                    onChange={(val) =>
                      handleInputChange({ choice: 9, sectorId: val.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="tenthChoice"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicantRegion.tenthChoice')}
                </label>
                <div className="col-sm-10">
                  <Select
                    id="tenthChoice"
                    placeholder={t('common.pleaseChoose')}
                    isDisabled={settings.isActive('lockPhase1') || submitStatus !== null || !form[9].sectorId}
                    options={getMapSelectorOptions()}
                    defaultValue={getDefaultValue(form[10])}
                    value={getDefaultValue(form[10])}
                    onChange={(val) =>
                      handleInputChange({ choice: 10, sectorId: val.value })
                    }
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="applicant-region-footer">
          {!settings.isActive('lockPhase1') && submitStatus === null && (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!isValidateForm()}
              onClick={submitConfirmation}
            >
              {t('applicantRegion.send')}
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => redirectTo('main')}
          >
            {t('applicantDocs.back')}
          </button>
        </div>
      </div>
      <OverlayLoader show={loading} />
    </div>
  )
}
