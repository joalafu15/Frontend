import {
  GET_CANDIDATES,
  GET_CANDIDATE_ATTACHMENTS,
  GET_CANDIDATE_DETAIL,
  GET_CANDIDATE_JOB_POSITION_DETAIL,
  GET_CANDIDATE_SECTORS,
  GET_CANDIDATE_TIME_SLOTS,
  PATCH_CANDIDATE,
  POST_CANDIDATE,
  POST_CANDIDATE_ACCEPT_REJECT_OFFER,
  POST_CANDIDATE_ACCEPT_REJECT_TERMS,
  POST_CANDIDATE_ATTACHMENTS,
  POST_CANDIDATE_BULK_CREATE_UPLOAD,
  POST_CANDIDATE_BULK_UPDATE_UPLOAD,
  POST_CANDIDATE_FILE_MATCHED,
  POST_CANDIDATE_INTERVIEW_SLOT,
  POST_CANDIDATE_SECTORS,
  POST_CANDIDATE_SUBMIT_ATTACHMENTS,
  POST_CANDIDATE_SUBMIT_INFORMATION,
  POST_CANDIDATE_SUBMIT_PHASE_ONE,
  POST_CANDIDATE_SUBMIT_PHASE_TWO,
  POST_CANDIDATE_SUBMIT_SECTOR_PREFERENCES,
  PUT_CANDIDATE,
  RESET_CANDIDATES_STATE,
  POST_PASSED_INTERVIEW,
  POST_PASSED_MEDICAL,
  POST_CONDUCTED_INTERVIEW,
  POST_CONTRACT_VALIDATED,
  GET_CANDIDATE_ONBOARDING_INSTRUCTIONS,
} from './constants'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getCandidateAttachments,
  getCandidateDetails,
  getCandidateDetailsWithRelations,
  getCandidateJobPositionDetails,
  getCandidateList,
  getCandidateSectors,
  getCandidateTimeSlots,
  patchCandidate,
  postCandidate,
  postCandidateAcceptRejectOffer,
  postCandidateAcceptRejectTerms,
  postCandidateAttachments,
  postCandidateBulkCreateUpload,
  postCandidateBulkUpdateUpload,
  postCandidateInterviewSlot,
  postCandidateSectors,
  postCandidateSubmitAttachments,
  postCandidateSubmitInformation,
  postCandidateSubmitPhaseOne,
  postCandidateSubmitPhaseTwo,
  postCandidateSubmitSectorPreferences,
  putCandidate,
  postCandidateFileMatched,
  postPassedInterView,
  postPassedMedical,
  postConductedInterView,
  postContractValidated,
  getCandidateOnboardingInstructions,
} from '../../services/candidatesSvc'

import reduce from 'lodash/reduce'

