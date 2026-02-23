# Secure Task Management System

A full-stack monorepo managed with **Nx**, featuring a **NestJS API** and an **Angular Dashboard**.

---

## 🚀 Quick Start

### 1. Backend Setup (API)

The API manages the SQLite database and authentication.

**Initialize Environment:**

```bash
cp apps/api/.env.sample apps/api/.env
```

**Configure Variables:**

Open `apps/api/.env` and define your secrets:

| Variable | Description |
|---|---|
| `PORT` | The port the API runs on (e.g., `3000`) |
| `JWT_SECRET` | A strong secret used for signing tokens |

---

### 2. Frontend Setup (Dashboard)

The Angular dashboard relies on a static configuration file for API communication.

**Configure API URL:**

Open `apps/dashboard/public/config/config.json` and ensure it matches your API port:

```json
{
  "apiUrls": {
    "BASE_URL": "http://localhost:3000/",
    "TIMEOUT": 60000
  }
}
```

> **Note:** If you change the `PORT` in your API `.env`, you must update `BASE_URL` here to match.

---

## 🛠 Running the Workspace

**1. Install Dependencies:**

```bash
npm install
```

**2. Start Development Servers** *(run in separate terminal windows)*:

```bash
# Backend
npx nx serve api

# Frontend
npx nx serve dashboard
```

---

## Open Dashboard In Browser
**URL:** `http://localhost:4200`

## 🔐 Default Login Credentials

After seeding, use the following accounts to test different permission levels.

> **Default Password:** `123456` *(or as defined in your seeder)*

| Role | Email | Username |
|---|---|---|
| Owner | `owner@example.com` | `owner` |
| Admin | `admin@example.com` | `admin` |
| Viewer | `viewer@example.com` | `viewer` |
| Viewer | `viewer1@example.com` | `viewer1` |

---

## 📖 API Documentation (Swagger)

Once the API is running, interactive Swagger docs are available at:

**URL:** `http://localhost:3000/docs`

To test protected routes, click the **Authorize** button and paste your JWT Bearer token.

---

## 📋 Useful Nx Commands

| Action | Command |
|---|---|
| Build All | `npx nx run-many -t build` |
| Visualize Project Graph | `npx nx graph` |
| Reset Cache | `npx nx reset` |
| Kill Stuck Node Tasks | `pkill -9 node` |

---

## ⚠️ Common Issues

**CORS Blocked**
Ensure `app.enableCors()` is enabled in `apps/api/src/main.ts`.

**Port Mismatch**
If the API starts on a different port (e.g., `4000`), update both `config.json` and the Swagger URL accordingly.

**Database Path**
The SQLite file is stored at `apps/api/database/database.sqlite`.
