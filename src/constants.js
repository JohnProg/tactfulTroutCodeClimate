const DeviceInfo = require('react-native-device-info')

export const WX_APP_ID = 'wx5abe8dda3e79f3b6'
export const PRIMARY_COLOR = '#00b792'
export const BACKGROUND_COLOR = '#CCC'
export const THEME = {
  PRIMARY_COLOR,
  BACKGROUND_COLOR,
}

export const ASYNC_STORAGE_JWT_KEY = 'com.ihealth.tactful-trout.jwt'
export const ASYNC_STORAGE_SAVED_MAC_KEY = 'com.ihealth.tactful-trout.savedMac'
export const ASYNC_STORAGE_ENV_KEY = 'com.ihealth.tactful-trout.environment'

export const BLOOD_PRESURE_STANDARD = [
  { id: 0, color: '#4caf50', text: '理想血压', description: '正常血压 <120 和  <80' },
  {
    id: 1,
    color: '#ffbf00',
    text: '正常高值血压',
    description: '正常高值血压 120-139 和（或）80-90',
  },
  {
    id: 2,
    color: '#fb8c00',
    text: '一级高血压',
    description: '一级高血压（轻度）140-159 和（或）90-99',
  },
  {
    id: 3,
    color: '#d32f2f',
    text: '二级高血压',
    description: '二级高血压（中度）160-179 和（或）100-109',
  },
  {
    id: 4,
    color: '#880e4f',
    text: '三级高血压',
    description: '三级高血压（重度）≥180 和（或）≥110',
  },
  { id: 5, color: '#64b5f6', text: '低血压', description: '低血压 <89 和 <59' },
]
