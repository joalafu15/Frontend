import React from 'react'

export default function YearsList({ onChange }) {
  const year = new Date().getFullYear()
  const years = Array.from(new Array(100), (val, index) => year - index)

  return (
    <select
      id="inputState"
      className="form-control"
      onChange={(e) => onChange('year', e?.target?.value)}
    >
      {years.map((year, index) => {
        return (
          <option key={`year${index}`} value={year}>
            {year}
          </option>
        )
      })}
    </select>
  )
}
