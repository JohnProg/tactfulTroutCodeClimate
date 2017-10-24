import { gql } from 'react-apollo'

export const fetchMessages = gql`
  query Me {
    me {
      _id
      fullName
      avatar
      ... on Patient {
        boundDetails {
          chatRoom {
            _id
            messages(before: "2098-12-31T16:00:00.000Z") {
              _id
              __typename
              sender {
                _id
                avatar
                fullName
              }
              createdAt
              ... on TextMessage {
                text
              }
              ... on AudioMessage {
                audioUrl
              }
              ... on ImageMessage {
                imageUrl
              }
            }
          }
        }
      }
    }
  }
`

export const subscriptionMessage = gql`
  subscription chatMessageAdded {
    chatMessageAdded {
      _id
      ... on TextMessage {
        text
      }
      ... on ImageMessage {
        imageUrl
      }
      ... on AudioMessage {
        audioUrl
      }
      sender {
        _id
      }
      createdAt
      chatRoom {
        _id
      }
    }
  }
`
