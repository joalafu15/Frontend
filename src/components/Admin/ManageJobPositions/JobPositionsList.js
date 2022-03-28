import { Button, Col, Form, Row, Table } from 'react-bootstrap'
import React, { useCallback, useEffect, useState } from 'react'
import { debounce, get } from 'lodash'
import {
  deleteJobPositionAct,
  getJobPositionListAct,
} from '../../../redux/jobPositions/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'
import { useTranslation } from 'react-i18next'
import Pagination from '@material-ui/lab/Pagination'
import {
  getOffsetFromCurrentPage,
  getTotalPage,
} from 'src/utils/paginationsUtils'

const FILTER_PERPAGE_OPTIONS = [
  { label: 'Show 10/page', value: 10 },
  { label: 'Show 50/page', value: 50 },
  { label: 'Show 100/page', value: 100 },
]

const initFilter = {
  pagination: {
    limit: 10,
    skip: 0,
  },
  order: {},
  where: {},
}

export default function JobPositionList() {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const [filter, setFilter] = useState({
    ...initFilter,
  })
  const [deleteId, setDeleteId] = useState(0)
  const jobPositionsState = useSelector((state) => state?.jobPositions)
  const items = get(jobPositionsState, 'entities', [])

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  const getJobPositionsList = useCallback(() => {
    dispatch(getJobPositionListAct(filter))
  }, [])

  useEffect(() => {
    getJobPositionsList()
    return () => {}
  }, [])

  const handleDelete = (event) => {
    dispatch(deleteJobPositionAct({ id: deleteId }))
    setDeleteId(0)
  }

  const handleFilterChange = (key, value) => {
    const nextFilter = {
      ...filter,
      where: {
        ...filter.where,
        [key]: value,
      },
    }
    setFilter(nextFilter)
    dispatch(debounce(getJobPositionListAct(nextFilter), 500))
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
    dispatch(debounce(getJobPositionListAct(nextFilter), 500))
  }

  const renderTableContent = () => {
    if (jobPositionsState?.loading) {
      return (
        <tr>
          <td colSpan={7}>Loading...</td>
        </tr>
      )
    }

    return items.length > 0 ? (
      items.map((it, idx) => {
        return (
          <tr key={it.id + idx}>
            <th scope="row">{it.id}</th>
            <td>{it?.title}</td>
            <td>{it?.housing}</td>
            <td>{it?.netSalary}</td>
            <td>{it?.gosi}</td>
            <td>{it?.totalSalary}</td>
            <td>
              <div className="table-btns">
                <button
                  className="btn ml-2"
                  onClick={() => redirectTo(`admin/job-positions/${it?.id}`)}
                >
                  {t('common.edit')}
                </button>
                <button className="btn" onClick={() => setDeleteId(it.id)}>
                  {t('common.delete')}
                </button>
              </div>
            </td>
          </tr>
        )
      })
    ) : (
      <tr>
        <td colSpan={7}>No data available</td>
      </tr>
    )
  }

  return (
    <div>
      <div className="container bg-white rounded p-4">
        <Row sm="12" className="d-flex justify-content-between">
          <Col xs={2} className="align-self-start">
            <Button onClick={() => redirectTo('admin/job-positions/create')}>
              {t('common.add')}
            </Button>
          </Col>
          <Col xs={4} className="align-self-end">
            <Form.Control
              placeholder="search..."
              name="title"
              value={filter?.where?.title}
              onChange={(event) => {
                const title = event?.target?.value
                handleFilterChange('title', title)
              }}
            />
          </Col>
        </Row>

        <Row sm="12" className="py-3">
          <Col sm="12">
            <div className="table-responsive">
              <Table size="sm">
                <thead>
                  <tr>
                    <th scope="col">{t('jobPosition.jobPositionId')}</th>
                    <th scope="col">{t('jobPosition.title')}</th>
                    <th scope="col">{t('jobPosition.housing')}</th>
                    <th scope="col">{t('jobPosition.netSalary')}</th>
                    <th scope="col">{t('jobPosition.gosi')}</th>
                    <th scope="col">{t('jobPosition.totalSalary')}</th>
                    <th scope="col">{t('jobPosition.actions')}</th>
                  </tr>
                </thead>
                <tbody>{renderTableContent()}</tbody>
              </Table>
            </div>
          </Col>
        </Row>
        <div className="table-footer-wrapper px-3">
          <Row sm={12} className="d-flex justify-content-between mb-5">
            <Col
              xs={3}
              className="align-items-end d-flex justify-content-start"
            >
              <Form.Control
                placeholder="Select per page..."
                as="select"
                defaultValue={filter?.pagination?.limit}
                onChange={(event) => {
                  const val = event?.target?.value
                  return handlePaginationChange('limit', Number(val))
                }}
              >
                {FILTER_PERPAGE_OPTIONS.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col xs={6} className="d-flex justify-content-end">
              <Pagination
                count={getTotalPage(
                  filter?.pagination?.limit,
                  jobPositionsState?.meta?.count,
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
        </div>
      </div>
      <Dialog open={!!deleteId} onClose={() => setDeleteId(0)}>
        <DialogContent>
          <DialogContentText>{t('jobPosition.deleteAlert')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(0)} color="primary">
            {t('common.refusal')}
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            {t('common.accept')}
          </Button>
        </DialogActions>
      </Dialog>
      <OverlayLoader show={jobPositionsState?.loading} />
    </div>
  )
}
