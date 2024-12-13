# messaging-app-api

# Core Features
1. Authorization
2. Sending messages to another user
3. Customizing a user profile
4. User need not to sign in. They can use an anonymous account. We allow this since this is a toy app.

# Desired UI Features
1. Global Users Tab
2. Search Users
3. Click On User Profile, an option to message that user / see user profile
4. Messages Tab, see messaged users
5. Settings Tab, see profile customization options

Given these things, we might need a database that has the following tables (rough sketch):

- [ ] User:
    - ID (IF ID = 1, Then User is anon)
    - FirstName
    - LastName
    - HashedPassword
    - BIO
    - DateJoined
    - Email
    - BirthDate
    - ProfilePicPath
    
- [ ] Message:
    - ID
    - SenderID
    - RecieverID
    - MessageContent
    - DateSent
    - IsRead

TODO
[ ] Auth Route Tests
[ ] 15m epiry to 7d expiry once confident it works in front/back
