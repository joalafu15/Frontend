import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Col, Form, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'

import './UserForm.css'
import { pickBy, identity } from 'lodash'
import Select from 'src/components/UIKit/Select/Select'

const ROLES_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'candidate', label: 'Candidate' },
  { value: 'committee', label: 'Committee' },
  { value: 'operations', label: 'Operations' },
]

const schema = yup.object().shape({
  name: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().required().email(),
  roles: yup
    .array()
    .of(yup.object().shape({ value: yup.string(), label: yup.string() }))
    .min(1, 'Role is required')
    .max(1, 'Only one role allowed!')
    .required(),
  password: yup.string().required(),
  confirmPassword: yup
    .string()
    .required()
    .test(
      'confirmPassword',
      "Confirm password doesn't match",
      (val, context) => {
        if (context?.parent?.password !== context?.parent?.confirmPassword) {
          return false
        }
        return true
      },
    ),
  administrationId: yup
    .number()
    .test('administrationId', 'AdministrationId is required!', (value, ctx) => {
      if (
        ctx?.parent?.roles?.filter((it) => it.value === 'committee').length >
          0 &&
        !value
      ) {
        return false
      }

      return true
    }),
})

const UserForm = ({ handleSubmit, entity }) => {
  const { t } = useTranslation()
  const { push } = useHistory()

  const form = {
    name: undefined,
    username: undefined,
    email: undefined,
    password: undefined,
    administrationId: undefined,
    confirmPassword: undefined,
    roles: [],
  }

  const handleFormSubmit = async (values) => {
    const { confirmPassword, roles, ...otherFields } = values

    const payload = {
      ...otherFields,
      roles: roles.map((it) => it.value),
    }

    const normalizePayload = pickBy(payload, identity)

    return handleSubmit(normalizePayload)
  }

  return (
    <div className="mb-5">
      <div
        className="container bg-white rounded-lg shadow py-4 px-4"
        sm="6"
        style={{ borderRadius: '12px' }}
      >
        <Formik
          validationSchema={schema}
          onSubmit={handleFormSubmit}
          initialValues={form}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            touched,
            errors,
            setFieldValue,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('usersManagement.name')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    name="name"
                    defaultValue={values?.name}
                    onChange={handleChange}
                    isInvalid={touched.name && !!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.name}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('usersManagement.username')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    name="username"
                    defaultValue={values?.username}
                    onChange={handleChange}
                    isInvalid={touched.username && !!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.username}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('usersManagement.email')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    name="email"
                    defaultValue={values?.email}
                    onChange={handleChange}
                    isInvalid={touched.email && !!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.email}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('usersManagement.roles')}
                </Form.Label>
                <Col sm="10">
                  <Select
                    closeMenuOnSelect={false}
                    defaultValue={[...values?.roles]}
                    isMulti={true}
                    name="roles"
                    options={ROLES_OPTIONS}
                    onChange={(val) => {
                      setFieldValue('roles', [...val])
                    }}
                  />

                  {touched?.roles && errors?.roles && (
                    <div
                      className="invalid-feedback"
                      style={{ display: 'block' }}
                    >
                      {errors?.roles}
                    </div>
                  )}
                </Col>
              </Form.Group>

              {values?.roles.filter((it) => it.value === 'committee').length >
                0 && (
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">
                    {t('usersManagement.administrationId')}
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="number"
                      name="administrationId"
                      defaultValue={values?.administrationId}
                      onChange={handleChange}
                      isInvalid={
                        touched.administrationId && !!errors.administrationId
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors?.administrationId}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              )}
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('usersManagement.password')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="password"
                    name="password"
                    defaultValue={values?.password}
                    onChange={handleChange}
                    isInvalid={touched.password && !!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.password}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('usersManagement.confirmPassword')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    defaultValue={values?.confirmPassword}
                    onChange={handleChange}
                    isInvalid={
                      touched.confirmPassword && !!errors.confirmPassword
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.confirmPassword}
                  </Form.Control.Feedback>
                </Col>
              </Form.Group>
              <div className="job-positions-footer">
                <button type="submit" className="btn btn-primary">
                  {t('common.save')}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => push('/admin/users')}
                >
                  {t('common.back')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

UserForm.propTypes = {
  handleSubmit: PropTypes.func,
  entity: PropTypes.any,
}

export default UserForm
