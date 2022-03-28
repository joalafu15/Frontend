import './SettingForm.css'

import * as yup from 'yup'

import { Col, Container, Form, Row } from 'react-bootstrap'
import React, { useEffect } from 'react'
import { identity, pickBy } from 'lodash'

import { Formik } from 'formik'
import PropTypes from 'prop-types'
import Select from 'src/components/UIKit/Select/Select'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ROLES_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'candidate', label: 'Candidate' },
]

const schema = yup.object().shape({
  setting: yup.string().required(),
  value: yup.string().required(),
  active: yup.boolean().required(),
})

const SettingForm = ({ handleSubmit, entity = {} }) => {
  const { t } = useTranslation()
  const { push } = useHistory()

  const form = {
    setting: undefined,
    value: undefined,
    active: true,
    ...entity,
  }

  const handleFormSubmit = async (values) => {
    const payload = {
      ...values,
    }
    return handleSubmit(payload)
  }
  return (
    <div className="mb-5">
      <Row sm="12">
        <Col sm={6} className="mx-auto">
          <Container
            className="bg-white rounded-lg shadow py-4 px-4"
            sm="6"
            style={{ borderRadius: '12px' }}
          >
            <Formik
              validationSchema={schema}
              onSubmit={handleFormSubmit}
              initialValues={form}
              enableReinitialize
            >
              {({
                handleSubmit,
                handleChange,
                values,
                touched,
                errors,
                setValues,
                setErrors,
              }) => {
                const handleChangeOption = (e) => {
                  setValues({
                    ...values,
                    active: e.target.value === 'true' ? true : false,
                  })
                }

                return (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">
                        {t('setting.setting')}
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="text"
                          name="setting"
                          defaultValue={values?.setting}
                          onChange={handleChange}
                          isInvalid={touched.setting && !!errors.setting}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors?.setting}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">
                        {t('setting.value')}
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          as="textarea" 
                          rows={5}
                          name="value"
                          defaultValue={values?.value}
                          onChange={handleChange}
                          isInvalid={touched.value && !!errors.value}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors?.value}
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">
                        {t('setting.active')}
                      </Form.Label>
                      <Col sm="10">
                        <Form.Control
                          as="select"
                          name="active"
                          defaultValue={values?.active}
                          onChange={handleChangeOption}
                          isInvalid={touched.active && !!errors.active}
                        >
                          <option value={true}>{t('common.yes')}</option>
                          <option value={false}>{t('common.no')}</option>
                        </Form.Control>
                      </Col>
                    </Form.Group>

                    <div className="job-positions-footer">
                      <button type="submit" className="btn btn-primary">
                        {t('common.save')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => push('/admin/settings')}
                      >
                        {t('common.back')}
                      </button>
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </Container>
        </Col>
      </Row>
    </div>
  )
}

SettingForm.propTypes = {
  handleSubmit: PropTypes.func,
  entity: PropTypes.any,
}

export default SettingForm
