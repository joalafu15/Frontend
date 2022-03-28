import authUtil from 'src/utils/authUtils'
import { lazy } from 'react'

const UnAuthorized = lazy(() => import('./views/UnAuthorized/UnAuthorized'))
const MainDashboard = lazy(() =>
  import('./components/Applicants/MainDashboard/MainDashboard'),
)
const JobDescription = lazy(() =>
  import('./components/Applicants/JobDescription/JobDescription'),
)
const JobOffer = lazy(() => import('./components/Applicants/JobOffer/JobOffer'))
const ApplicantData = lazy(() =>
  import('./components/Applicants/ApplicantData/ApplicantData'),
)
const ApplicantDocs = lazy(() =>
  import('./components/Applicants/ApplicantDocs/ApplicantDocs'),
)
const ApplicantRegion = lazy(() =>
  import('./components/Applicants/ApplicantRegion/ApplicantRegion'),
)
const ApplicantCity = lazy(() =>
  import('./components/Applicants/ApplicantCity/ApplicantCity'),
)
const ApplicantInterview = lazy(() =>
  import('./components/Applicants/ApplicantInterview/ApplicantInterview'),
)
const ApplicantSchool = lazy(() =>
  import('./components/Applicants/ApplicantSchool/ApplicantSchool'),
)

const AdminDashboard = lazy(() =>
  import('./components/Admin/MainDashboard/AdminDashboard'),
)
const QualificationStages = lazy(() =>
  import('./components/Admin/QualificationStages/QualificationStages'),
)
const ManageApplicants = lazy(() =>
  import('./components/Admin/ManageApplicants/ManageApplicants'),
)
const CandidateCreate = lazy(() =>
  import('./components/Admin/ManageApplicants/CandidateCreate'),
)
const CandidateEdit = lazy(() =>
  import('./components/Admin/ManageApplicants/CandidateEdit'),
)
const ContractOnboarding = lazy(() =>
  import('./components/Admin/ManageApplicants/ContractOnboardingStage'),
)
const SystemManagement = lazy(() =>
  import('./components/Admin/SystemManagement/SystemManagement'),
)
const JobPositionCreate = lazy(() =>
  import('./components/Admin/ManageJobPositions/JobPositionCreate'),
)
const JobPositionEdit = lazy(() =>
  import('./components/Admin/ManageJobPositions/JobPositionEdit'),
)
const BulkCreateCandidate = lazy(() =>
  import('./components/Admin/BulkCreateCandidate/BulkCreateCandidate'),
)
const BulkUpdateCandidate = lazy(() =>
  import('./components/Admin/BulkUpdateCandidate/BulkUpdateCandidate'),
)
const JobPositions = lazy(() =>
  import('./components/Admin/ManageJobPositions/JobPositionsList'),
)
const UserList = lazy(() =>
  import('./components/Admin/UserManagement/UserList'),
)
const UserCreate = lazy(() =>
  import('./components/Admin/UserManagement/UserCreate'),
)
const SettingsList = lazy(() =>
  import('./components/Admin/Settings/SettingsList'),
)

const SettingCreate = lazy(() =>
  import('./components/Admin/Settings/SettingCreate'),
)

const SettingEdit = lazy(() =>
  import('./components/Admin/Settings/SettingEdit'),
)

const ApplicantContract = lazy(() =>
  import('./components/Applicants/ApplicantContract/ApplicantContract'),
)

