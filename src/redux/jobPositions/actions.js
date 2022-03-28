import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

import {
  getJobPositionList,
  getJobPositionDetails,
  postJobPosition,
  putJobPosition,
  deleteJobPosition,
} from '../../services/jobPositionsSvc'

import {
  GET_JOB_POSITION_LIST,
  GET_JOB_POSITION_DETAILS,
  PUT_JOB_POSITION,
  DELETE_JOB_POSITION,
  POST_JOB_POSITION,
  RESET_JOB_POSITION_STATE,
} from './constants'

export const resetJobPositionStateAct = createAction(RESET_JOB_POSITION_STATE)

export const getJobPositionListAct = createAsyncThunk(
  GET_JOB_POSITION_LIST,
  async (params) => {
    try {
      const resp = await getJobPositionList(params)
      return resp
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postJobPositionAct = createAsyncThunk(
  POST_JOB_POSITION,
  async (payload) => {
    try {
      const resp = await postJobPosition(payload)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const getJobPositionDetailsAct = createAsyncThunk(
  GET_JOB_POSITION_DETAILS,
  async (jobPositionId) => {
    try {
      const resp = await getJobPositionDetails(jobPositionId)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const putJobPositionAct = createAsyncThunk(
  PUT_JOB_POSITION,
  async (payload) => {
    try {
      const resp = await putJobPosition(payload)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const deleteJobPositionAct = createAsyncThunk(
  DELETE_JOB_POSITION,
  async (params) => {
    try {
      const { id, ...filter } = params
      await deleteJobPosition({ id })
      const resp = await getJobPositionList(filter)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)
