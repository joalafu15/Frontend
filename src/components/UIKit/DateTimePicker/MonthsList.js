import React from 'react'

export default function MonthsList({ onChange }) {
  const months = Array.from(new Array(12), (val, index) => index + 1)

  return (
    <select
      id="inputState"
      className="form-control"
      onChange={(e) => onChange('month', e?.target?.value)}
    >
      {months.map((month, index) => {
        return (
          <option key={`month${index}`} value={month}>
            {month}
          </option>
        )
      })}
    </select>
  )
}
