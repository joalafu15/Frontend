import './BulkUpdateCandidate.css'

import React, { useEffect, useState } from 'react'
import {
  postCandidateBulkUpdateUploadAct,
  resetCandidateStateAct,
} from 'src/redux/candidates/actions'
import { useDispatch, useSelector } from 'react-redux'

import Notification from 'src/components/Notification'
import { Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function BulkUpdateCandidate() {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const candidateState = useSelector((state) => state?.candidates)

  const [selectedFile, setSelectedFile] = useState(null)
  const [hasError, setHasError] = useState(null)

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  const handleBulkUpdateCandidateUpload = () => {
    dispatch(resetCandidateStateAct())
    dispatch(postCandidateBulkUpdateUploadAct(selectedFile))
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
        t('bulkUpdateCandidate.successMsg', {
          importedCount: candidateState?.bulkCreate?.imported,
        }),
      )
    }

    if (
      candidateState?.errors &&
      Object.keys(candidateState?.errors).length > 0
    ) {
      toast.error(t('bulkUpdateCandidate.somethingWrong'))
    }
  }, [candidateState?.loading])

  return (
    <div>
      <div className="container bulk-update-candidate">
        <Notification
          color="info"
          message={t('bulkUpdateCandidate.infoMessage')}
        />

        {hasError ? (
          <Notification
            color="error"
            message={t('bulkUpdateCandidate.invalidFileType')}
          />
        ) : null}
        <div className="bulk-update-candidate-details">
          <div className="container">
            <form className="w-100">
              <div className="form-group row">
                <label htmlFor="id-card" className="col-sm-2 col-form-label">
                  {t('bulkUpdateCandidate.fileCandidate')}
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
        <div className="bulk-update-candidate-footer">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleBulkUpdateCandidateUpload}
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
              t('bulkUpdateCandidate.import')
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
