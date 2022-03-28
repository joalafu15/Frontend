import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { debounce, get } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import Qs from 'querystring'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import { makeStyles } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'

import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'
import AsyncSearchableSelect from 'src/components/UIKit/AsyncSearchableSelect/AsyncSearchableSelect'
import CandidateListTable from './components/CandidateListTable'
import CandidateListTableForOperationsUser from './components/CandidateListTableForOperationsUser'
import CandidateListTableForCommitteeUser from './components/CandidateListTableForCommitteeUser'

import useQuery from 'src/hooks/useQuery'
import useAuth from 'src/hooks/useAuth'
import { Checkbox } from '@material-ui/core'
import {
  getCandidateListAct,
  postPassedInterviewAct,
  postPassedMedicalAct,
  postConductedInterviewAct,
  postContractValidatedAct,
} from 'src/redux/candidates/actions'
import { getJobPositionList } from 'src/services/jobPositionsSvc'
import { getAdministrationCandidateListAct } from 'src/redux/administrations/actions'
import { postCandidateFileMatchedAct } from 'src/redux/candidates/actions'

import { getAdministrationsList } from 'src/services/administrationsSvc'

import {
  getOffsetFromCurrentPage,
  getTotalPage,
} from 'src/utils/paginationsUtils'
import { actionAllowed } from 'src/utils/authUtils'

import {
  FILTER_PERPAGE_OPTIONS,
  FILTER_SORT_OPTIONS,
  INITIAL_FILTER,
} from './constants'

import 'react-confirm-alert/src/react-confirm-alert.css'

const useStyles = makeStyles((theme) => ({
  tinnyButton: {
    padding: '3px',
    minWidth: '35px',
    textTransform: 'none',
    borderRadius: '3px',
    margin: '3px',
    outline: 'none',
    boxShadow: 'unset',
  },
  primary: {
    background: 'linear-gradient(179.83deg, #2196f3 -10.06%, #3f51b5 106.57%)',
    color: '#fff',
  },
  success: {
    background: 'linear-gradient(179.83deg, #28a745 -10.06%, #1e7e34 106.57%)',
    color: '#fff',
  },
  danger: {
    background: 'linear-gradient(179.83deg, #dc3545 -10.06%, #bd2130 106.57%)',
    color: '#fff',
  },
  inherit: {
    background: 'linear-gradient(179.83deg, #f4f4f4 -10.06%, #bbbbbb 106.57%)',
    color: '#000',
  },
}))

