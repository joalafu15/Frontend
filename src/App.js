import React, { useMemo, lazy, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { createRoutes } from 'src/routes'
import useAuth from 'src/hooks/useAuth'
import { SettingsProvider } from 'src/contexts/settings'

import 'react-toastify/dist/ReactToastify.css'
// import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

const NotFound = lazy(() => import('./views/NotFound/NotFound'))
const LoginPageLayout = lazy(() =>
  import('src/components/Layouts/LoginPageLayout'),
)
const AppBar = lazy(() => import('./components/Appbar'))
const UserLogin = lazy(() => import('./components/Login/Login'))
const CandidateSignUp = lazy(() => import('./components/SignUp/SignUp'))
const Footer = lazy(() => import('./components/Footer/Footer'))
const ResetPassword = lazy(() =>
  import('./components/ResetPassword/ResetPassword'),
)
const CheckInterviewStatus = lazy(() =>
  import('./components/CheckInterviewStatus/CheckInterviewStatus'),
)

function App() {
  const { t } = useTranslation()
  const { userProfile } = useAuth()
  document.title = t('common.appTitle')

  const routes = useMemo(() => createRoutes(userProfile), [userProfile])

  return (
    <div className="App">
      <div className="content">
        <SettingsProvider>
          <Switch>
            <Route path="/" exact>
              <LoginPageLayout>
                <UserLogin />
              </LoginPageLayout>
            </Route>
            <Route path="/sign-up" exact>
              <LoginPageLayout>
                <CandidateSignUp />
              </LoginPageLayout>
            </Route>
            <Route path="/reset-password" exact>
              <LoginPageLayout>
                <ResetPassword />
              </LoginPageLayout>
            </Route>
            <Route path="/mdcl" exact>
              <LoginPageLayout>
                <CheckInterviewStatus />
              </LoginPageLayout>
            </Route>
            {routes.map((route) => (
              <Route
                key={route.name}
                path={route.path}
                component={() => (
                  <>
                    <AppBar />
                    <route.handler />
                  </>
                )}
                exact
              />
            ))}
            <Route
              component={() => (
                <>
                  <AppBar />
                  <NotFound />
                </>
              )}
            />
          </Switch>
        </SettingsProvider>
      </div>
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
    </div>
  )
}

export default App
