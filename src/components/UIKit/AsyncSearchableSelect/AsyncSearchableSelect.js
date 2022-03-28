import React from 'react'
import AsyncSelect from 'react-select/async'
import PropTypes from 'prop-types'

const AsyncSearchableSelect = ({
  handleLoadOptions,
  onChange,
  defaultValue,
  defaultOptions,
  placeholder,
  isLoading,
  ...props
}) => {
  return (
    <AsyncSelect
      defaultValue={defaultValue}
      cacheOptions
      loadOptions={handleLoadOptions}
      onChange={onChange}
      defaultOptions={defaultOptions}
      components={{
        IndicatorSeparator: () => null,
      }}
      isLoading={isLoading || false}
      value={defaultValue}
      placeholder={placeholder}
      {...props}
    />
  )
}
AsyncSearchableSelect.defaultProps = {
  placeholder: 'type to search...',
}

AsyncSearchableSelect.propTypes = {
  handleLoadOptions: PropTypes.func,
  onChange: PropTypes.func,
  defaultValue: PropTypes.object,
  defaultOptions: PropTypes.array,
  placeholder: PropTypes.string,
  isLoading: PropTypes.bool,
}

export default AsyncSearchableSelect