export default function ManageApplicants() {
  const { t } = useTranslation()
  const { push } = useHistory()
  const dispatch = useDispatch()
  const styles = useStyles()
  const { userProfile, loading, userAcls } = useAuth()
  const [jobPositionOptions, setJobPositionOptions] = useState([])
  const [administrationOptions, setAdministrationOptions] = useState([])
  const [filter, setFilter] = useState({ ...INITIAL_FILTER })
  const [selectedAdministrationFilter, setSelectedAdministrationFilter] =
    useState({})
  const candidatesState = useSelector((state) => state?.candidates)
  const administrationCandidatesState = useSelector(
    (state) => state?.administrations,
  )

  const query = useQuery()
  const objectQuery = query.toString() && Qs.parse(query.toString())

  const wrapHandleGetCandidatesListAct = (params) => {
    if (get(userProfile, 'roles', []).includes('admin')) {
      return getCandidateListAct(params)
    } else if (get(userProfile, 'roles', []).includes('operations')) {
      return getCandidateListAct({
        ...params,
        include: ["contractDocument"]
      })
    } else if (get(userProfile, 'roles', []).includes('committee')) {
      return getAdministrationCandidateListAct({
        administrationId: get(userProfile, 'administrationId', null),
        params,
      })
    }
  }

  const getJopPositionOptions = async (val) => {
    try {
      const { data: result } = await getJobPositionList({
        filters: { title: val },
      })
      const resultTmp = result?.map((it) => ({
        label: it.title,
        value: it.id,
      }))
      resultTmp.unshift({ label: t('manageApplicants.all'), value: 0 })
      return resultTmp
    } catch (error) {
      return []
    }
  }

  const loadJobPositionOptions = useCallback(async () => {
    const options = await getJopPositionOptions()
    setJobPositionOptions(options)
  }, [])

  const handleGetCandidateList = useCallback(() => {
    if (Object.keys(userProfile).length > 0) {
      dispatch(wrapHandleGetCandidatesListAct(filter))
    }
  }, [filter, userProfile?.roles])

  const handleCandidatesRefetch = () => {
    if (Object.keys(userProfile).length > 0) {
      dispatch(wrapHandleGetCandidatesListAct(filter))
    }
  }

  useEffect(() => {
    handleGetCandidateList()
    loadJobPositionOptions()
    setFilter({ ...filter, ...objectQuery })
  }, [userProfile?.roles])

  const handleOrderChange = (key, val) => {
    const nextFilter = {
      ...filter,
      order: {
        ...filter.order,
        [key]: val,
      },
    }
    setFilter({ ...nextFilter })
    dispatch(debounce(wrapHandleGetCandidatesListAct(nextFilter), 500))
  }

  const handlePaginationChange = (key, val) => {
    const nextFilter = {
      ...filter,
      pagination: {
        ...filter.pagination,
        [key]: val,
        ...(key === 'limit' && { skip: 0 }),
      },
    }
    setFilter({ ...nextFilter })
    dispatch(debounce(wrapHandleGetCandidatesListAct(nextFilter), 500))
  }

  const handelFilerDelete = (key) => {
    const { where } = filter
    delete where[key]
    const nextFilter = {
      ...filter,
      where: {
        ...where,
      },
    }
    setFilter({ ...nextFilter })
    dispatch(debounce(wrapHandleGetCandidatesListAct(nextFilter), 500))
  }

  const handleFilterChange = (key, val) => {
    const nextFilter = {
      ...filter,
      where: {
        ...filter.where,
        [key]: val,
      },
    }
    setFilter({ ...nextFilter })
    dispatch(debounce(wrapHandleGetCandidatesListAct(nextFilter), 500))
  }

  const loadAdministrationOptions = async (val) => {
    try {
      const { data: result } = await getAdministrationsList({
        where: { ...(val && { name: val }) },
        pagination: { limit: 5 },
      })

      const options = result?.map((it) => ({
        label: it.name,
        value: it.id,
      }))

      setAdministrationOptions(options)

      return options
    } catch (error) {
      return {}
    }
  }

  useEffect(() => {
    loadAdministrationOptions()
  }, [])

  const clickedPassedInterview = (value) => {
    const title = t('manageApplicants.submitConfirmationTitle')
    const message = t('manageApplicants.submitConfirmationMessage')

    confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: t('common.yes'),
          onClick: () => handlePassedInterview(value),
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  const handlePassedInterview = async (val) => {
    const payload = {
      passedInterview: val.value,
    }
    const data = await dispatch(
      postPassedInterviewAct({ candidateId: val.id, payload }),
    )
    if (data?.error) {
      return toast.error(t('manageApplicants.somethingWrong'))
    }
    handleGetCandidateList()
    return toast.success(t('manageApplicants.successMsg'))
  }

  const clickedPassedMedical = (value) => {
    const title = t('manageApplicants.submitConfirmationTitle')
    const message = t('manageApplicants.submitConfirmationMessage')

    confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: t('common.yes'),
          onClick: () => handlePassedMedical(value),
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  const handlePassedMedical = async (val) => {
    const payload = {
      medicalExaminationPassed: val.value,
    }

    const data = await dispatch(
      postPassedMedicalAct({ candidateId: val.id, payload }),
    )
    if (data?.error) {
      return toast.error(t('manageApplicants.somethingWrong'))
    }
    handleGetCandidateList()
    return toast.success(t('manageApplicants.successMsg'))
  }

  const clickedConductedInterview = (value) => {
    const title = t('manageApplicants.submitConfirmationTitle')
    const message = t('manageApplicants.submitConfirmationMessage')

    confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: t('common.yes'),
          onClick: () => handleConductedInterview(value),
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  const handleConductedInterview = async (val) => {
    const payload = {
      conductedInterview: val.value,
    }

    const data = await dispatch(
      postConductedInterviewAct({ candidateId: val.id, payload }),
    )
    if (data?.error) {
      return toast.error(t('manageApplicants.somethingWrong'))
    }
    handleGetCandidateList()
    return toast.success(t('manageApplicants.successMsg'))
  }

  const clickedContractValidated = (value) => {
    const title = t('manageApplicants.submitConfirmationTitle')
    const message = t('manageApplicants.submitConfirmationMessage')

    confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: t('common.yes'),
          onClick: () => handleContractValidated(value),
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  const handleContractValidated = async (val) => {
    const payload = {
      contractValidated: val.value,
    }

    const data = await dispatch(
      postContractValidatedAct({ candidateId: val.id, payload }),
    )
    if (data?.error) {
      return toast.error(t('manageApplicants.somethingWrong'))
    }
    handleGetCandidateList()
    return toast.success(t('manageApplicants.successMsg'))
  }

  const handlerResetFilter = () => {
    setFilter({ ...INITIAL_FILTER })
    setSelectedAdministrationFilter({})
    dispatch(wrapHandleGetCandidatesListAct({ ...INITIAL_FILTER }))
  }

  const handleMatchedFiles = (candidateId, filesMatched) => {
    confirmAlert({
      title: t('manageApplicants.submitFileMatchedConfirmationTitle'),
      message: t('manageApplicants.submitFileMatchedConfirmationMessage'),
      buttons: [
        {
          label: t('common.yes'),
          onClick: () => {
            const payload = {
              candidateId,
              payload: {
                filesMatched,
              },
            }
            return dispatch(postCandidateFileMatchedAct(payload))
              .then((res) => {
                if (res?.meta?.requestStatus === 'fulfilled') {
                  toast.success(t('manageApplicants.fileMatchedSuccessfully'))
                } else if (res?.meta?.requestStatus === 'rejected') {
                  toast.success(t('manageApplicants.fileMatchedFailed'))
                }
                handleCandidatesRefetch()
              })
              .catch((err) => {
                if (err?.meta?.requestStatus === 'rejected') {
                  toast.success(t('manageApplicants.fileMatchedFailed'))
                }
                toast.success(t('common.errorMessage'))
              })
          },
          className: 'btn btn-primary',
        },
        {
          label: t('common.no'),
          className: 'btn btn-secondary',
        },
      ],
    })
  }

  const wrapGetCandidateEntities = get(
    get(userProfile, 'roles', []).includes('admin') ||
    get(userProfile, 'roles', []).includes('operations')
      ? candidatesState
      : administrationCandidatesState,
    get(userProfile, 'roles', []).includes('admin') ||
    get(userProfile, 'roles', []).includes('operations')
      ? 'entities'
      : 'candidateEntities',
    [],
  )

  const allowEdit = actionAllowed('applicants_update', userAcls)

  const loadingData =
    candidatesState?.loading ||
    loading ||
    administrationCandidatesState?.loading

  return (
    <div style={{ margin: '30px auto' }}>
      <div
        className="container-fluid bg-white rounded p-4 mx-8"
        style={{ width: '90%' }}
      >
        <Row sm="12" className="d-flex justify-content-end my-3">
          <Col xs={2} className="d-flex justify-content-end">
            {actionAllowed('applicants_create', userAcls) && (
              <Button onClick={() => push('/admin/candidates/create')}>
                {t('common.add')}
              </Button>
            )}
          </Col>
        </Row>
        <Row sm="12" className="d-flex">
          {!get(userProfile, 'roles', []).includes('committee') && (
            <>
              <Col md={3} sm={6} className="mt-3">
                <Form.Label>{t('manageApplicants.administration')}</Form.Label>
                <AsyncSearchableSelect
                  handleLoadOptions={loadAdministrationOptions}
                  defaultOptions={administrationOptions}
                  defaultValue={selectedAdministrationFilter}
                  value={selectedAdministrationFilter}
                  onChange={({ value, label }) => {
                    setSelectedAdministrationFilter({ value, label })
                    handleFilterChange('administrationId', value)
                  }}
                />
              </Col>
              {get(userProfile, 'roles', []).includes('admin') && (
                <>
                  <Col md={3} sm={6} className="mt-3">
                    <Form.Label>{t('manageApplicants.gpa')}</Form.Label>
                    <Form.Control
                      as="select"
                      name="gpa"
                      defaultValue={filter?.order?.gpa}
                      onChange={(event) =>
                        handleOrderChange('gpa', event?.target?.value)
                      }
                    >
                      {FILTER_SORT_OPTIONS.map((option) => (
                        <option key={option?.value} value={option?.value}>
                          {t(option?.label)}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={3} sm={6} className="mt-3">
                    <Form.Label>{t('manageApplicants.qiyasScore')}</Form.Label>
                    <Form.Control
                      as="select"
                      name="qiyasScore"
                      defaultValue={filter?.order?.qiyasScore}
                      onChange={(event) =>
                        handleOrderChange('qiyasScore', event?.target?.value)
                      }
                    >
                      {FILTER_SORT_OPTIONS.map((option) => (
                        <option key={option?.value} value={option?.value}>
                          {t(option?.label)}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </>
              )}
            </>
          )}
          <Col md={3} sm={6} className="mt-3">
            <Form.Label>{t('manageApplicants.searchNationalId')}</Form.Label>
            <Form.Control
              type="text"
              onChange={(event) =>
                handleFilterChange('nationalIdNumber', event?.target?.value)
              }
              className="form-control"
              placeholder={t('manageApplicants.search')}
            />
          </Col>
        </Row>
        <Row sm="12" className="d-flex">
          <Col md={3} sm={6} className="mt-3">
            <Form.Label>{t('manageApplicants.jobPosition')}</Form.Label>
            <Form.Control
              as="select"
              name="jobPositionId"
              onChange={(event) => {
                console.log('eee===', event.target.value)
                event.target.value > 0
                  ? handleFilterChange('jobPositionId', event.target.value)
                  : handelFilerDelete('jobPositionId')
              }}
            >
              {jobPositionOptions.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {t(option?.label)}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col md={3} sm={6} className="mt-3">
            <Form.Label className="d-block">
              <Checkbox
                onChange={(event) => {
                  event.target.checked
                    ? handleFilterChange('submittedPhaseOneAt', null)
                    : handelFilerDelete('submittedPhaseOneAt')
                }}
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              {t('manageApplicants.submittedPhaseOne')}
            </Form.Label>
            <Form.Label className="d-block">
              <Checkbox
                onChange={(event) => {
                  event.target.checked
                    ? handleFilterChange('submittedPhaseTwoAt', null)
                    : handelFilerDelete('submittedPhaseTwoAt')
                }}
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              {t('manageApplicants.submittedPhaseTwo')}
            </Form.Label>
          </Col>
          <Col md={3} sm={6} className="mt-3">
            <Form.Label className="d-block">
              <Checkbox
                onChange={(event) => {
                  event.target.checked
                    ? handleFilterChange('conductedInterviewAt', null)
                    : handelFilerDelete('conductedInterviewAt')
                }}
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              {t('manageApplicants.conductedInterview')}
            </Form.Label>
            <Form.Label className="d-block">
              <Checkbox
                onChange={(event) => {
                  event.target.checked
                    ? handleFilterChange('passedInterviewAt', null)
                    : handelFilerDelete('passedInterviewAt')
                }}
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              {t('manageApplicants.passedInterview')}
            </Form.Label>
          </Col>
          <Col md={3} sm={6} className="mt-3">
            <Form.Label className="d-block">
              <Checkbox
                onChange={(event) => {
                  event.target.checked
                    ? handleFilterChange('filesMatchedAt', null)
                    : handelFilerDelete('filesMatchedAt')
                }}
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              {t('manageApplicants.filesMatched')}
            </Form.Label>
            <Form.Label className="d-block">
              <Checkbox
                onChange={(event) => {
                  event.target.checked
                    ? handleFilterChange('contractDocumentId', null)
                    : handelFilerDelete('contractDocumentId')
                }}
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              {t('manageApplicants.contractDocument')}
            </Form.Label>
          </Col>
        </Row>
        <Row sm="12" className="d-flex justify-content-end my-4">
          <Col sm="3" className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-primary mx-1"
              onClick={handlerResetFilter}
            >
              {t('manageApplicants.resetFilter')}
            </button>
          </Col>
        </Row>
        <Row>
          {get(userProfile, 'roles', []).includes('admin') ? (
            <CandidateListTable
              allowEdit={allowEdit}
              entities={wrapGetCandidateEntities}
              handleClickedConductedInterview={clickedConductedInterview}
              handleClickedPassedInterview={clickedPassedInterview}
              handleClickedPassedMedical={clickedPassedMedical}
              loading={loadingData}
              styles={styles}
            />
          ) : get(userProfile, 'roles', []).includes('operations') ? (
            <CandidateListTableForOperationsUser
              allowEdit={allowEdit}
              entities={wrapGetCandidateEntities}
              handleClickedContractValidated={clickedContractValidated}
              handleClickedPassedMedical={clickedPassedMedical}
              loading={loadingData}
              styles={styles}
            />
          ) : (
            <CandidateListTableForCommitteeUser
              allowEdit={allowEdit}
              entities={wrapGetCandidateEntities}
              handleClickedPassedInterview={clickedPassedInterview}
              handleClickedFileMatched={handleMatchedFiles}
              loading={loadingData}
              styles={styles}
            />
          )}
        </Row>
        <div className="table-footer-wrapper px-3">
          <Row xs={12} className="d-flex justify-content-between mb-5">
            <Col
              xl={3}
              lg={5}
              md={4}
              className="align-items-end d-flex justify-content-start"
            >
              <Form.Control
                placeholder="Select per page..."
                className="pl-0"
                as="select"
                name="limit"
                defaultValue={filter?.pagination?.limit}
                onChange={(event) =>
                  handlePaginationChange('limit', Number(event?.target?.value))
                }
              >
                {FILTER_PERPAGE_OPTIONS.map((option) => (
                  <option key={option?.value} value={option?.value}>
                    {t(option?.label)}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col xl={9} lg={7} md={8} className="d-flex justify-content-end">
              <Pagination
                count={getTotalPage(
                  filter?.pagination?.limit,
                  candidatesState?.meta?.count,
                )}
                onChange={(_, page) => {
                  const skip = getOffsetFromCurrentPage(
                    page,
                    Number(filter?.pagination?.limit),
                  )
                  return handlePaginationChange('skip', skip)
                }}
                showFirstButton
                showLastButton
              />
            </Col>
          </Row>
          {actionAllowed('applicants_create', userAcls) && (
            <Row xs={6}>
              <Button
                type="button"
                variant="primary"
                className="mx-1"
                onClick={() => push('/admin/candidates/bulk-update')}
              >
                {t('manageApplicants.candidateBulkUpdate')}
              </Button>
              <Button
                type="button"
                variant="primary"
                className="mx-1"
                onClick={() => push('/admin/candidates/bulk-create')}
              >
                {t('manageApplicants.bulkImport')}
              </Button>
              <Button type="button" variant="primary" className="mx-1" disabled>
                {t('manageApplicants.exportToExcel')}
              </Button>
            </Row>
          )}
        </div>
      </div>
      <OverlayLoader show={candidatesState?.loading} />
    </div>
  )
}
