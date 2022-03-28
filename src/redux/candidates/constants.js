const prefix = 'src/redux/candidates/'

export const RESET_CANDIDATES_STATE = `${prefix}reset`
export const GET_CANDIDATES = `${prefix}all/get`
export const GET_CANDIDATE_DETAIL = `${prefix}detail/get`
export const PATCH_CANDIDATE = `${prefix}patch`
export const POST_CANDIDATE_BULK_CREATE_UPLOAD = `${prefix}bulk_create_upload/post`
export const POST_CANDIDATE_BULK_UPDATE_UPLOAD = `${prefix}bulk_update_upload/post`

export const GET_CANDIDATE_SECTORS = `${prefix}sectors/get`
export const POST_CANDIDATE_SECTORS = `${prefix}sectors/post`
export const PATCH_CANDIDATE_SECTORS = `${prefix}sectors/patch`

export const GET_CANDIDATE_JOB_POSITION_DETAIL = `${prefix}job_position_detail/get`

export const POST_CANDIDATE_ACCEPT_REJECT_OFFER = `${prefix}accept-reject-offer/post`
export const POST_CANDIDATE_ACCEPT_REJECT_TERMS = `${prefix}accept-reject-terms/post`

export const GET_CANDIDATE_ATTACHMENTS = `${prefix}attachments/get`
export const POST_CANDIDATE_ATTACHMENTS = `${prefix}attachments/post`

export const POST_CANDIDATE_SUBMIT_INFORMATION = `${prefix}submit-information/post`
export const POST_CANDIDATE_SUBMIT_ATTACHMENTS = `${prefix}submit-attachments/post`
export const POST_CANDIDATE_SUBMIT_SECTOR_PREFERENCES = `${prefix}submit-sector-preferences/post`
export const POST_CANDIDATE_SUBMIT_PHASE_ONE = `${prefix}submit-phase-one/post`
export const POST_CANDIDATE_SUBMIT_PHASE_TWO = `${prefix}submit-phase-two/post`
export const POST_CANDIDATE = `${prefix}post`
export const PUT_CANDIDATE = `${prefix}put`

export const GET_CANDIDATE_TIME_SLOTS = `${prefix}time-slots/get`
export const POST_CANDIDATE_INTERVIEW_SLOT = `${prefix}interview-slot/post`
export const POST_CANDIDATE_FILE_MATCHED = `${prefix}file-matched/post`

export const POST_PASSED_INTERVIEW = `${prefix}passed-interview/post`
export const POST_PASSED_MEDICAL = `${prefix}passed-medical/post`
export const POST_CONDUCTED_INTERVIEW = `${prefix}conducted-interview/post`
export const POST_CONTRACT_VALIDATED = `${prefix}contract-validated/post`

export const GET_CANDIDATE_ONBOARDING_INSTRUCTIONS = `${prefix}onboarding-instructions/get`
