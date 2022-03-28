import React, { useCallback, useEffect, useState, useContext } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import Notification from 'src/components/Notification'
import InputFile from 'src/components/UIKit/InputFile/InputFile'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'
import { SettingsContext } from 'src/contexts/settings'

import useAuth from 'src/hooks/useAuth'
import {
  getCandidateAttachmentsAct,
  getCandidateDetailsAct,
  postCandidateAttachmentsAct,
  postCandidateSubmitAttachmentsAct,
} from 'src/redux/candidates/actions'
import { Storage } from '../../../services/storage'

import './ApplicantDocs.css'

const initialFormFile = {
  'national-id-card': {
    filename: '',
    file: undefined,
  },
  'degree-certificate': {
    filename: '',
    file: undefined,
  },
  'qiyas-score': {
    filename: '',
    file: undefined,
  },
}

export default function ApplicantDocs() {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const { userProfile, loading } = useAuth()
  const { candidateId } = userProfile

  const [formFile, setFormFile] = useState(initialFormFile)
  const [submitStatus, setSubmitStatus] = useState(true)

  const settings = useContext(SettingsContext)

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/tiff',
    'application/pdf',
  ]

  const uploadFilesAreValid = () => {
    const allFilesSelected =
      Object.keys(formFile).filter(
        (key) =>
          formFile[key].id === undefined && formFile[key].file === undefined,
      ).length === 0
    const hasValidFileType =
      Object.keys(formFile).filter(
        (key) =>
          formFile[key].id === undefined &&
          !allowedMimeTypes.includes(formFile[key].file?.type),
      ).length === 0
    return allFilesSelected && hasValidFileType
  }

  const getCandidateAttachments = useCallback(async () => {
    try {
      const { payload } = await dispatch(
        getCandidateAttachmentsAct({ candidateId }),
      )
      setFormFile({ ...formFile, ...payload })
    } catch (error) {
      toast.error(t('applicantDocs.somethingWrong'))
    }
  }, [candidateId])

  // Run effect only if we have the candidateId
  useEffect(() => {
    if (candidateId) getCandidateAttachments()
  }, [candidateId])

  useEffect(() => {
    // TODO: Refactor
    const fetchCandidate = async () => {
      const { candidateId } = await Storage.getItem('userProfile')
      const { payload } = await dispatch(getCandidateDetailsAct(candidateId))
      setSubmitStatus(payload.submittedAttachmentsAt)
      if(payload.submittedInformationAt == null){
        history.replace('/main');
      }
    }
    fetchCandidate()
  }, [])

  const submitConfirmation = () => {
    confirmAlert({
      title: t('applicantDocs.submitConfirmationTitle'),
      message: t('applicantDocs.submitConfirmationMessage'),
      buttons: [
        {
          label: t('common.yes'),
          onClick: handleUploadAttachmentsDocs,
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  const handleUploadAttachmentsDocs = async () => {
    if (!uploadFilesAreValid()) return
    const success = []
    const failures = []
    for (const file in formFile) {
      if (formFile[file].file === undefined) continue
      const selectedFile = formFile[file]
      try {
        const resp = await dispatch(
          postCandidateAttachmentsAct({
            candidateId,
            selectedFile: selectedFile.file,
            attachmentType: selectedFile.type,
          }),
        )
        setFormFile({
          ...formFile,
          [selectedFile.type]: { filename: selectedFile.filename },
        })
        if (resp?.error) {
          failures.push(selectedFile.type)
          setFormFile({
            ...formFile,
            [selectedFile.type]: {},
          })
          return toast.error(t('applicantDocs.somethingWrong', {
            filename: selectedFile.filename,
          }))
        }
        toast.success(
          t('applicantDocs.successMsg', {
            filename: selectedFile.filename,
          }),
        )
        success.push({
          type: selectedFile.type,
          filename: selectedFile.filename,
        })
      } catch (error) {
        toast.error(
          t('applicantDocs.somethingWrong', {
            filename: selectedFile.filename,
          }),
        )
        failures.push(selectedFile.type)
        setFormFile({
          ...formFile,
          [selectedFile.type]: {},
        })
      }
    }
    failures.forEach((type) => {
      formFile[type] = {}
    })
    success.forEach((file) => {
      formFile[file.type] = { filename: file.filename }
    })
    setFormFile(formFile)

    // Check if all files were set before calling the submit-attachments api call
    const filesAlreadyUploaded = Object.keys(formFile).reduce(
      (sum, key) => sum + (formFile[key].id !== undefined ? 1 : 0),
      0,
    )
    const totalFilesNeeded = Object.keys(formFile).length
    if (filesAlreadyUploaded + success.length === totalFilesNeeded) {
      const submitInfo = await dispatch(
        postCandidateSubmitAttachmentsAct(candidateId),
      )
      if (submitInfo?.error) {
        return toast.error(t('applicantDocs.somethingWrong'))
      }
      redirectTo('main')
    }
  }

  const handleInputChange = (file, type) => {
    if (file.size === 0) {
      return toast.error(t('applicantDocs.fileEmptyError', {
        filename: file.name,
      }))
    }
    if (file.size >= 10000000) {
      return toast.error(t('applicantDocs.fileSizeError', {
        filename: file.name,
      }))
    }
    if (!allowedMimeTypes.includes(file.type)) {
      return toast.error(t('applicantDocs.fileTypeError', {
        filename: file.name,
      }))
    }

    setFormFile({
      ...formFile,
      [type]: { filename: file?.name, file: file, type },
    })
  }

  return (
    <div>
      <div className="container applicant-docs">
        {!submitStatus && (
          <Notification color="info" message={t('applicantDocs.infoMessage')} />
        )}
        <div className="applicant-docs-details">
          <div className="container">
            <form className="w-100">
              <div className="form-group row">
                <label htmlFor="id-card" className="col-sm-2 col-form-label">
                  {t('applicantDocs.idCard')}
                </label>
                <div className="col-sm-10">
                  <div className="custom-file">
                    <InputFile
                      onChange={(event) => {
                        handleInputChange(
                          event?.target?.files[0],
                          'national-id-card',
                        )
                      }}
                      value={formFile['national-id-card']?.filename}
                      placeholder={t('applicantDocs.placeholder')}
                      mimeTypes={allowedMimeTypes}
                      readOnly={settings.isActive('lockPhase1') || submitStatus !== null}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="Degree-Certificate"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicantDocs.degree')}
                </label>
                <div className="col-sm-10">
                  <div className="custom-file">
                    <InputFile
                      onChange={(event) => {
                        handleInputChange(
                          event?.target?.files[0],
                          'degree-certificate',
                        )
                      }}
                      value={formFile['degree-certificate']?.filename}
                      placeholder={t('applicantDocs.placeholder')}
                      mimeTypes={allowedMimeTypes}
                      readOnly={settings.isActive('lockPhase1') || submitStatus !== null}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label
                  htmlFor="Qiyas-Score"
                  className="col-sm-2 col-form-label"
                >
                  {t('applicantDocs.measurementResult')}
                </label>
                <div className="col-sm-10">
                  <div className="custom-file">
                    <InputFile
                      onChange={(event) => {
                        handleInputChange(
                          event?.target?.files[0],
                          'qiyas-score',
                        )
                      }}
                      value={formFile['qiyas-score']?.filename}
                      placeholder={t('applicantDocs.placeholder')}
                      mimeTypes={allowedMimeTypes}
                      readOnly={settings.isActive('lockPhase1') || submitStatus !== null}
                    />
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Notification
                  color="info"
                  message={t('applicantDocs.attachmentInformation')}
                  className="m-0"
                />
              </div>
            </form>
          </div>
        </div>
        <div className="applicant-docs-footer">
          {!settings.isActive('lockPhase1') && submitStatus === null && (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!uploadFilesAreValid()}
              onClick={submitConfirmation}
            >
              {t('applicantDocs.saveDocuments')}
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
