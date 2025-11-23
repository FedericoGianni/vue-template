# Vue Template

A production-ready Vue 3 template with TypeScript, authentication, and modern tooling.

> **🚀 Want to get started quickly?** See [QUICKSTART.md](./QUICKSTART.md) 

## Project Structure

```
vue-template/
├── public/                     # Static assets
│   ├── vite.svg                # Favicon
│   └── silent-check-sso.html   # Keycloak SSO check
│
├── src/
│   ├── assets/                # Global assets
│   │   └── index.css          # Tailwind imports & CSS variables
│   │
│   ├── components/            # Reusable components
│   │   ├── layout/            # Layout components
│   │   │   └── Sidebar.vue    # Application sidebar with navigation
│   │   └── ui/                # shadcn-vue UI components
│   │       ├── avatar/        # Avatar component
│   │       ├── button/        # Button component
│   │       └── card/          # Card components
│   │
│   ├── lib/                   # Utility libraries
│   │   └── utils.ts           # Helper functions (cn, etc.)
│   │
│   ├── router/                # Vue Router configuration
│   │   └── index.ts           # Routes & navigation guards
│   │
│   ├── services/              # External services
│   │   └── keycloak.ts        # Keycloak authentication service
│   │
│   ├── stores/                 # Pinia stores
│   │   └── auth.ts            # Authentication store
│   │
│   ├── types/                 # TypeScript definitions
│   │   └── auth.ts            # Auth-related types
│   │
│   ├── views/                 # Page components
│   │   ├── Dashboard.vue      # Main dashboard page
│   │   ├── Login.vue          # Login page
│   │   └── NotFound.vue       # 404 page
│   │
│   ├── App.vue                 # Root component
│   └── main.ts                 # Application entry point
│
├── .env.example               # Environment variables template
├── .eslintrc.cjs              # ESLint configuration
├── .gitignore                 # Git ignore rules
├── .prettierrc.json           # Prettier configuration
├── index.html                 # HTML entry point
├── package.json               # Dependencies & scripts
├── postcss.config.js          # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── tsconfig.node.json         # TypeScript config for Node
├── vite.config.ts             # Vite configuration
└── vitest.config.ts           # Vitest configuration
```

## Technologies Used

### Core
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Static type checking
- **Vite** - Next-generation frontend build tool

### State Management & Routing
- **Pinia** - Intuitive state management for Vue
- **Vue Router** - Official routing library

### UI & Styling
- **shadcn-vue** - Beautifully designed components built with Radix Vue
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful & consistent icon toolkit
- **Radix Vue** - Unstyled, accessible UI components

### Authentication
- **Keycloak** - PKCE authentication flow with in-memory refresh tokens

### Development Tools
- **Vitest** - Fast unit testing framework with jsdom
- **Prettier** - Opinionated code formatter
- **ESLint** - Pluggable linting utility
- **TypeScript ESLint** - TypeScript support for ESLint

## Getting Started with NPM

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vue-template
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Keycloak configuration:
```env
VITE_KEYCLOAK_URL=https://your-keycloak-domain.com
VITE_KEYCLOAK_REALM=your-realm
VITE_KEYCLOAK_CLIENT_ID=your-client-id
VITE_APP_TITLE=Vue Template
VITE_API_BASE_URL=https://api.example.com
```

4. Start development server:
```bash
npm run dev
```

5. Open your browser at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Docker Run Guide

### Build and Run

**Important**: Environment variables are baked into the build at compile time.

```bash
# Build the image with build args
docker build -t vue-template \
  --build-arg VITE_KEYCLOAK_URL=http://localhost:8081 \
  --build-arg VITE_KEYCLOAK_REALM=vue-app \
  --build-arg VITE_KEYCLOAK_CLIENT_ID=vue-template \
  --build-arg VITE_APP_TITLE="Vue Template" \
  --build-arg VITE_API_BASE_URL=http://localhost:3000/api \
  .

# Run the container
docker run -d \
  -p 8080:80 \
  --name vue-template \
  vue-template

# Access at http://localhost:8080
```

### Using Docker Compose (with Keycloak)

The docker-compose setup includes:
- **Vue App** - Running on port 8080
- **Keycloak** - Running on port 8081
- **PostgreSQL** - Database for Keycloak

#### Option A: Build Inside Docker (reads from .env)
Docker Compose reads environment variables from your `.env` file automatically.

```bash
# 1. Edit .env file with your settings
# 2. Build and start
docker-compose up -d --build
```

All `VITE_*` variables in `.env` are automatically passed to the build.

#### Option B: Build Locally (using .env file)
Build on your machine using your `.env` file, then deploy.

```bash
# Build locally (uses .env file)
npm install
npm run build

# Deploy to Docker
docker-compose -f docker-compose.local.yml up -d
```

**Why two options?**
- Vite needs env vars at **build time**, not runtime
- `--env-file` only works at runtime, so it won't work for Vite
- Build args (Option A) = env vars available during Docker build
- Local build (Option B) = simpler, uses your `.env` file

Access the services:
- **Vue App**: http://localhost:8080
- **Keycloak Admin**: http://localhost:8081
  - Username: `admin`
  - Password: `admin`

Stop all services:
```bash
docker-compose down
```

Stop and remove volumes (clean start):
```bash
docker-compose down -v
```

### Keycloak Setup in Docker

#### Option 1: Automated Setup (Recommended)

After starting docker-compose, run the setup script:

```bash
# Start all services
docker-compose up -d

# Wait for services to be ready, then run setup
./keycloak-setup.sh
```

This will automatically:
- Create the `vue-app` realm
- Configure the `vue-template` client with PKCE
- Create a test user (`demo/demo`)

Then update your `.env`:
```env
VITE_KEYCLOAK_URL=http://localhost:8081
VITE_KEYCLOAK_REALM=vue-app
VITE_KEYCLOAK_CLIENT_ID=vue-template
```

Test credentials:
- Username: `demo`
- Password: `demo`

#### Option 2: Manual Setup

1. Access Keycloak admin console at http://localhost:8081
2. Login with `admin/admin`
3. Create a new realm (e.g., `vue-app`)
4. Create a new client:
   - Client ID: `vue-template`
   - Client authentication: OFF (public client)
   - Standard flow: ON
   - Valid redirect URIs: `http://localhost:8080/*`, `http://localhost:3000/*`
   - Web origins: `http://localhost:8080`, `http://localhost:3000`
5. Create a test user with password
6. Update your `.env` file as shown above

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run coverage` | Generate test coverage report |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |

## Authentication Flow

1. User visits the application
2. Keycloak initialization checks for existing session
3. If not authenticated, user is redirected to login page
4. User clicks "Sign in with Keycloak"
5. User authenticates with Keycloak (PKCE flow)
6. Tokens are received and refresh token stored in memory
7. User is redirected to dashboard
8. Access token automatically refreshed before expiration

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the application.

**Required:**
- `VITE_KEYCLOAK_URL` - Your Keycloak server URL
- `VITE_KEYCLOAK_REALM` - Keycloak realm name
- `VITE_KEYCLOAK_CLIENT_ID` - Keycloak client ID

**Optional:**
- `VITE_APP_TITLE` - Application title (default: "Vue Template")
- `VITE_API_BASE_URL` - API base URL for backend calls
- `VITE_APP_DEBUG` - Show token debug panel (`true`/`false`, default: `false`)
