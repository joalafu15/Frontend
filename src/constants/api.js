const ENVIRONMENTS = {
  authentication: {
    loginAPI: '/users/login',
    activateUsingToken: 'candidates/activate',
    verifyToken: 'candidates/token',
    candidateSendOTP: 'candidates/send-otp',
    candidateSignUp: 'candidates/sign-up',
    verifyNationalId: 'candidates/verify-national-id',
    resetPasswordSendEmail: '/user/reset-password',
    resetPassword: '/user/reset-password/init',
  },
  settings: {
    settingList: '/settings',
  }
}

export default ENVIRONMENTS
