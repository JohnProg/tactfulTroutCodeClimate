import {
  Dimensions,
} from 'react-native'

import { BLOOD_PRESURE_STANDARD } from '../../constants'

export function getLevelByStandard(systolic, diastolic) {
  if (systolic < 89 && diastolic < 59) {
    return BLOOD_PRESURE_STANDARD[5]
  }
  if (systolic >= 180 || diastolic >= 110) {
    return BLOOD_PRESURE_STANDARD[4]
  }
  if (
    (systolic >= 160 && systolic < 180) ||
    (diastolic >= 100 && diastolic < 110)
  ) {
    return BLOOD_PRESURE_STANDARD[3]
  }
  if (
    (systolic >= 140 && systolic < 160) ||
    (diastolic >= 90 && diastolic < 100)
  ) {
    return BLOOD_PRESURE_STANDARD[2]
  }
  if (
    (systolic >= 120 && systolic < 140) ||
    (diastolic >= 80 && diastolic < 90)
  ) {
    return BLOOD_PRESURE_STANDARD[1]
  }
  if (systolic < 120 && diastolic < 80) {
    return BLOOD_PRESURE_STANDARD[0]
  }
}

export function getSystolicLevelByStandard(systolic) {
  if (systolic < 89) {
    return BLOOD_PRESURE_STANDARD[5]
  }
  if (systolic >= 180) {
    return BLOOD_PRESURE_STANDARD[4]
  }
  if (systolic >= 160 && systolic < 180) {
    return BLOOD_PRESURE_STANDARD[3]
  }
  if (systolic >= 140 && systolic < 160) {
    return BLOOD_PRESURE_STANDARD[2]
  }
  if (systolic >= 120 && systolic < 140) {
    return BLOOD_PRESURE_STANDARD[1]
  }
  if (systolic < 120) {
    return BLOOD_PRESURE_STANDARD[0]
  }
}

export function getDiastolicLevelByStandard(diastolic) {
  if (diastolic < 59) {
    return BLOOD_PRESURE_STANDARD[5]
  }
  if (diastolic >= 110) {
    return BLOOD_PRESURE_STANDARD[4]
  }
  if (diastolic >= 100 && diastolic < 110) {
    return BLOOD_PRESURE_STANDARD[3]
  }
  if (diastolic >= 90 && diastolic < 100) {
    return BLOOD_PRESURE_STANDARD[2]
  }
  if (diastolic >= 80 && diastolic < 90) {
    return BLOOD_PRESURE_STANDARD[1]
  }
  if (diastolic < 80) {
    return BLOOD_PRESURE_STANDARD[0]
  }
}

export default function getBPResult({ systolic, diastolic }) {
  return {
    systolicLevel: getSystolicLevelByStandard(systolic),
    diastolicLevel: getDiastolicLevelByStandard(diastolic),
    level: getLevelByStandard(systolic, diastolic),
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width
export const BUTTON_SIZE = WINDOW_WIDTH * 0.67
