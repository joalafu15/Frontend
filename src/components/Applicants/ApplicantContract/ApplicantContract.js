import React, { useCallback, useEffect, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

import Notification from 'src/components/Notification'
import InputFile from 'src/components/UIKit/InputFile/InputFile'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'
import useAuth from 'src/hooks/useAuth'
import useCandidateInfo from 'src/hooks/useCandidateInfo'
import { transformArrayToObject } from 'src/utils/arrayUtils'

import { postCandidateAttachmentsAct } from 'src/redux/candidates/actions'
import { getCandidateOnboardingInstructionsAct } from 'src/redux/candidates/actions'

import './ApplicantContract.css'

const initialFormFile = {
  contract: {
    filename: '',
    file: undefined,
  },
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/tiff',
  'application/pdf',
  'application/zip',
  'application/vnd.rar',
  'application/x-7z-compressed',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export default function ApplicantContract() {
  const { t } = useTranslation()
  const { push, replace } = useHistory()
  const dispatch = useDispatch()
  const { userProfile, loading } = useAuth()
  const [formFile, setFormFile] = useState(initialFormFile)
  const [submitStatus, setSubmitStatus] = useState(false)
  const [onboardingInstructions, setOnboardingInstructions] = useState(null)

  const { data: candidateData } = useCandidateInfo({
    include: [{ relation: 'attachments' }],
  })

  const { candidateId } = userProfile

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
          !ALLOWED_MIME_TYPES.includes(formFile[key].file?.type),
      ).length === 0
    return allFilesSelected && hasValidFileType
  }

  useEffect(async () => {
    if (
      !candidateData?.passedInterviewAt ||
      !candidateData?.contractUrl
    ) {
      replace('/main')
    }

    if (!!candidateData?.attachments) {
      const transformedAttachment = transformArrayToObject(
        candidateData?.attachments.filter((it) => it?.type === 'contract'),
        'type',
      )

      setFormFile({ ...formFile, ...transformedAttachment })
    }

    if (candidateData.contractValidated === true) {
      const { payload } = await dispatch(getCandidateOnboardingInstructionsAct(candidateData.id))
      if (payload?.value) {
        setOnboardingInstructions(payload.value)
      }
    }
  }, [
    candidateData?.submittedSchoolPreferenceAt,
    candidateData?.contractUrl,
    candidateData?.attachments,
  ])

  const submitConfirmation = () => {
    confirmAlert({
      title: t('applicantContract.submitConfirmationTitle'),
      message: t('applicantContract.submitConfirmationMessage'),
      buttons: [
        {
          label: t('common.yes'),
          onClick: handleUploadAssignedContract,
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  const handleUploadAssignedContract = async () => {
    if (!uploadFilesAreValid()) return null
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
          return toast.error(
            t('applicantContract.somethingWrong', {
              filename: selectedFile.filename,
            }),
          )
        }
        toast.success(
          t('applicantContract.successMsg', {
            filename: selectedFile.filename,
          }),
        )
        success.push({
          type: selectedFile.type,
          filename: selectedFile.filename,
        })
        setSubmitStatus(true)
      } catch (error) {
        toast.error(
          t('applicantContract.somethingWrong', {
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
  }

  const handleInputChange = (file, type) => {
    if (file.size === 0) {
      return toast.error(
        t('applicantContract.fileEmptyError', {
          filename: file.name,
        }),
      )
    }

    if (file.size >= 10000000) {
      return toast.error(
        t('applicantContract.fileSizeError', {
          filename: file.name,
        }),
      )
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return toast.error(
        t('applicantContract.fileTypeError', {
          filename: file.name,
        }),
      )
    }

    setFormFile({
      ...formFile,
      [type]: { filename: file?.name, file: file, type },
    })
  }

  const handleDownloadContract = async () => {
    const a = document.createElement('a')
    a.href = candidateData?.contractUrl
    a.target = '_blank'
    a.click()
  }

  if (onboardingInstructions) {
    return (
      <div>
        <div className="container onboarding-instructions">
          <div dangerouslySetInnerHTML={{ __html: onboardingInstructions }} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="container applicant-contract">
        {candidateData?.contractValidated === false ? (
          <Notification
            color="error"
            message={t('applicantContract.contractNotValidated')}
          />
        ) : (
          <Notification
            color="success"
            message={t('applicantContract.congratulationsMessage')}
          />
        )}

        <div className="applicant-contract-details">
          <div className="container">
            <div className="text-center">
              <p>
                {t('applicantContract.infoMessage')}
              </p>
              <button
                type="button"
                className="btn btn-primary px-4 py-3"
                onClick={handleDownloadContract}
              >
                {t('applicantContract.downloadContract')}
              </button>
            </div>
            <div className="border-bottom my-4"></div>
            <form className="w-100">
              <div className="form-group row">
                <label htmlFor="id-card" className="col-sm-3 col-form-label">
                  {t('applicantContract.signedContract')}
                </label>
                <div className="col-sm-9">
                  <div className="custom-file">
                    <InputFile
                      onChange={(event) =>
                        handleInputChange(event?.target?.files[0], 'contract')
                      }
                      value={formFile['contract']?.filename}
                      placeholder={t('applicantContract.placeholder')}
                      mimeTypes={ALLOWED_MIME_TYPES}
                      readOnly={!!candidateData?.contractDocumentId || submitStatus}
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                {candidateData?.contractDocumentId || submitStatus ? (
                  <Notification
                    color="success"
                    message={t('applicantContract.attachmentReceived')}
                    className="m-0"
                  />
                ) : (
                  <Notification
                    color="info"
                    message={t('applicantContract.attachmentInformation')}
                    className="m-0"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="applicant-contract-footer mb-4">
          <button
            type="button"
            className="btn btn-primary"
            disabled={
              !uploadFilesAreValid() || !!candidateData?.contractDocumentId || submitStatus
            }
            onClick={submitConfirmation}
          >
            {t('applicantContract.submitContract')}
          </button>
        </div>
      </div>
      <OverlayLoader show={loading} />
    </div>
  )
}
