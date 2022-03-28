import {
  getCandidateAttachmentsAct,
  getCandidateDetailsAct,
  getCandidateJobPositionDetailsAct,
  getCandidateListAct,
  getCandidateSectorsAct,
  getCandidateTimeSlotsAct,
  postCandidateAcceptRejectOfferAct,
  postCandidateAcceptRejectTermsAct,
  postCandidateAct,
  postCandidateAttachmentsAct,
  postCandidateBulkCreateUploadAct,
  postCandidateBulkUpdateUploadAct,
  postCandidateInterviewSlotAct,
  postCandidateSectorsAct,
  postCandidateSubmitPhaseOneAct,
  postCandidateSubmitPhaseTwoAct,
  putCandidateAct,
  resetCandidateStateAct,
  postCandidateFileMatchedAct,
  postPassedInterviewAct,
  postPassedMedicalAct,
  postConductedInterviewAct,
} from './actions'

import { createReducer } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  entity: {},
  entities: [],
  meta: {},
  errors: {},
  bulkCreate: {},
  sectors: [],
  jobPosition: {},
  attachments: [],
}

const candidatesReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(resetCandidateStateAct, (state) => {
      Object.assign(state, initialState)
    })

    // GET candidate list
    .addCase(getCandidateListAct.pending, (state) => {
      state.loading = true
    })
    .addCase(getCandidateListAct.fulfilled, (state, actions) => {
      state.loading = false
      state.entities = actions?.payload?.data
      state.meta = actions?.payload?.meta
    })
    .addCase(getCandidateListAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate bulk create
    .addCase(postCandidateBulkCreateUploadAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postCandidateBulkCreateUploadAct.fulfilled, (state, action) => {
      state.loading = false
      state.bulkCreate = action.payload
    })
    .addCase(postCandidateBulkCreateUploadAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate bulk update
    .addCase(postCandidateBulkUpdateUploadAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postCandidateBulkUpdateUploadAct.fulfilled, (state, action) => {
      state.loading = false
      state.bulkCreate = action.payload
    })
    .addCase(postCandidateBulkUpdateUploadAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // GET candidate details
    .addCase(getCandidateDetailsAct.pending, (state) => {
      state.loading = true
    })
    .addCase(getCandidateDetailsAct.fulfilled, (state, action) => {
      state.loading = false
      state.entity = action.payload
    })
    .addCase(getCandidateDetailsAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // GET candidate job position details
    .addCase(getCandidateJobPositionDetailsAct.pending, (state) => {
      state.loading = true
    })
    .addCase(getCandidateJobPositionDetailsAct.fulfilled, (state, action) => {
      state.loading = false
      state.jobPosition = action.payload
    })
    .addCase(getCandidateJobPositionDetailsAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate accept/reject offer
    .addCase(postCandidateAcceptRejectOfferAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postCandidateAcceptRejectOfferAct.fulfilled, (state) => {
      state.loading = false
      state.jobPosition.jobOfferAccepted = true
    })
    .addCase(postCandidateAcceptRejectOfferAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate accept/reject terms
    .addCase(postCandidateAcceptRejectTermsAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postCandidateAcceptRejectTermsAct.fulfilled, (state) => {
      state.loading = false
      state.jobPosition.jobTermsAccepted = true
    })
    .addCase(postCandidateAcceptRejectTermsAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // GET candidate sectors
    .addCase(getCandidateSectorsAct.pending, (state) => {
      state.loading = true
    })
    .addCase(getCandidateSectorsAct.fulfilled, (state, action) => {
      state.loading = false
      state.sectors = action.payload
    })
    .addCase(getCandidateSectorsAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate sectors
    .addCase(postCandidateSectorsAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postCandidateSectorsAct.fulfilled, (state) => {
      state.loading = false
    })
    .addCase(postCandidateSectorsAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // GET candidate attachments
    .addCase(getCandidateAttachmentsAct.pending, (state) => {
      state.loading = true
    })
    .addCase(getCandidateAttachmentsAct.fulfilled, (state, action) => {
      state.loading = false
      state.attachments = action.payload
    })
    .addCase(getCandidateAttachmentsAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate attachments
    .addCase(postCandidateAttachmentsAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postCandidateAttachmentsAct.fulfilled, (state) => {
      state.loading = false
    })
    .addCase(postCandidateAttachmentsAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate Submit Phase One
    .addCase(postCandidateSubmitPhaseOneAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postCandidateSubmitPhaseOneAct.fulfilled, (state, action) => {
      state.loading = false
    })
    .addCase(postCandidateSubmitPhaseOneAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate Submit Phase two
    .addCase(postCandidateSubmitPhaseTwoAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postCandidateSubmitPhaseTwoAct.fulfilled, (state, action) => {
      state.loading = false
    })
    .addCase(postCandidateSubmitPhaseTwoAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate
    .addCase(postCandidateAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postCandidateAct.fulfilled, (state, action) => {
      state.loading = false
      state.entity = action.payload
    })
    .addCase(postCandidateAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // PUT candidate
    .addCase(putCandidateAct.pending, (state) => {
      state.loading = true
    })
    .addCase(putCandidateAct.fulfilled, (state) => {
      state.loading = false
    })
    .addCase(putCandidateAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // GET candidate time slots
    .addCase(getCandidateTimeSlotsAct.pending, (state) => {
      state.loading = true
    })
    .addCase(getCandidateTimeSlotsAct.fulfilled, (state) => {
      state.loading = false
    })
    .addCase(getCandidateTimeSlotsAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate interview slots
    .addCase(postCandidateInterviewSlotAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postCandidateInterviewSlotAct.fulfilled, (state) => {
      state.loading = false
    })
    .addCase(postCandidateInterviewSlotAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate file matched
    .addCase(postCandidateFileMatchedAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postCandidateFileMatchedAct.fulfilled, (state) => {
      state.loading = false
    })
    .addCase(postCandidateFileMatchedAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate passed interview
    .addCase(postPassedInterviewAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postPassedInterviewAct.fulfilled, (state) => {
      state.loading = false
    })
    .addCase(postPassedInterviewAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate passed medical
    .addCase(postPassedMedicalAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postPassedMedicalAct.fulfilled, (state) => {
      state.loading = false
    })
    .addCase(postPassedMedicalAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST candidate conducted interview
    .addCase(postConductedInterviewAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postConductedInterviewAct.fulfilled, (state) => {
      state.loading = false
    })
    .addCase(postConductedInterviewAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })
})

export default candidatesReducer
