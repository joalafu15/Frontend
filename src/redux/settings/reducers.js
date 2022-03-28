import {
  deleteSettingAct,
  getSettingDetailAct,
  getSettingListAct,
  postSettingAct,
  putSettingAct,
} from './actions'

import { createReducer } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  entity: {},
  entities: [],
  errors: {},
}

const settingReducer = createReducer(initialState, (builder) => {
  builder
    // GET setting list
    .addCase(getSettingListAct.pending, (state) => {
      state.loading = true
    })
    .addCase(getSettingListAct.fulfilled, (state, actions) => {
      state.loading = false
      state.entities = actions.payload
    })
    .addCase(getSettingListAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // POST setting
    .addCase(postSettingAct.pending, (state) => {
      state.loading = true
    })
    .addCase(postSettingAct.fulfilled, (state, actions) => {
      state.loading = false
      state.entity = actions.payload
    })
    .addCase(postSettingAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // PUT setting
    .addCase(putSettingAct.pending, (state) => {
      state.loading = true
    })
    .addCase(putSettingAct.fulfilled, (state, actions) => {
      state.loading = false
      state.entity = actions.payload
    })
    .addCase(putSettingAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // GET setting details
    .addCase(getSettingDetailAct.pending, (state) => {
      state.loading = true
      state.entity = {}
    })
    .addCase(getSettingDetailAct.fulfilled, (state, actions) => {
      state.loading = false
      state.entity = actions.payload
    })
    .addCase(getSettingDetailAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })

    // Delete Setting
    .addCase(deleteSettingAct.pending, (state) => {
      state.loading = true
    })
    .addCase(deleteSettingAct.fulfilled, (state, actions) => {
      state.loading = false
      state.entities = actions.payload
    })
    .addCase(deleteSettingAct.rejected, (state, action) => {
      state.loading = false
      state.errors = action.error
    })
})

export default settingReducer