const routes = [
  {
    name: 'main',
    path: '/main',
    handler: MainDashboard,
    role: ['candidate'],
  },
  {
    name: 'jobDescription',
    path: '/job-description',
    handler: JobDescription,
    role: ['candidate'],
  },
  {
    name: 'jobOffer',
    path: '/job-offer',
    handler: JobOffer,
    role: ['candidate'],
  },
  {
    name: 'applicantData',
    path: '/applicant-data',
    handler: ApplicantData,
    role: ['candidate'],
  },
  {
    name: 'applicantDocs',
    path: '/applicant-documents',
    handler: ApplicantDocs,
    role: ['candidate'],
  },
  {
    name: 'applicantRegion',
    path: '/applicant-region',
    handler: ApplicantRegion,
    role: ['candidate'],
  },
  {
    name: 'applicantCity',
    path: '/applicant-city',
    handler: ApplicantCity,
    role: ['candidate'],
  },
  {
    name: 'applicantInterview',
    path: '/applicant-interview',
    handler: ApplicantInterview,
    role: ['candidate'],
  },
  {
    name: 'applicantSchool',
    path: '/applicant-school',
    handler: ApplicantSchool,
    role: ['candidate'],
  },
  {
    name: 'applicantContract',
    path: '/applicant-contract',
    handler: ApplicantContract,
    role: ['candidate'],
  },
  {
    name: 'mainAdmin',
    path: '/admin',
    handler: AdminDashboard,
    role: ['admin'],
  },
  {
    name: 'manageApplicant',
    path: '/admin/candidates',
    handler: ManageApplicants,
    role: ['admin', 'operations', 'committee'],
  },
  {
    name: 'candidateCreate',
    path: '/admin/candidates/create',
    handler: CandidateCreate,
    role: ['admin', 'operations'],
  },
  {
    name: 'adminCandidateBulkCreate',
    path: '/admin/candidates/bulk-create',
    handler: BulkCreateCandidate,
    role: ['admin', 'operations'],
  },
  {
    name: 'adminCandidateBulkUpdate',
    path: '/admin/candidates/bulk-update',
    handler: BulkUpdateCandidate,
    role: ['admin', 'operations'],
  },
  {
    name: 'candidateEdit',
    path: '/admin/candidates/:candidateId',
    handler: CandidateEdit,
    role: ['admin', 'operations', 'committee'],
  },
  {
    name: 'qualificationStages',
    path: '/admin/qualification-stages',
    handler: QualificationStages,
    role: ['admin'],
  },
  {
    name: 'systemManagement',
    path: '/admin/system-management',
    handler: SystemManagement,
    role: ['admin'],
  },
  {
    name: 'contractOnboarding',
    path: '/admin/contract-onboarding',
    handler: ContractOnboarding,
    role: ['admin'],
  },
  {
    name: 'adminJobPositionCreate',
    path: '/admin/job-positions/create',
    handler: JobPositionCreate,
    role: ['admin'],
  },
  {
    name: 'adminJobPositionEdit',
    path: '/admin/job-positions/:jobPositionId',
    handler: JobPositionEdit,
    role: ['admin'],
  },
  {
    name: 'adminJobPositionList',
    path: '/admin/job-positions',
    handler: JobPositions,
    role: ['admin'],
  },
  {
    name: 'usersList',
    path: '/admin/users',
    handler: UserList,
    role: ['admin'],
  },
  {
    name: 'usersCreate',
    path: '/admin/users/create',
    handler: UserCreate,
    role: ['admin'],
  },
  {
    name: 'settingsList',
    path: '/admin/settings',
    handler: SettingsList,
    role: ['admin'],
  },
  {
    name: 'settingCreate',
    path: '/admin/settings/create',
    handler: SettingCreate,
    role: ['admin'],
  },
  {
    name: 'settingEdit',
    path: '/admin/settings/:settingId',
    handler: SettingEdit,
    role: ['admin'],
  },
]

const menus = [
  {
    name: '',
    text: '',
    handler: () => {},
    role: ['guest'],
  },
]

export const createRoutes = (user) =>
  routes.map((route) => ({
    name: route?.name,
    path: route?.path,
    handler:
      route?.role && !authUtil.hasRole(user, route?.role)
        ? UnAuthorized
        : route?.handler,
  }))

export const createMenus = (user) =>
  menus.map((menu) => ({
    name: menu?.name,
    text: menu?.text,
    handler: menu?.handler,
    show: menu?.role && authUtil.hasRole(user, menu?.role),
  }))
