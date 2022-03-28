import { debounce, get } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Pagination from '@material-ui/lab/Pagination'
import { Chip } from '@material-ui/core'
import { Face } from '@material-ui/icons'

import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'
import { getUserListAct } from 'src/redux/users/actions'
import {
  getOffsetFromCurrentPage,
  getTotalPage,
} from 'src/utils/paginationsUtils'

const FILTER_PERPAGE_OPTIONS = [
  { label: 'Show 10/page', value: 10 },
  { label: 'Show 50/page', value: 50 },
  { label: 'Show 100/page', value: 100 },
]

const ROLES_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'admin', label: 'Admin' },
  { value: 'candidate', label: 'Candidate' },
  { value: 'committee', label: 'Committee' },
]

const initFilter = {
  pagination: { limit: 10 },
  order: {},
  where: {},
}

export default function UserList() {
  const { t } = useTranslation()
  const history = useHistory()

  const dispatch = useDispatch()
  const [filter, setFilter] = useState({
    ...initFilter,
  })
  const [deleteId, setDeleteId] = useState(0)
  const usersState = useSelector((state) => state?.users)
  const items = get(usersState, 'entities', [])

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  const getUsersList = useCallback(() => {
    dispatch(getUserListAct(filter))
  }, [])

  useEffect(() => {
    getUsersList()
    return () => {}
  }, [])

  const handleFilterChange = (key, val) => {
    const nextFilter = {
      ...filter,
      where: {
        ...filter.where,
        [key]: val,
      },
    }
    setFilter(nextFilter)
    dispatch(debounce(getUserListAct(nextFilter), 500))
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
    dispatch(debounce(getUserListAct(nextFilter), 500))
  }

  const handlerResetFilter = () => {
    setFilter({ ...initFilter })
    dispatch(getUserListAct({ ...initFilter }))
  }

  const renderTableContent = () => {
    if (usersState?.loading) {
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
            <td>{it?.name}</td>
            <td>{it?.username}</td>
            <td>{it?.email}</td>
            <td>
              {it?.roles.map((it, idx) => {
                return (
                  <Chip
                    key={idx}
                    label={it}
                    icon={<Face />}
                    variant="outlined"
                    size="small"
                    style={{ textTransform: 'capitalize', margin: '2px' }}
                    color="default"
                  />
                )
              })}
            </td>
            {/* <td>
              <div className="table-btns">
                <button
                  className="btn ml-2"
                  disabled
                  onClick={() => redirectTo(`admin/users/${it?.id}`)}
                >
                  {t('common.edit')}
                </button>
              </div>
            </td> */}
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
        <Row sm="12" className="d-flex justify-content-start my-3">
          <Col xs={2} className="align-self-start">
            <Button onClick={() => redirectTo('admin/users/create')}>
              {t('common.add')}
            </Button>
          </Col>
        </Row>
        <Row sm="12" className="d-flex justify-content-between">
          <Col sm="3">
            <Form.Label>{t('usersManagement.roles')}</Form.Label>
            <Form.Control
              as="select"
              value={filter?.where?.roles ?? ''}
              defaultValue={filter?.where?.roles ?? ''}
              onChange={(event) =>
                handleFilterChange('roles', event?.target?.value)
              }
            >
              {ROLES_OPTIONS.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {t(option?.label)}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col sm="3">
            <Form.Label>{t('usersManagement.email')}</Form.Label>
            <Form.Control
              placeholder="search..."
              defaultValue={filter?.where?.email}
              onChange={(event) => {
                const val = event?.target?.value
                handleFilterChange('email', val)
              }}
            />
          </Col>
          <Col sm="3">
            <Form.Label>{t('usersManagement.username')}</Form.Label>
            <Form.Control
              placeholder="search..."
              defaultValue={filter?.where?.username}
              onChange={(event) => {
                const val = event?.target?.value
                handleFilterChange('username', val)
              }}
            />
          </Col>
          <Col xs={3} className="align-self-end">
            <Form.Label>{t('usersManagement.name')}</Form.Label>
            <Form.Control
              placeholder="search..."
              defaultValue={filter?.where?.name}
              onChange={(event) => {
                const val = event?.target?.value
                handleFilterChange('name', val)
              }}
            />
          </Col>
        </Row>
        <Row sm="12" className="d-flex justify-content-end my-4">
          <Col sm="3" className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-primary mx-1"
              onClick={handlerResetFilter}
            >
              {t('usersManagement.resetFilter')}
            </button>
          </Col>
        </Row>

        <Row sm="12" className="py-3">
          <Col sm="12">
            <div className="table-responsive">
              <Table size="sm">
                <thead>
                  <tr>
                    <th scope="col">{t('usersManagement.userId')}</th>
                    <th scope="col">{t('usersManagement.name')}</th>
                    <th scope="col">{t('usersManagement.username')}</th>
                    <th scope="col">{t('usersManagement.email')}</th>
                    <th scope="col">{t('usersManagement.roles')}</th>
                    {/* <th scope="col">{t('usersManagement.actions')}</th> */}
                  </tr>
                </thead>
                <tbody>{renderTableContent()}</tbody>
              </Table>
            </div>
          </Col>
        </Row>
        <div className="table-footer-wrapper px-3">
          <Row xs={12} className="d-flex justify-content-between mb-5">
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
                  handlePaginationChange('limit', val)
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
                  usersState?.meta?.count,
                )}
                shape="rounded"
                chan
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
          <DialogContentText>
            {t('usersManagement.deleteAlert')}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <OverlayLoader show={usersState?.loading} />
    </div>
  )
}
