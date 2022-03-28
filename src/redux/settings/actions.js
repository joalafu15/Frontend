import {
  DELETE_SETTING,
  GET_SETTING_DETAIL,
  GET_SETTING_LIST,
  POST_SETTING,
  PUT_SETTING,
  RESET_SETTING_STATE,
} from './constants'
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import {
  deleteSetting,
  getSettingDetails,
  getSettingList,
  postSetting,
  putSetting,
} from '../../services/settingsSvc'

export const resetSettingStateAct = createAction(RESET_SETTING_STATE)

export const getSettingListAct = createAsyncThunk(
  GET_SETTING_LIST,
  async (params) => {
    try {
      const resp = await getSettingList(params)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const postSettingAct = createAsyncThunk(
  POST_SETTING,
  async (payload) => {
    try {
      const resp = await postSetting(payload)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const getSettingDetailAct = createAsyncThunk(
  GET_SETTING_DETAIL,
  async (settingId) => {
    try {
      const resp = await getSettingDetails(settingId)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)

export const putSettingAct = createAsyncThunk(PUT_SETTING, async (payload) => {
  try {
    const resp = await putSetting(payload)
    return resp.data
  } catch (error) {
    return Promise.reject(error?.data?.error)
  }
})

export const deleteSettingAct = createAsyncThunk(
  DELETE_SETTING,
  async (params) => {
    try {
      const { id, ...filter } = params
      await deleteSetting({ id })
      const resp = await getSettingList(filter)
      return resp.data
    } catch (error) {
      return Promise.reject(error?.data?.error)
    }
  },
)
