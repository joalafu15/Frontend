import React from 'react'

export default function SaudiRegions() {
  return (
    <select id="inputState" className="form-control">
      <option selected>اختر منطقتك</option>
      <option value={'riyadh'}>مدينة الرياض</option>
      <option value={'Dhrama & Mazahmyah'}>ضرمة والمزاحمية</option>
      <option value={'Hafna (Riyadh)'}>حفنا</option>
      <option value={'Ramah (Riyadh)'}>رامة</option>
      <option value={'Nasah (Riyadh)'}>نساح</option>
      <option value={'daryyah'}>الدرعية</option>
      <option value={'kharj'}>الخرج</option>
      <option value={'irqah'}>عرقة</option>
      <option value={'hareeg'}>الحريق</option>
      <option value={'amaryyah'}>العمارية</option>
      <option value={'No Preference'}>لا تفضيل</option>
    </select>
  )
}
