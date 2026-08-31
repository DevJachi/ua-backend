# Ugwu Academy — Backend API

> **GitHub Description:** REST API for an online examination platform — handles user auth, role-based access, exam management, automated scoring, and transactional email notifications.

---

A Node.js/Express backend powering the Ugwu Academy online exam platform. Students register, verify their email, take exams, and receive pass/fail notifications. Admins can create exams and questions using time-limited admin codes to elevate their role.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (Ethereal + Gmail) |
| Dev | Nodemon |

---

## Architecture

```
backend/
├── controllers/      # Business logic (auth, exam, question, totalpoints)
├── db/               # MongoDB connection
├── Mailers/          # Nodemailer transporter configs
├── middleware/       # JWT auth + role/verification guards
├── models/           # Mongoose schemas
├── routes/           # Express route definitions
└── utils/            # Token generation, email senders, code generators
```

The project follows a standard MVC pattern. Routes delegate to controllers, which interact with Mongoose models. Middleware sits between routes and controllers to handle auth and role enforcement.

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/signup` | Register a new user, sends verification email | None |
| POST | `/login` | Login, optionally elevate to admin with a code | None |
| POST | `/verifyEmail` | Verify email with 6-digit code | None |
| POST | `/logout` | Logout | None |

### Exams — `/api/exam`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/addExam` | Create a new exam | Admin JWT |

### Questions — `/api/question`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/:examId/createQuestion` | Add a question to an exam | Admin JWT |

### Scoring — `/api/points`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/:examId/totalPoints` | Submit exam score, triggers pass email if passed | Verified user JWT |

### Admin Codes — `/api/createCode`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/admin-code` | Generate a 60-minute admin access code | None |

---

## Authentication Flow

1. User signs up → hashed password stored, 6-digit verification token emailed via Ethereal
2. User verifies email → account marked verified, JWT cookie set (7-day)
3. Login → JWT returned in response body (1-day expiry)
4. Protected routes read the token from `Authorization: Bearer <token>`

### Admin Elevation

To access admin routes, a user logs in with `loginAsAdmin: true` and a valid `code` from `/api/createCode/admin-code`. If the code is valid and not expired, the user's role is updated to `"admin"`.

---

## Data Models

```
User
 ├─ email, password (hashed), name
 ├─ role: "student" | "admin"
 ├─ isVerified, verificationToken, verificationTokenExpiresAt
 └─ resetPasswordToken, resetPasswordExpiresAt

Exam
 ├─ title, description, duration, passMark
 └─ createdBy → User

Question
 ├─ title, options[], correctAnswer
 └─ exam → Exam

TotalPoint
 ├─ totalPoint
 ├─ user → User
 └─ exam → Exam

AdminCode
 ├─ code (hashed)
 └─ expiresAt (60 min TTL)
```

---

## Email Notifications

Two transports are configured:

- **Ethereal** (`Mailers/mailer.js`) — used for verification emails during development/testing. Outputs a preview URL to the console.
- **Gmail** (`Mailers/passMailer.js`) — used to send the congratulations email when a student's score exceeds the exam's `passMark`. Includes a branded HTML template and banner image attachment.

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3001
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret

# Ethereal (verification emails)
ETHEREAL_USER=your_ethereal_user
ETHEREAL_PASS=your_ethereal_pass

# Gmail (pass notifications)
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password

NODE_ENV=development
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run in development (with hot reload)
npm run dev
```

Server starts on `http://localhost:3001` by default.