export const getCandidateListAct = createAsyncThunk(
  GET_CANDIDATES,
  async (params) => {
    try {
      const candidates = await getCandidateList(params)
      return candidates
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postCandidateBulkCreateUploadAct = createAsyncThunk(
  POST_CANDIDATE_BULK_CREATE_UPLOAD,
  async (selectedFile) => {
    try {
      const bulkCreateResp = await postCandidateBulkCreateUpload(selectedFile)
      return bulkCreateResp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postCandidateBulkUpdateUploadAct = createAsyncThunk(
  POST_CANDIDATE_BULK_UPDATE_UPLOAD,
  async (selectedFile) => {
    try {
      const bulkUpdateResp = await postCandidateBulkUpdateUpload(selectedFile)
      return bulkUpdateResp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const getCandidateDetailsAct = createAsyncThunk(
  GET_CANDIDATE_DETAIL,
  async (payload) => {
    try {
      const candidateDetail = await getCandidateDetails(payload)
      return candidateDetail.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const getCandidateDetailsWithRelationsAct = createAsyncThunk(
  GET_CANDIDATE_DETAIL,
  async (candidateId) => {
    try {
      const candidateDetail = await getCandidateDetailsWithRelations(
        candidateId,
      )
      return candidateDetail.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const patchCandidateAct = createAsyncThunk(
  PATCH_CANDIDATE,
  async (payload) => {
    try {
      const updatedCandidate = await patchCandidate(payload)
      return updatedCandidate.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const getCandidateSectorsAct = createAsyncThunk(
  GET_CANDIDATE_SECTORS,
  async (candidateId) => {
    try {
      const resp = await getCandidateSectors(candidateId)
      const listCandidateSectors = reduce(
        resp?.data,
        function (obj, param) {
          obj[param.choice] = param
          return obj
        },
        {},
      )

      return listCandidateSectors
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const getCandidateJobPositionDetailsAct = createAsyncThunk(
  GET_CANDIDATE_JOB_POSITION_DETAIL,
  async (payload) => {
    try {
      const updatedCandidate = await getCandidateJobPositionDetails(payload)
      return updatedCandidate.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postCandidateAcceptRejectTermsAct = createAsyncThunk(
  POST_CANDIDATE_ACCEPT_REJECT_TERMS,
  async ({ candidateId, payload }) => {
    try {
      const resp = await postCandidateAcceptRejectTerms({
        candidateId,
        payload,
      })
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postCandidateSectorsAct = createAsyncThunk(
  POST_CANDIDATE_SECTORS,
  async ({ candidateId, payload }) => {
    try {
      const choices = payload
        .sort((a, b) => a.choice - b.choice)
        .map((c) => c.sectorId)
      const resp = await postCandidateSectors(candidateId, { choices })
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postCandidateAcceptRejectOfferAct = createAsyncThunk(
  POST_CANDIDATE_ACCEPT_REJECT_OFFER,
  async ({ candidateId, payload }) => {
    try {
      const resp = await postCandidateAcceptRejectOffer({
        candidateId,
        payload,
      })
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const getCandidateAttachmentsAct = createAsyncThunk(
  GET_CANDIDATE_ATTACHMENTS,
  async (payload) => {
    try {
      const resp = await getCandidateAttachments(payload)

      const mapResp = reduce(
        resp?.data,
        function (obj, param) {
          obj[param.type] = param
          return obj
        },
        {},
      )

      return mapResp
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const getCandidateOnboardingInstructionsAct = createAsyncThunk(
  GET_CANDIDATE_ONBOARDING_INSTRUCTIONS,
  async (payload) => {
    try {
      const resp = await getCandidateOnboardingInstructions(payload)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postCandidateAttachmentsAct = createAsyncThunk(
  POST_CANDIDATE_ATTACHMENTS,
  async (payload) => {
    try {
      const resp = await postCandidateAttachments(payload)

      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const resetCandidateStateAct = createAction(RESET_CANDIDATES_STATE)

export const postCandidateSubmitInformationAct = createAsyncThunk(
  POST_CANDIDATE_SUBMIT_INFORMATION,
  async (candidateId) => {
    try {
      const resp = await postCandidateSubmitInformation(candidateId)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postCandidateSubmitAttachmentsAct = createAsyncThunk(
  POST_CANDIDATE_SUBMIT_ATTACHMENTS,
  async (candidateId) => {
    try {
      const resp = await postCandidateSubmitAttachments(candidateId)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postCandidateSubmitSectorPreferencesAct = createAsyncThunk(
  POST_CANDIDATE_SUBMIT_SECTOR_PREFERENCES,
  async (candidateId) => {
    try {
      const resp = await postCandidateSubmitSectorPreferences(candidateId)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postCandidateSubmitPhaseOneAct = createAsyncThunk(
  POST_CANDIDATE_SUBMIT_PHASE_ONE,
  async (candidateId) => {
    try {
      const resp = await postCandidateSubmitPhaseOne(candidateId)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postCandidateSubmitPhaseTwoAct = createAsyncThunk(
  POST_CANDIDATE_SUBMIT_PHASE_TWO,
  async (candidateId) => {
    try {
      const resp = await postCandidateSubmitPhaseTwo(candidateId)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postCandidateAct = createAsyncThunk(
  POST_CANDIDATE,
  async (payload) => {
    try {
      const resp = await postCandidate(payload)

      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const putCandidateAct = createAsyncThunk(
  PUT_CANDIDATE,
  async (payload) => {
    try {
      const resp = await putCandidate(payload)

      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const getCandidateTimeSlotsAct = createAsyncThunk(
  GET_CANDIDATE_TIME_SLOTS,
  async (candidateId) => {
    try {
      const resp = await getCandidateTimeSlots(candidateId)

      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postCandidateInterviewSlotAct = createAsyncThunk(
  POST_CANDIDATE_INTERVIEW_SLOT,
  async (payload) => {
    try {
      const resp = await postCandidateInterviewSlot(payload)

      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

/**
 * @params payload
 * @description object with property candidateId and payload
 * @example {candidateId, payload:{ filesMatched: true}}
 */
export const postCandidateFileMatchedAct = createAsyncThunk(
  POST_CANDIDATE_FILE_MATCHED,
  async (payload) => {
    try {
      const resp = await postCandidateFileMatched(payload)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postPassedInterviewAct = createAsyncThunk(
  POST_PASSED_INTERVIEW,
  async (payload) => {
    try {
      const resp = await postPassedInterView(payload)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postPassedMedicalAct = createAsyncThunk(
  POST_PASSED_MEDICAL,
  async (payload) => {
    try {
      const resp = await postPassedMedical(payload)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postConductedInterviewAct = createAsyncThunk(
  POST_CONDUCTED_INTERVIEW,
  async (payload) => {
    try {
      const resp = await postConductedInterView(payload)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postContractValidatedAct = createAsyncThunk(
  POST_CONTRACT_VALIDATED,
  async (payload) => {
    try {
      const resp = await postContractValidated(payload)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)
