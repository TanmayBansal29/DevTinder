# DevTinder APIs

## Auth Router
- POST /signup
- POST /login
- POST /logout

## Profile Router
- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/password

## Connections Request Router
Status: ignore, interested, accepted, rejected
- POST /request/send/interested/:userId
- POST /request/send/interested/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/accepted/:requestId

## User Router
- GET /connections
- GET /requests/received
- GET /feed  - Gets you the profile of other users on the platform
