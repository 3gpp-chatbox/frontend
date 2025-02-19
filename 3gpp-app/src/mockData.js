// -------------- Mock data for testing the UI before backend integration --------------
export const MOCK_PROCEDURES = [
  {
    id: '1',
    name: 'Registration Procedure',
    description: 'Handles UE registration with the network'
  },
  {
    id: '2',
    name: 'Deregistration Procedure',
    description: 'Manages UE deregistration from the network'
  },
  {
    id: '3',
    name: 'Authentication Procedure',
    description: 'Handles security authentication between UE and network'
  }
]

export const MOCK_DIAGRAMS = {
  1: `graph TD;
    1[Registration Procedure]
    2[Registration Request]
    3[Registration Accept]
    4[Registration Complete]
    1-->|SENDS|2
    2-->|TRIGGERS|3
    3-->|FOLLOWED_BY|4`,
  2: `graph TD
    1[Deregistration Procedure]
    2[Deregistration Request]
    3[Deregistration Accept]
    4[Deregistration Complete]
    1-->|SENDS|2
    2-->|TRIGGERS|3
    3-->|FOLLOWED_BY|4`,
  3: `graph TD
    1[Authentication Procedure]
    2[Authentication Request]
    3[Authentication Response]
    4[Authentication Success]
    5[Authentication Failure]
    1-->|SENDS|2
    2-->|TRIGGERS|3
    3-->|FOLLOWED_BY|4`
}
