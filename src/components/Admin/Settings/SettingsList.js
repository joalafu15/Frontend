import { Button, Col, Form, Row, Table } from 'react-bootstrap'
import { DeleteOutlined, EditOutlined } from '@material-ui/icons'
import React, { useCallback, useEffect, useState } from 'react'
import { debounce, get } from 'lodash'
import {
  deleteSettingAct,
  getSettingListAct,
} from '../../../redux/settings/actions'
import { useDispatch, useSelector } from 'react-redux'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import { IconButton } from '@material-ui/core'
import OverlayLoader from 'src/components/UIKit/Loader/OverlayLoader'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const FILTER_PERPAGE_OPTIONS = [
  { label: 'Show 10/page', value: 10 },
  { label: 'Show 50/page', value: 50 },
  { label: 'Show 100/page', value: 100 },
]

export default function SettingsList() {
  const { t } = useTranslation()
  const history = useHistory()

  const dispatch = useDispatch()
  const [filter, setFilter] = useState({
    pagination: { limit: 10 },
  })
  const [deleteId, setDeleteId] = useState(0)
  const settingsState = useSelector((state) => state?.settings)
  const items = get(settingsState, 'entities', [])

  const redirectTo = (link) => {
    history.push(`/${link}`)
  }

  const getSettingsList = useCallback(() => {
    dispatch(getSettingListAct(filter))
  }, [])

  useEffect(() => {
    getSettingsList()
    return () => {}
  }, [])

  const handleSearch = (event) => {
    const val = event?.target?.value
    const nextFilter = {
      ...filter,
      where: { ...filter.where, setting: val },
    }
    setFilter(nextFilter)
    dispatch(debounce(getSettingListAct(nextFilter), 400))
  }

  const handleDelete = (event) => {
    dispatch(deleteSettingAct({ id: deleteId }))
    setDeleteId(0)
  }

  const handleFilter = (event) => {
    const val = event?.target?.value
    const nextFilter = {
      ...filter,
      pagination: {
        ...filter?.pagination,
        limit: val,
      },
    }
    setFilter(nextFilter)
    dispatch(debounce(getSettingListAct(nextFilter), 400))
  }

  const renderTableContent = () => {
    if (settingsState?.loading) {
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
            <td>{it?.setting}</td>
            <td>{it?.value}</td>
            <td>{it?.active ? 'true' : 'false'}</td>
            <td>
              <div className="table-btns">
                <IconButton
                  color="inherit"
                  size="small"
                  component="span"
                  aria-label={t('common.edit')}
                  onClick={() => redirectTo(`admin/settings/${it?.id}`)}
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
                <IconButton
                  color="inherit"
                  size="small"
                  component="span"
                  aria-label={t('common.delete')}
                  onClick={() => setDeleteId(it.id)}
                >
                  <DeleteOutlined fontSize="small" />
                </IconButton>
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
            <Button onClick={() => redirectTo('admin/settings/create')}>
              {t('common.add')}
            </Button>
          </Col>
          <Col xs={4} className="align-self-end">
            <Form.Control
              placeholder="search..."
              defaultValue={filter?.where?.setting}
              onChange={handleSearch}
            />
          </Col>
        </Row>

        <Row sm="12" className="py-3">
          <Col sm="12">
            <div className="table-responsive">
              <Table size="sm">
                <thead>
                  <tr>
                    <th scope="col">{t('setting.setting')}</th>
                    <th scope="col">{t('setting.value')}</th>
                    <th scope="col">{t('setting.active')}</th>
                    <th scope="col">{t('setting.actions')}</th>
                  </tr>
                </thead>
                <tbody>{renderTableContent()}</tbody>
              </Table>
            </div>
          </Col>
        </Row>
        <div className="table-footer-wrapper px-3">
          <Row sm="12" className="d-flex justify-content-end">
            <Col xs={4} className="align-items-end">
              <Form.Control
                placeholder="Select per page..."
                as="select"
                defaultValue={filter?.pagination?.limit}
                onChange={handleFilter}
              >
                {FILTER_PERPAGE_OPTIONS.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>
        </div>
      </div>
      <Dialog open={!!deleteId} onClose={() => setDeleteId(0)}>
        <DialogContent>
          <DialogContentText>{t('setting.deleteAlert')}</DialogContentText>
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
      <OverlayLoader show={settingsState?.loading} />
    </div>
  )
}
