import { getApi, patchApi, postApi, putApi } from './request'
import { saveAs } from 'file-saver'

import utf8 from 'utf8'

export const getCandidateList = async (params = {}) => {
  try {
    const {
      pagination = {},
      order = {},
      where = {},
      include = undefined,
    } = params

    const ordersBy = Object.keys(order).map((it) => `${it} ${order[it]}`)
    const whereIs = {}

    Object.keys(where).map((it) => {
      if (it === 'administrationId' || it === 'nationalIdNumber') {
        return Object.assign(whereIs, {
          [it]: {
            like: `%${utf8.encode(where[it])}%`,
          },
        })
      } else if (it === 'jobPositionId') {
        return Object.assign(whereIs, {
          [it]: {
            eq: where[it],
          },
        })
      } else {
        return Object.assign(whereIs, {
          [it]: {
            neq: where[it],
          },
        })
      }
    })

    const paginationsIs = {
      limit: 10,
      skip: 0,
      ...pagination,
    }

    const objectQuery = {
      ...paginationsIs,
      ...(ordersBy.length > 0 && { order: ordersBy }),
      ...(Object.keys(whereIs).length > 0 && {
        where: whereIs,
      }),
      ...(include && { include }),
    }

    const queryParams = escape(JSON.stringify(objectQuery))
    const [count, items] = await Promise.allSettled([
      getApi(`/candidates/count?filter=${queryParams}`),
      getApi(`/candidates?filter=${queryParams}`),
    ])
    return {
      data: items?.value.data,
      meta: count?.value?.data,
    }
  } catch (error) {
    throw error
  }
}

export const getCandidateDetails = async (payload) => {
  const candidateId =
    typeof payload === 'object' ? payload.candidateId : payload
  const filter = typeof payload === 'object' ? payload.filter : undefined
  return getApi(`/candidates/${candidateId}`, { filter })
}

export const getCandidateDetailsWithRelations = async (candidateId) => {
  const filter = {
    include: [
      'jobPosition',
      'attachments',
      'sector',
      {
        relation: 'sectorPreferences',
        scope: {
          include: [{ relation: 'sector' }],
        },
      },
    ],
  }
  const encodedFilter = encodeURIComponent(JSON.stringify(filter))
  return getApi(`/candidates/${candidateId}?filter=${encodedFilter}`)
}

export const patchCandidate = async (payload) => {
  return patchApi(`/candidates/${payload.id}`, payload)
}

export const postCandidateBulkCreateUpload = async (selectedFile) => {
  const formData = new FormData()
  formData.append('file', selectedFile)
  return postApi('/candidates/bulk-upload', formData, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  })
}

export const postCandidateBulkUpdateUpload = async (selectedFile) => {
  const formData = new FormData()
  formData.append('file', selectedFile)
  return postApi('/candidates/bulk-upload-update', formData, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  })
}

export const getCandidateSectors = async (candidateId) => {
  return getApi(`/candidates/${candidateId}/sector-preferences`)
}

export const postCandidateSectors = async (candidateId, payload) => {
  return postApi(`/candidates/${candidateId}/sector-preferences`, payload)
}

export const getCandidateJobPositionDetails = async (candidateId) => {
  return getApi(`/candidates/${candidateId}/job-position`)
}

export const postCandidateAcceptRejectTerms = ({ candidateId, payload }) => {
  return postApi(`/candidates/${candidateId}/accept-terms`, payload)
}

export const postCandidateAcceptRejectOffer = ({ candidateId, payload }) => {
  return postApi(`/candidates/${candidateId}/accept-offer`, payload)
}

export const getCandidateAttachments = ({ candidateId }) => {
  return getApi(`/candidates/${candidateId}/attachments`)
}

export const downloadCandidateAttachment = async ({
  filename,
  candidateId,
}) => {
  const response = await getApi(
    `/candidates/${candidateId}/attachments/${filename}`,
    null,
    {
      responseType: 'blob',
    },
  )
  saveAs(response.data, filename)
}

export const postCandidateAttachments = ({
  candidateId,
  attachmentType,
  selectedFile,
}) => {
  const formData = new FormData()
  formData.append('file', selectedFile)
  return postApi(
    `/candidates/${candidateId}/attachments/${attachmentType}`,
    formData,
    {
      headers: {
        'content-type': 'multipart/form-data',
      },
    },
  )
}

export const postCandidateSubmitInformation = (candidateId) => {
  return postApi(`/candidates/${candidateId}/submit-information`)
}

export const postCandidateSubmitAttachments = (candidateId) => {
  return postApi(`/candidates/${candidateId}/submit-attachments`)
}

export const postCandidateSubmitSectorPreferences = (candidateId) => {
  return postApi(`/candidates/${candidateId}/submit-sector-preferences`)
}

export const postCandidateSubmitPhaseOne = (candidateId) => {
  return postApi(`/candidates/${candidateId}/submit-phase-one`)
}

export const postCandidateSubmitPhaseTwo = (candidateId) => {
  return postApi(`/candidates/${candidateId}/submit-phase-two`)
}

export const postCandidate = (payload) => {
  return postApi(`/candidates`, payload)
}

export const putCandidate = ({ candidateId, payload }) => {
  return putApi(`/candidates/${candidateId}`, payload)
}

export const getCandidateTimeSlots = (candidateId) => {
  return getApi(`/candidates/time-slots/${candidateId}`)
}

export const postCandidateInterviewSlot = ({ candidateId, payload }) => {
  return postApi(`/candidates/interview-slot/${candidateId}`, payload)
}

export const postPassedInterView = ({ candidateId, payload }) => {
  return postApi(`/candidates/${candidateId}/passed-interview`, payload)
}

export const postPassedMedical = ({ candidateId, payload }) => {
  return postApi(
    `/candidates/${candidateId}/medical-examination-passed`,
    payload,
  )
}

export const postConductedInterView = ({ candidateId, payload }) => {
  return postApi(`/candidates/${candidateId}/conducted-interview`, payload)
}

export const postContractValidated = ({ candidateId, payload }) => {
  return postApi(`/candidates/${candidateId}/contract-validated`, payload)
}

export const getCandidateOnboardingInstructions = (candidateId) => {
  return getApi(`/candidates/${candidateId}/onboarding-instructions`)
}

/**
 * The following section is a workaround requested by Saad.
 *
 * This will be removed and migrated to its own table for versatility,
 * but at a later moment.
 */
// TODO: Remove this workaround
export const getCandidateAvailableSectors = async (candidateId) => {
  return getApi(`/candidates/${candidateId}/available-sectors`)
}
// End of workaround section

/**
 *
 * @param {*} payload  object with property nationalIdNumber
 * @example { nationalIdNumber: "12345678" }
 * @returns
 */
export const postCandidateVerifyInterviewStatus = (payload) => {
  return postApi('/candidates/verify-interview-status', payload)
}

/**
 *
 * @param {*} payload  object with property nationalIdNumber
 * @example { nationalIdNumber: "12345678" }
 * @returns
 */
export const postCandidateFileMatched = ({ candidateId, payload }) => {
  return postApi(`/candidates/${candidateId}/files-matched`, payload)
}
