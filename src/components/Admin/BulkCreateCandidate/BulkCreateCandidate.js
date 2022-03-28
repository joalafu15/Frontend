import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Spinner } from 'react-bootstrap'

import Notification from 'src/components/Notification'

import {
  postCandidateBulkCreateUploadAct,
  resetCandidateStateAct,
} from 'src/redux/candidates/actions'

import './BulkCreateCandidate.css'

export default function BulkCreateCandidate() {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const candidateState = useSelector((state) => state?.candidates)

  const [selectedFile, setSelectedFile] = useState(null)
  const [hasError, setHasError] = useState(null)

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  const handleBulkCreateCandidateUpload = () => {
    dispatch(resetCandidateStateAct())
    dispatch(postCandidateBulkCreateUploadAct(selectedFile))
  }

  useEffect(() => {
    return () => {
      dispatch(resetCandidateStateAct())
    }
  }, [])

  const handleFileInputChange = (event) => {
    const selectedFile = event?.target?.files[0]
    if (isValidExcelFile(selectedFile?.name)) {
      setSelectedFile(selectedFile)
      setHasError(null)
    } else {
      setHasError('file type not allowed')
    }
  }

  const isValidExcelFile = (fileName) => {
    const ext = fileName && fileName.substr(fileName.lastIndexOf('.') + 1)
    if (ext !== 'xlsx') {
      return false
    }
    return true
  }

  useEffect(() => {
    if (candidateState?.bulkCreate?.imported) {
      toast.success(
        t('bulkCreateCandidate.successMsg', {
          importedCount: candidateState?.bulkCreate?.imported,
        }),
      )
    }

    if (
      candidateState?.errors &&
      Object.keys(candidateState?.errors).length > 0
    ) {
      toast.error(t('bulkCreateCandidate.somethingWrong'))
    }
  }, [candidateState?.loading])

  return (
    <div>
      <div className="container bulk-create-candidate">
        <Notification
          color="info"
          message={t('bulkCreateCandidate.infoMessage')}
        />

        {hasError ? (
          <Notification
            color="error"
            message={t('bulkCreateCandidate.invalidFileType')}
          />
        ) : null}
        <div className="bulk-create-candidate-details">
          <div className="container">
            <form className="w-100">
              <div className="form-group row">
                <label htmlFor="id-card" className="col-sm-2 col-form-label">
                  {t('bulkCreateCandidate.fileCandidate')}
                </label>
                <div className="col-sm-10">
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="inputGroupFile01"
                      name="file"
                      onChange={handleFileInputChange}
                    />
                    <label className="custom-file-label" for="inputGroupFile01">
                      {selectedFile ? selectedFile.name : 'Chose file'}
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="bulk-create-candidate-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleBulkCreateCandidateUpload}
            disabled={hasError || candidateState?.loading || !selectedFile}
          >
            {candidateState?.loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              t('bulkCreateCandidate.import')
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => history.goBack()}
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    </div>
  )
}
