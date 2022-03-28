import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'

import useAuth from 'src/hooks/useAuth'

import loginImage from '../../img/login-education-image.svg'
import './LoginPageLayout.css'

const useStyles = makeStyles((theme) => ({
  text: {
    textAlign: 'right',
  },
}))

export default function LoginPageLayout(props) {
  const { push } = useHistory()
  const { userProfile } = useAuth()
  const classes = useStyles()

  if (userProfile && Object.keys(userProfile).length > 0) {
    if (userProfile?.roles?.includes('candidate')) {
      push('/main')
    }
    if (userProfile?.roles?.includes('admin')) {
      push('/admin')
    }
  }

  return (
    <>
      <div className="login__content container-fluid">
        <div className="row">
          <div className="col-lg-7">
            <img src={loginImage} alt="" className="login-image" />
          </div>
          <div className="col-lg-5">
            <div className="loginpage_content-wrapper">{props.children}</div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="col-lg-12">
          <div className={classes.text}>
            <b>من نحن؟</b>
            <p>
              تأسست شركة البلاد للاستشارات والحلول في عام 2006، وهي شركة سعودية متخصصة في الخدمات التشغيلية والإستشارات وتوفير الكوادر السعودية المؤهلة لتحقيق رؤية المملكة 2030 بتوفير فرص وظيفية لمعلمات رياض أطفال ومعلمات صفوف أولية على عقود عمل محددة المدة وذلك للعمل في المدارس الحكومية لدعم الشراكة بين القطاع العام والخاص.
            </p>
            <b>أهداف المشروع</b>
            <p>
تأمين الكوادر البشرية المؤهلة لشغل وظائف معلمات رياض أطفال ومعلمات صفوف أولية على عقود عمل محددة المدة للعمل في المدارس الحكومية حسب احتياجات المناطق التعليمية حول المملكة. يأتي هذا المشروع ضمن مبادرة أشمل وأوسع تسعى إلى زيادة فرص الالتحاق بمرحلة رياض الأطفال لتشمل جميع مناطق المملكة وتحسين جودة التعليم في هذه المرحلة على وجه الخصوص، وتوسيع فرص تعليم الأطفال وتجويد التدريس في مدارس الطفولة المبكرة. ف
            </p>
            <b>عقود عمل محددة المدة</b>
            <p>
سوف يتم توقيع عقود عمل محددة المدة مع الموظفات حسب نظام العمل المعمول به في المملكة العربية السعودية وتحديداً وفق أنظمة القطاع الخاص وسياسات الموارد البشرية للشركة والمعتمدة من وزارة الموارد البشرية والتنمية الاجتماعية.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
