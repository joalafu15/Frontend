import React from 'react'

export default function daysList({ onChange }) {
  const days = Array.from(new Array(31), (val, index) => index + 1)

  return (
    <select
      id="inputState"
      className="form-control"
      onChange={(e) => onChange('date', e?.target?.value)}
    >
      {days.map((day, index) => {
        return (
          <option key={`day${index}`} value={day}>
            {day}
          </option>
        )
      })}
    </select>
  )
}
