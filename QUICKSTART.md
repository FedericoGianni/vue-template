# Quick Start Guide

Get up and running in 5 minutes - fully reproducible setup!

## Prerequisites

- Docker & Docker Compose

## Option 1: Docker (Fully Reproducible)

Everything pre-configured: Vue app, Keycloak, PostgreSQL, and test user.

### Step 1: Clone and Start

```bash
# Clone the repository
git clone <your-repo-url>
cd vue-template

# Start all services
# This builds the Vue app inside Docker with pre-configured env vars
docker-compose up -d --build
```

### Step 2: Configure Keycloak

```bash
# Wait 30 seconds for Keycloak to start, then run:
./keycloak-setup.sh
```

This script automatically:
- Creates the `vue-app` realm
- Configures the `vue-template` client (PKCE enabled)
- Creates test user `demo/demo`

### Step 3: Access

- **Vue App**: http://localhost:8080
- **Keycloak Admin**: http://localhost:8081

### Step 4: Login

Use the test credentials:
- Username: `demo`
- Password: `demo`

**That's it!** 🎉 Everything is pre-configured and reproducible.

---

### Environment Variables

All Keycloak settings are **pre-configured in `docker-compose.yml`**:
- `VITE_KEYCLOAK_URL`: http://localhost:8081
- `VITE_KEYCLOAK_REALM`: vue-app
- `VITE_KEYCLOAK_CLIENT_ID`: vue-template

No manual `.env` configuration needed for Docker setup!

### Rebuilding

If you modify Keycloak settings in `docker-compose.yml`:
```bash
docker-compose up -d --build app
```

## Option 2: Local Development

For active development with hot reload (requires Node.js 18+).

```bash
# 1. Install dependencies
npm install

# 2. Start Keycloak & PostgreSQL only
docker-compose up keycloak postgres -d

# 3. Wait 30 seconds, then configure Keycloak
./keycloak-setup.sh

# 4. Start dev server (uses .env file)
npm run dev

# 5. Open http://localhost:3000
```

The `.env` file is already configured for Docker Keycloak!

---

## Credentials

### Test User (for Vue app login)
- Username: `demo`
- Password: `demo`

### Keycloak Admin Console
- URL: http://localhost:8081
- Username: `admin`
- Password: `admin`