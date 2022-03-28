import React from 'react'
import './QualificationStages.css'

import LoggedUser from '../LoggedUser'
import PrimaryFilter from './PrimaryFilter'
import RegionFilter from './RegionSelection'
import CityFilter from './CitySelection'
import SchoolFilter from './SchoolSelection'
import { useTranslation } from 'react-i18next'

export default function QualificationStages() {
  const { t } = useTranslation()
  return (
    <div>
      <LoggedUser />
      <div className='qualification-stages-wrapper container'>
        <PrimaryFilter />
        <RegionFilter />
        <CityFilter />
        <SchoolFilter />
      </div>
    </div>
  )
}
