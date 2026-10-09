# HifiGuyz – Language Exchange Chat & Video Calls

HifiGuyz is a full-stack language exchange app. People sign up with the language they speak and the language they're learning, find partners who match, and practice through real-time chat and video calls. Partners can correct each other's messages inline, and the app tracks practice stats and daily streaks.

## Features

- **Authentication**: signup, login and logout with JWT stored in an httpOnly cookie; protected routes on both client and server
- **Onboarding & profiles**: name, bio, native/learning language, location and avatar; editable later from the profile page
- **Partner discovery**: recommended users who aren't already friends
- **Friend system**: send, accept, reject and cancel friend requests, with a badge for incoming requests
- **Real-time chat**: 1-on-1 messaging with typing indicators, reactions and threads (Stream Chat)
- **Message corrections**: suggest a corrected version of a partner's message, shown as a word-by-word diff with an optional note
- **Video calls**: 1-on-1 calls with screen sharing, plus an incoming-call popup to accept or decline (Stream Video)
- **Notifications**: in-app toasts and desktop notifications for new messages and calls when the tab is in the background
- **Practice stats**: messages sent, call minutes, corrections given, and current/longest daily streak
- **Responsive UI**: sidebar on desktop, bottom navigation on mobile

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React 19, Vite, React Router, TanStack Query, Tailwind CSS, daisyUI |
| Backend | Node.js, Express, MongoDB with Mongoose, JWT, bcrypt |
| Real-time | Stream Chat and Stream Video SDKs |

## Project Structure

```
├── backend/
│   └── src/
│       ├── controllers/   # route handlers (auth, users, chat)
│       ├── lib/           # database and Stream setup
│       ├── middleware/    # auth guard
│       ├── models/        # User and FriendRequest schemas
│       ├── routes/
│       └── server.js
├── frontend/
│   └── src/
│       ├── components/    # UI components (chat/, call, forms, layout)
│       ├── context/       # Stream client provider
│       ├── hooks/
│       ├── lib/           # API calls and helpers
│       └── pages/
└── package.json           # root build/start scripts
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) works)
- A free [Stream](https://getstream.io/) account for the chat and video API key and secret

### 1. Clone and install

```bash
git clone https://github.com/rashiaggarwal12/HifiGuyz-chat-application.git
cd HifiGuyz-chat-application
npm install --prefix backend
npm install --prefix frontend
```

### 2. Set up environment variables

Copy the example files and fill in your own values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**`backend/.env`**

| Variable | Description |
|---|---|
| `PORT` | Port for the API server (default `5001`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET_KEY` | Any long random string used to sign login tokens |
| `STREAM_API_KEY` | Stream API key |
| `STREAM_API_SECRET` | Stream API secret |
| `NODE_ENV` | Set to `development` |

**`frontend/.env`**

| Variable | Description |
|---|---|
| `VITE_STREAM_API_KEY` | Same Stream API key as the backend |

### 3. Run in development

In two terminals:

```bash
# terminal 1 – API on http://localhost:5001
cd backend
npm run dev
```

```bash
# terminal 2 – app on http://localhost:5173
cd frontend
npm run dev
```

Then open http://localhost:5173.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create an account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Current user |
| POST | `/api/auth/onboarding` | Complete profile setup |
| GET | `/api/users` | Recommended partners |
| GET | `/api/users/friends` | Friends list |
| PATCH | `/api/users/me` | Update profile |
| POST | `/api/users/activity` | Record practice activity for stats |
| POST | `/api/users/friend-request/:id` | Send a friend request |
| PUT | `/api/users/friend-request/:id/accept` | Accept a request |
| DELETE | `/api/users/friend-request/:id/reject` | Reject a request |
| DELETE | `/api/users/friend-request/:id` | Cancel a sent request |
| GET | `/api/users/friend-requests` | Incoming requests |
| GET | `/api/users/outgoing-friend-requests` | Sent requests |
| GET | `/api/chat/token` | Stream token for the logged-in user |
