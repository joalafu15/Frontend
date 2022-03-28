import React from 'react'
import PropTypes from 'prop-types'
import cm from 'classnames'
import Badge from 'src/components/UIKit/Badge/Badge'

const StepCard = ({
  disable,
  label,
  onClick,
  icon,
  style,
  stepNumber,
  currentStep,
  ...props
}) => {
  return (
    <div
      {...props}
      style={style}
      className={cm(
        'col-lg module-box',
        currentStep && 'current',
        disable && 'disabled',
      )}
      onClick={onClick}
    >
      <Badge
        style={{ alignSelf: 'flex-start' }}
        disable={disable}
        content={stepNumber}
      />
      {icon}
      <span className="mt-2">{label}</span>
    </div>
  )
}

StepCard.propTypes = {
  disable: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.any,
  stepNumber: PropTypes.any,
}

export default StepCard
