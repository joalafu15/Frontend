import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Dot = styled.span`
  background-color: ${({ disable }) => (disable ? '#999999' : '#1066ff')};
  padding: 5px;
  border-radius: 50%;
  color: #fff;
  width: 22px;
  height: 22px;
  font-size: 11.5px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
`

const Badge = ({ style, content, disable }) => {
  return (
    <Dot style={style} disable={disable}>
      {content}
    </Dot>
  )
}

Badge.propTypes = {
  style: PropTypes.object,
  content: PropTypes.any,
  disable: PropTypes.bool,
}

export default Badge
