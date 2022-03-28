import { createReducer } from '@reduxjs/toolkit'

import { getTourHistoryAct, dismissTourAct, openTourAct } from './actions'

const initialState = {
  step: { lastStep: 0, dismissed: false },
}

const tourReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(getTourHistoryAct, (state, action) => {
      state.step = { ...state.step, ...action?.payload }
    })
    .addCase(dismissTourAct, (state, action) => {
      state.step = { ...state.step, ...action?.payload }
    })
    .addCase(openTourAct, (state, action) => {
      state.step = { ...state.step, ...action?.payload }
    })
})

export default tourReducer
