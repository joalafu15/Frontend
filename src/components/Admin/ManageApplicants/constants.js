export const FILTER_PERPAGE_OPTIONS = [
  { label: 'manageApplicants.show100Pages', value: 100 },
  { label: 'manageApplicants.show500Pages', value: 500 },
  { label: 'manageApplicants.show1000Pages', value: 1000 },
]

export const FILTER_SORT_OPTIONS = [
  { label: 'manageApplicants.ascending', value: 'ASC' },
  { label: 'manageApplicants.descending', value: 'DESC' },
]

export const INITIAL_FILTER = {
  pagination: {
    limit: 100,
  },
  order: {
    gpa: 'ASC',
    qiyasScore: 'ASC',
  },
  where: {},
}
