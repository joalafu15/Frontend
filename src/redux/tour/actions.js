import { createAction } from '@reduxjs/toolkit'

import { Storage } from 'src/services/storage'

import { OPEN_TOUR, DISMISS_TOUR, GET_TOUR_HISTORY } from './constants'

export const getTourHistoryAct = createAction(GET_TOUR_HISTORY, () => {
  const resp = localStorage.getItem('userTour')
  if (resp) {
    return { payload: JSON.parse(resp) }
  } else {
    return { payload: {} }
  }
})

export const openTourAct = createAction(OPEN_TOUR, (payload) => {
  Storage.setItem('userTour', payload)
  return { payload }
})

export const dismissTourAct = createAction(DISMISS_TOUR, (payload) => {
  Storage.setItem('userTour', payload)
  return { payload }
})
