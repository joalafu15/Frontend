import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

export default function CustomSelect({
  options,
  isSearchable,
  isClearable,
  isLoading,
  isDisabled,
  defaultValue,
  onChange,
  onInputChange,
  placeholder,
  value,
  isMulti,
  ...props
}) {
  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      defaultValue={defaultValue}
      value={value}
      isDisabled={isDisabled}
      isLoading={isLoading}
      isClearable={isClearable}
      isSearchable={isSearchable}
      placeholder={placeholder}
      name="color"
      options={options}
      onChange={onChange}
      onInputChange={onInputChange}
      isMulti={isMulti}
      components={{
        IndicatorSeparator: () => null,
      }}
      {...props}
    />
  )
}

CustomSelect.defaultProps = {
  isMulti: false,
}

CustomSelect.propTypes = {
  options: PropTypes.array,
  isSearchable: PropTypes.bool,
  isClearable: PropTypes.bool,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
  defaultValue: PropTypes.any,
  value: PropTypes.object,
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
  placeholder: PropTypes.string,
  isMulti: PropTypes.bool,
}
