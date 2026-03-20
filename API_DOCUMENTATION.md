# BrainLoom API Documentation Specification

## 1. Platform Overview
BrainLoom is a state-of-the-art cybersecurity training platform designed to bridge the gap between theory and practice. Inspired by industry leaders like HackTheBox and TryHackMe, BrainLoom offers a gamified environment where students can master Red Team and Blue Team techniques through structured courses, interactive labs, and real-time simulations.

## 2. Authentication System
BrainLoom implements a secure **JWT (JSON Web Token)** authentication mechanism. 

### Authentication Flow
1. **Registration**: Users create an account via the registration endpoint.
2. **Login**: Users provide credentials to receive a signed JWT.
3. **Authorization**: For all protected routes, the JWT must be provided in the HTTP `Authorization` header.

**Header Format:**
```http
Authorization: Bearer <jwt_token>
```

**JWT Payload Structure:**
```json
{
  "id": 2,
  "role": "student",
  "iat": 1772390195,
  "exp": 1773254195
}
```

## 3. Role Based Access Control (RBAC)
The platform enforces strict role-based permissions to ensure system integrity.

| Feature | Admin | Instructor | Student |
| :--- | :---: | :---: | :---: |
| Access Dashboard | ✔ | ✔ | ✔ |
| Complete Labs | ✘ | ✘ | ✔ |
| Create/Edit Topics | ✔ | ✔ | ✘ |
| Manage Users | ✔ | ✘ | ✘ |
| Upload Assets | ✔ | ✔ | ✘ |
| Post Comments | ✔ | ✔ | ✔ |
| View Global Stats | ✔ | ✔ | ✔ |

---

## 4. API Endpoints

### AUTH APIs
*Base URL: `https://api.brainloom.in/api/auth`*

#### Register User
- **Endpoint**: `/register/user`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
```json
{
  "name": "Bhanu",
  "email": "bhanu@gmail.com",
  "password": "password123"
}
```
- **Success Response (201)**:
```json
{
  "id": "user_98765",
  "message": "User registered successfully"
}
```

#### Login
- **Endpoint**: `/login`
- **Method**: `POST`
- **Auth Required**: No
- **Request Body**:
```json
{
  "as": "user",
  "email": "bhanu@gmail.com",
  "password": "password123"
}
```
- **Success Response (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 2,
    "name": "Bhanu",
    "role": "student",
    "level": 15,
    "xp": 24500,
    "rank": 128
  }
}
```

---

### USER APIs
*Base URL: `/api/user`*

#### Get Profile
- **Endpoint**: `/profile`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response (200)**:
```json
{
  "id": 2,
  "name": "Bhanu",
  "handle": "@bhanu_sec",
  "avatar": "https://...",
  "level": 15,
  "xp": 24500,
  "badges": ["PYTHON_EXPERT", "SHIELD"]
}
```

#### Update Profile
- **Endpoint**: `/profile`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "name": "Bhanu Pratap",
  "avatar": "base64_string_or_url"
}
```

---

### ADMIN APIs
*Base URL: `/api/admin`*

#### Get All Users
- **Endpoint**: `/users`
- **Method**: `GET`
- **Auth Required**: Yes (Admin Only)
- **Description**: Retrieves a paginated list of all registered operatives.

#### Delete User
- **Endpoint**: `/users/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Admin Only)

---

### TOPIC / COURSE APIs
*Base URL: `/api/topic`*

#### List All Topics
- **Endpoint**: `/`
- **Method**: `GET`
- **Auth Required**: Yes
- **Description**: Returns all available learning paths and modules.

#### Create Topic
- **Endpoint**: `/`
- **Method**: `POST`
- **Auth Required**: Yes (Admin/Instructor)
- **Request Body**:
```json
{
  "title": "Advanced SQL Injection",
  "category": "Red Team",
  "difficulty": "HARD",
  "xpReward": 500
}
```

---

### CONTENT BLOCK APIs
*Base URL: `/api/content-block`*

#### Get Blocks for Topic
- **Endpoint**: `/:topicId`
- **Method**: `GET`
- **Auth Required**: Yes

#### Add Content Block
- **Endpoint**: `/`
- **Method**: `POST`
- **Auth Required**: Yes (Admin/Instructor)
- **Description**: Adds a new instructional unit (Text, Code, or Lab) to a topic.

---

### MCQ APIs
*Base URL: `/api/mcq`*

#### Get Questions
- **Endpoint**: `/:blockId`
- **Method**: `GET`
- **Auth Required**: Yes

#### Verify Answer
- **Endpoint**: `/verify`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "questionId": 45,
  "answerIndex": 2
}
```
- **Success Response**:
```json
{
  "correct": true,
  "xpEarned": 50,
  "message": "Correct! XP awarded."
}
```

---

### COMMENT APIs
*Base URL: `/api/comment`*

#### Post Comment
- **Endpoint**: `/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "contentId": "block_101",
  "text": "This lab was challenging but rewarding!"
}
```

---

### FILE UPLOAD APIs
*Base URL: `/api/upload`*

#### Upload Asset
- **Endpoint**: `/`
- **Method**: `POST`
- **Auth Required**: Yes (Admin/Instructor)
- **Format**: `multipart/form-data`
- **Description**: Uploads images or lab files to the BrainLoom storage bucket.

---

## 5. Error Handling
BrainLoom uses standard HTTP status codes to indicate the success or failure of an API request.

| Code | Meaning | Description |
| :--- | :--- | :--- |
| 400 | Bad Request | The request was unacceptable, often due to missing parameters. |
| 401 | Unauthorized | No valid JWT provided. |
| 403 | Forbidden | The JWT is valid, but the user lacks the required role. |
| 404 | Not Found | The requested resource doesn't exist. |
| 500 | Server Error | Something went wrong on BrainLoom's end. |

**Error Response Example:**
```json
{
  "status": "error",
  "code": "MISSING_FIELDS",
  "message": "The 'email' field is required for authentication."
}
```

## 6. Security Best Practices
1. **Rate Limiting**: All public endpoints are limited to 100 requests per 15 minutes per IP to prevent brute-force attacks.
2. **Input Validation**: All incoming data is sanitized using `express-validator` to prevent XSS and SQL Injection.
3. **Secure Headers**: The API uses `helmet.js` to set various security-related HTTP headers.
4. **CORS**: Cross-Origin Resource Sharing is restricted to authorized domains only.
