import { useState } from 'react'

import DaysList from './DaysList'
import MonthsList from './MonthsList'
import YearsList from './YearsList'

export default function SimpleDatePicker({ onChange }) {
  const [date, setDate] = useState({})
  const handleChange = (name, val) => {
    setDate({ ...date, [name]: val })
    return onChange({ ...date, [name]: val })
  }

  return (
    <div className="form-row select-dof">
      <div className="form-group col-md-4">
        <DaysList onChange={handleChange} />
      </div>
      <div className="form-group col-md-4">
        <MonthsList onChange={handleChange} />
      </div>
      <div className="form-group col-md-4">
        <YearsList onChange={handleChange} />
      </div>
    </div>
  )
}
