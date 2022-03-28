import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Container, Col, Form, Row } from 'react-bootstrap'

import './JobPositionForm.css'
import { pickBy, identity } from 'lodash'

const JobPositionForm = ({ handleSubmit, entity }) => {
  const { t } = useTranslation()
  const { push } = useHistory()
  const { jobPositionId } = useParams()

  const [form, setForm] = React.useState({
    id: undefined,
    title: undefined,
    description: undefined,
    terms: undefined,
    salaryDescription: undefined,
    contractDuration: undefined,
    expectedJoiningDate: undefined,
    basicSalary: undefined,
    housing: undefined,
    transportation: undefined,
    totalSalary: undefined,
    gosi: undefined,
    netSalary: undefined,
    vacationDays: undefined,
    medicalInsurance: undefined,
    contractPeriod: undefined,
    salaryNotice: undefined, //textarea
    offerNotice: undefined,
  })

  const handleFormSubmit = async () => {
    const { id, ...otherFields } = form
    const payload = {
      ...otherFields,
      ...(jobPositionId && { id: Number(jobPositionId) }),
    }
    const normalizePayload = pickBy(payload, identity)

    return handleSubmit(normalizePayload)
  }

  const handleInputChange = (name, val) => {
    setForm({
      ...form,
      [name]: val,
    })
  }

  useEffect(() => {
    if (entity) {
      setForm({ ...entity })
    }
  }, [entity])

  return (
    <div className="mb-5">
      <Row sm="12">
        <Col>
          <Container
            className="bg-white rounded-lg shadow py-4 px-4"
            sm="6"
            style={{ borderRadius: '12px' }}
          >
            <Form>
              {form?.id && (
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm="2">
                    {t('jobPosition.id')}
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control type="text" value={form?.id} readOnly />
                  </Col>
                </Form.Group>
              )}

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.title')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={form?.title}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('title', val)
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.description')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    as="textarea"
                    value={form?.description}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('description', val)
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.terms')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    as="textarea"
                    value={form?.terms}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('terms', val)
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.salaryDescription')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={form?.salaryDescription}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('salaryDescription', val)
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.contractDuration')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={form?.contractDuration}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('contractDuration', val)
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.expectedJoiningDate')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={form?.expectedJoiningDate}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('expectedJoiningDate', val)
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.basicSalary')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="number"
                    value={form?.basicSalary}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('basicSalary', Number(val))
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.housing')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="number"
                    value={form?.housing}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('housing', Number(val))
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.transportation')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="number"
                    value={form?.transportation}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('transportation', Number(val))
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.totalSalary')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="number"
                    value={form?.totalSalary}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('totalSalary', Number(val))
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.gosi')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="number"
                    value={form?.gosi}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('gosi', Number(val))
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.netSalary')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="number"
                    value={form?.netSalary}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('netSalary', Number(val))
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.vacationDays')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={form?.vacationDays}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('vacationDays', val)
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.medicalInsurance')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={form?.medicalInsurance}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('medicalInsurance', val)
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.contractPeriod')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={form?.contractPeriod}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('contractPeriod', val)
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.salaryNotice')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={form?.salaryNotice}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('salaryNotice', val)
                    }}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  {t('jobPosition.offerNotice')}
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    value={form?.offerNotice}
                    onChange={(event) => {
                      const val = event?.target?.value
                      handleInputChange('offerNotice', val)
                    }}
                  />
                </Col>
              </Form.Group>
            </Form>
          </Container>
        </Col>
      </Row>
      <div className="job-positions-footer">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleFormSubmit}
        >
          {t('common.save')}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => push('/admin/job-positions')}
        >
          {t('common.back')}
        </button>
      </div>
    </div>
  )
}

JobPositionForm.propTypes = {
  handleSubmit: PropTypes.func,
  entity: PropTypes.any,
}

export default JobPositionForm
