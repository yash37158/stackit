# StackIt API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Responses
All endpoints may return these error responses:
```json
{
  "message": "Error message description"
}
```
Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Authentication Endpoints

### Register User
```
POST /auth/register
```
Request Body:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "johndoe"
}
```
Response (201):
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user"
  }
}
```

### Login
```
POST /auth/login
```
Request Body:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
Response (200):
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "johndoe",
    "role": "user"
  }
}
```

## Questions

### Get All Questions
```
GET /questions
```
Query Parameters:
- page (optional, default: 1)
- limit (optional, default: 10)
- tag (optional) - Filter by tag name

Response (200):
```json
{
  "questions": [
    {
      "id": "question_id",
      "title": "Question title",
      "description": "Question description",
      "viewCount": 0,
      "author": {
        "id": "user_id",
        "username": "johndoe"
      },
      "tags": [
        {
          "id": "tag_id",
          "name": "javascript"
        }
      ],
      "createdAt": "2024-03-12T10:00:00Z",
      "updatedAt": "2024-03-12T10:00:00Z"
    }
  ],
  "total": 100,
  "currentPage": 1,
  "totalPages": 10
}
```

### Get Single Question
```
GET /questions/:id
```
Response (200):
```json
{
  "id": "question_id",
  "title": "Question title",
  "description": "Question description",
  "viewCount": 1,
  "author": {
    "id": "user_id",
    "username": "johndoe"
  },
  "tags": [
    {
      "id": "tag_id",
      "name": "javascript"
    }
  ],
  "answers": [
    {
      "id": "answer_id",
      "content": "Answer content",
      "isAccepted": false,
      "author": {
        "id": "user_id",
        "username": "janedoe"
      },
      "votes": [
        {
          "id": "vote_id",
          "type": "upvote",
          "user": {
            "id": "user_id",
            "username": "voter"
          }
        }
      ],
      "createdAt": "2024-03-12T11:00:00Z",
      "updatedAt": "2024-03-12T11:00:00Z"
    }
  ],
  "createdAt": "2024-03-12T10:00:00Z",
  "updatedAt": "2024-03-12T10:00:00Z"
}
```

### Create Question (Protected)
```
POST /questions
```
Request Body:
```json
{
  "title": "How to use TypeScript with React?",
  "description": "I'm trying to set up a new React project with TypeScript...",
  "tagIds": ["tag_id1", "tag_id2"]
}
```
Response (201):
```json
{
  "id": "question_id",
  "title": "How to use TypeScript with React?",
  "description": "I'm trying to set up a new React project with TypeScript...",
  "author": {
    "id": "user_id",
    "username": "johndoe"
  },
  "tags": [
    {
      "id": "tag_id1",
      "name": "typescript"
    },
    {
      "id": "tag_id2",
      "name": "react"
    }
  ],
  "createdAt": "2024-03-12T10:00:00Z",
  "updatedAt": "2024-03-12T10:00:00Z"
}
```

### Update Question (Protected)
```
PUT /questions/:id
```
Request Body:
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "tagIds": ["tag_id1", "tag_id2"]
}
```
Response (200): Returns updated question object

### Delete Question (Protected)
```
DELETE /questions/:id
```
Response (200):
```json
{
  "message": "Question deleted successfully"
}
```

## Answers

### Create Answer (Protected)
```
POST /answers
```
Request Body:
```json
{
  "questionId": "question_id",
  "content": "This is my answer..."
}
```
Response (201): Returns created answer object

### Update Answer (Protected)
```
PUT /answers/:id
```
Request Body:
```json
{
  "content": "Updated answer content"
}
```
Response (200): Returns updated answer object

### Delete Answer (Protected)
```
DELETE /answers/:id
```
Response (200):
```json
{
  "message": "Answer deleted successfully"
}
```

### Accept Answer (Protected)
```
POST /answers/:id/accept
```
Response (200): Returns updated answer object with isAccepted=true

### Vote on Answer (Protected)
```
POST /answers/:id/vote
```
Request Body:
```json
{
  "type": "upvote" // or "downvote"
}
```
Response (200): Returns vote object or "Vote removed" message

## Tags

### Get All Tags
```
GET /tags
```
Response (200):
```json
[
  {
    "id": "tag_id",
    "name": "javascript",
    "description": "JavaScript programming language",
    "createdAt": "2024-03-12T10:00:00Z",
    "updatedAt": "2024-03-12T10:00:00Z"
  }
]
```

### Get Popular Tags
```
GET /tags/popular
```
Query Parameters:
- limit (optional, default: 10)

Response (200):
```json
[
  {
    "id": "tag_id",
    "name": "javascript",
    "description": "JavaScript programming language",
    "questionCount": 150
  }
]
```

### Create Tag (Admin Only)
```
POST /tags
```
Request Body:
```json
{
  "name": "typescript",
  "description": "TypeScript programming language"
}
```
Response (201): Returns created tag object

### Update Tag (Admin Only)
```
PUT /tags/:id
```
Request Body:
```json
{
  "name": "updated-name",
  "description": "Updated description"
}
```
Response (200): Returns updated tag object

### Delete Tag (Admin Only)
```
DELETE /tags/:id
```
Response (200):
```json
{
  "message": "Tag deleted successfully"
}
```

## Rich Text Editor Features
The API supports the following rich text features in questions and answers:
- Bold text
- Italic text
- Strikethrough
- Numbered lists
- Bullet points
- Emoji insertion
- Hyperlink insertion
- Image upload
- Text alignment (left, center, right)

For image uploads in rich text:
1. Images should be sent as base64 strings within the content
2. The server will automatically detect and process these images
3. Images will be uploaded to Cloudinary
4. The content will be updated with the Cloudinary URLs

## Rate Limiting and Security
- API requests are limited to prevent abuse
- JWT tokens expire after 24 hours
- CORS is enabled for frontend integration
- Helmet is used for additional security headers 