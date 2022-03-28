import React from 'react'

export default function SaudiRegions() {
  return (
    <select id="inputState" className="form-control">
      <option selected>اختاري المدرسة </option>
      <option value={'Elementary-391'}>الابتدائية 391</option>
      <option value={'Elementary-221'}>الابتدائية 221</option>
      <option value={'Elementary-4-Diryyah'}>
        الابتدائية الرابعة في الدرعية
      </option>
      <option value={'KG-384'}>حضانة 384</option>
      <option value={'Hasna-Bnt-Moawyah-Elementary'}>
        ابتدائية حسناء بنت المويع
      </option>
      <option value={'No Preference'}>الابتدائية 109</option>
      <option value={'No Preference'}>الابتدائية 203</option>
      <option value={'No Preference'}> الابتدائية 99</option>
      <option value={'No Preference'}> الابتدائية 56</option>
      <option value={'No Preference'}> الابتدائية 7</option>
      <option value={'No Preference'}>لا تفضيل</option>
    </select>
  )
}
