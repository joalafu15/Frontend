import styled from 'styled-components'
import PropTypes from 'prop-types'

const InputFileWrapper = styled.label`
  .custom-file-label {
    ${({ value }) => {
      return (
        value &&
        `
          background-color: #e9ecef;
        `
      )
    }}
  }
  .custom-file-label::after {
    left: 0;
    right: auto;
    border-left-width: 0;
    border-right: inherit;

    ${({ value, readOnly }) => {
      if (readOnly) return 'content: none;';
      return (
        value &&
        `
          background-color: #ff4e4e;
          color: #fff;
          content: "Change";
        `
      )
    }}
  }
`

export default function FileInput({ value, onChange, placeholder, mimeTypes, readOnly }) {
  return (
    <InputFileWrapper className='custom-file' value={value} readOnly={readOnly}>
      <input type='file' className='custom-file-input' onChange={onChange} accept={mimeTypes?.join(",")} readOnly={readOnly} disabled={readOnly} />
      <label className='custom-file-label'>{value || placeholder}</label>
    </InputFileWrapper>
  )
}

FileInput.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
}
