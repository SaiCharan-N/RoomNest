# RoomNest

**"Find a room that feels like home."**

RoomNest is a full-stack room rental platform that connects room owners with
people looking for affordable, comfortable accommodation. Owners list and
manage rooms; seekers browse, filter, and send rental requests directly to
owners.

---

## Contents

- [What the project does](#what-the-project-does)
- [Components](#components)
- [Project structure](#project-structure)
- [How to run it](#how-to-run-it)
  - [Option 1: Run locally with Node.js](#option-1-run-locally-with-nodejs)
  - [Option 2: Run with Docker Compose](#option-2-run-with-docker-compose)
  - [Option 3: Run on Kubernetes](#option-3-run-on-kubernetes)
- [Sample data and demo accounts](#sample-data-and-demo-accounts)
- [Configuration](#configuration)
- [API overview](#api-overview)
- [Testing](#testing)
- [CI pipeline](#ci-pipeline)
- [Future improvements](#future-improvements)

---

## What the project does

**Room seekers can**
- Register and log in (JWT authentication)
- Browse and search rooms with filters (rent range, location, room type, availability) and sorting
- View room details: images, rent, location, amenities, and owner contact
- Send a rental request with a preferred move-in date
- Track request status (Pending / Accepted / Rejected)

**Room owners can**
- Register and log in as an Owner
- See a dashboard with stats (listings, available rooms, requests, pending requests)
- Add, edit, and delete room listings with multiple image uploads
- Review incoming rental requests and accept or reject them

**Everyone gets**
- A responsive UI that works on desktop, tablet, and mobile
- Profile management, plus About and Contact pages
- Loading, empty, and error states throughout

---

## Components

| Component | Technology | Role |
|-----------|------------|------|
| **Frontend** (`client/`) | React 18, Vite, React Router, Axios, Tailwind CSS | Single-page web app. In containers it is served by **nginx**, which also forwards `/api` and `/uploads` to the backend, so the browser talks to a single origin. |
| **Backend** (`server/`) | Node.js, Express | REST API for auth, rooms, rental requests, users, and contact messages. Passwords are hashed with bcryptjs; sessions use JWT. |
| **Database** | MongoDB 7 with Mongoose | Stores users, rooms, rental requests, and contact messages. Collections are created automatically on first write. |
| **Image storage** | Multer (local disk) | Room photos are saved to `server/uploads` and served at `/uploads`. |
| **Containers** | Docker, Docker Compose | `client/Dockerfile`, `server/Dockerfile`, and `docker-compose.yml` for a one-command local stack. |
| **Kubernetes manifests** (`k8s/`) | Kubernetes, Kustomize | Namespace, ConfigMap, Secret, MongoDB StatefulSet, backend and frontend Deployments, Services, and persistent volumes. |
| **CI** | Jenkins (`Jenkinsfile`) | Installs dependencies, runs tests, builds the frontend and Docker images, and deploys with Docker Compose. |

How the pieces connect:

```
Browser ──► frontend (nginx :80) ──/api, /uploads──► backend (Express :5000) ──► MongoDB (:27017)
                │
                └── serves the built React app
```

---

## Project structure

```
RoomNest/
├── client/                 React + Vite frontend
│   ├── src/
│   │   ├── components/     Reusable UI components
│   │   ├── pages/          Route-level pages
│   │   ├── layouts/        Shared layout (navbar/footer)
│   │   ├── services/       Axios API client
│   │   ├── context/        Auth context/provider
│   │   ├── utils/          Helpers (image URL resolution, etc.)
│   │   └── tests/          Vitest component tests
│   ├── nginx.conf.template nginx config used inside the container
│   └── Dockerfile
│
├── server/                 Express + MongoDB backend
│   ├── controllers/        Route handler logic
│   ├── routes/             Express routers
│   ├── models/             Mongoose schemas
│   ├── middleware/         Auth, role guards, uploads, error handling
│   ├── seed/               Database seed script
│   ├── tests/              Jest + Supertest tests
│   └── Dockerfile
│
├── k8s/                    Kubernetes manifests (see Option 3)
├── docker-compose.yml      Local multi-container stack
├── Jenkinsfile             CI pipeline
└── package.json            Convenience scripts for both apps
```

---

## How to run it

### Option 1: Run locally with Node.js

Requirements: Node.js 20+ and a MongoDB instance (local, or a free MongoDB Atlas cluster).

```bash
# Backend
cd server
npm install
cp .env.example .env      # then set MONGO_URI and JWT_SECRET
npm run dev               # API on http://localhost:5000

# Frontend (in a second terminal)
cd client
npm install
npm run dev               # App on http://localhost:5173
```

In development the Vite server proxies `/api` and `/uploads` to the backend,
so no extra frontend configuration is needed. Optionally load sample data with
`npm run seed` from `server/`.

### Option 2: Run with Docker Compose

Requirements: Docker with Compose v2.

```bash
docker compose up -d --build
```

| Service | URL |
|---------|-----|
| App (frontend) | http://localhost:5173 |
| API | http://localhost:5000/api/health |

Load the sample data (optional):

```bash
docker compose exec backend npm run seed
```

Useful commands:

```bash
docker compose ps          # container status
docker compose logs -f     # follow logs
docker compose down        # stop (data is kept in named volumes)
docker compose down -v     # stop and delete the database and uploads
```

### Option 3: Run on Kubernetes

Requirements: Docker, `kubectl`, and a local cluster such as Docker Desktop
(Kubernetes enabled), Minikube, or kind.

**1. Build the images**

```bash
docker build -t roomnest-backend:latest ./server
docker build -t roomnest-frontend:latest ./client
```

**2. Make the images available to the cluster**

- Docker Desktop: nothing to do, the cluster shares your local images.
- Minikube: `minikube image load roomnest-backend:latest roomnest-frontend:latest`
- kind: `kind load docker-image roomnest-backend:latest roomnest-frontend:latest`

If you prefer a registry, tag and push the images, then update the `image:`
fields in `k8s/backend.yaml`, `k8s/frontend.yaml`, and `k8s/seed-job.yaml`.

**3. Deploy**

```bash
kubectl apply -k k8s/
kubectl -n roomnest get pods,svc,pvc
kubectl -n roomnest rollout status deployment/backend deployment/frontend
```

**4. Open the app**

```bash
kubectl -n roomnest port-forward svc/frontend 8080:80
# then open http://localhost:8080
```

On Docker Desktop the NodePort also works at http://localhost:30080. On
Minikube you can run `minikube service frontend -n roomnest --url`.

**5. Load sample data (optional)**

```bash
kubectl apply -f k8s/seed-job.yaml
kubectl -n roomnest logs job/seed-data
```

**What gets created in the `roomnest` namespace**

| File | Resources |
|------|-----------|
| `namespace.yaml` | Namespace `roomnest` |
| `configmap.yaml` | Non-secret settings (`MONGO_URI`, `PORT`, `JWT_EXPIRES_IN`, `CLIENT_URL`) |
| `secret.yaml` | `JWT_SECRET` (replace the placeholder before real use) |
| `mongodb.yaml` | MongoDB StatefulSet, headless Service, 1Gi persistent volume |
| `backend.yaml` | Backend Deployment, ClusterIP Service, 1Gi volume for uploads |
| `frontend.yaml` | Frontend Deployment (2 replicas) and NodePort Service on 30080 |
| `seed-job.yaml` | Optional Job that loads sample data (applied separately) |

Handy commands:

```bash
kubectl -n roomnest scale deployment/frontend --replicas=3   # scale the frontend
kubectl -n roomnest logs deployment/backend                  # backend logs
kubectl -n roomnest rollout restart deployment/backend       # restart after a new image
kubectl delete -k k8s/                                       # remove everything
```

Note: uploaded images are stored on a `ReadWriteOnce` volume, so keep the
backend at one replica unless you add shared storage or move uploads to object
storage.

---

## Sample data and demo accounts

The seed script clears existing data and inserts 8 sample rooms across
Hyderabad locations plus these accounts:

```
Owner:         owner@roomnest.com    /  Owner@123
Second owner:  owner2@roomnest.com   /  Owner@123
Room seeker:   user@roomnest.com     /  User@123
```

These are demo credentials only. Do not use them in production.

---

## Configuration

### Backend (`server/.env`, or container environment)

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token lifetime (for example `7d`) |
| `PORT` | Port the API listens on (default `5000`) |
| `CLIENT_URL` | Frontend origin, used for CORS |

### Frontend

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Build-time API base URL. Leave blank to call `/api` on the same origin (Vite proxy in development, nginx proxy in containers). |
| `BACKEND_HOST` / `BACKEND_PORT` | Container-time settings for the nginx proxy (defaults `backend` and `5000`). |

`.env` files are git-ignored; only `.env.example` files are committed.

---

## API overview

All protected routes require `Authorization: Bearer <token>`.
A health check is available at `GET /api/health`.

**Auth**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/me` | Get the current user |

**Rooms**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | List, search, filter, and sort rooms |
| GET | `/api/rooms/:id` | Get a single room |
| GET | `/api/rooms/owner/mine` | Get the logged-in owner's rooms |
| POST | `/api/rooms` | Create a room (owner only, multipart) |
| PUT | `/api/rooms/:id` | Update a room (owner only, multipart) |
| DELETE | `/api/rooms/:id` | Delete a room (owner only) |

**Requests**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/requests` | Submit a rental request (seeker only) |
| GET | `/api/requests/user` | Get the logged-in seeker's requests |
| GET | `/api/requests/owner` | Get requests for the owner's rooms |
| PUT | `/api/requests/:id/status` | Accept or reject a request (owner only) |

**Users and contact**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get own profile |
| PUT | `/api/users/profile` | Update own profile |
| GET | `/api/users/owner/stats` | Owner dashboard statistics |
| POST | `/api/contact` | Submit a contact form message |

---

## Testing

```bash
cd server && npm test      # Jest + Supertest (in-memory MongoDB)
cd client && npm test      # Vitest + Testing Library
npm test                   # both, from the repository root
```

---

## CI pipeline

The `Jenkinsfile` defines these stages: checkout, install dependencies,
backend tests, frontend tests, frontend build, Docker image build, and deploy
with Docker Compose.

---

## Future improvements

- Online payments
- Map-based location search
- Email notifications for request updates
- Cloud image storage (S3 or Cloudinary)
- Advanced search and recommendations
- Owner and room reviews and ratings
- Real-time messaging between owners and seekers
