# MERN TODO App — Dockerizing and Deployment

## Objective

This assignment guides you through the challenges of deploying a MERN (MongoDB, Express.js, React, Node.js) stack application in a production-like environment, leveraging Docker containers for consistency and Docker Compose for simplified orchestration.

## Prerequisites

- **Host OS**: Ubuntu Server or Desktop (no WSL).  
- **Docker** & **Docker Compose** installed on the server.  
- **Git** access to your GitHub Classroom and personal repositories.  
- Familiarity with Node.js, React, and basic Linux commands.

---

## Part 1: Understanding Environment Inconsistency

1. **Emulate Node 16 on the server** (uninstall other versions, install Node.js 16):
   ```bash
   sudo apt update
   sudo apt install -y curl
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt install -y nodejs
   node -v && npm -v
   ```
2. **Clone** the existing backend repo and attempt to run it natively:
   ```bash
   git clone https://github.com/zaheersani/SCD-SP25-NodeApp.git
   cd SCD-SP25-NodeApp/backend
   npm install && node server.js
   ```
3. **Document** any version conflicts or environment mismatches (screenshots of errors).  

*Outcome:* Understanding why a mismatched Node.js version can break deployment and the limitations of changing the global server environment.

---

## Part 2: Solving with Docker Containers

1. **Justify** using the correct Node.js version (e.g., Node.js 18+ for native `fetch`).  
2. **Create a `Dockerfile`** for the backend (Node 16 if required, or Node 18 for new features).  
3. **Build & test** locally:
   ```bash
   docker build -t yourusername/todo-backend:1.0 ./backend
   docker run -d --name local-backend -p 5000:5000 yourusername/todo-backend:1.0
   curl http://localhost:5000/get
   ```
4. **Publish** the image to Docker Hub:
   ```bash
   docker push yourusername/todo-backend:1.0
   ```
5. **Repeat** for the frontend:
   ```bash
   docker build -t yourusername/todo-frontend:1.0 ./frontend
   docker run -d --name local-frontend -p 3000:80 yourusername/todo-frontend:1.0
   ```

*Outcome:* Containerized each service so the host Node version is irrelevant.

---

## Part 3: Building Features into a MERN Boilerplate

1. **Accept** assignment on GitHub Classroom and clone.  
2. **Add** missing `frontend/public` folder.  
3. **Create** a feature branch (`feature/ui-enhancements`).  
4. **Implement** front-end improvements in React:
   - **Editing cue**: toggle icon when editing.  
   - **Timestamp**: display `createdAt` in human-readable form (e.g., via `dayjs`).  
   - **Delete confirmation**: browser dialog on delete.  
5. **Refactor** backend to load `MONGO_URI` from `.env` using `dotenv`.  
6. **Merge** feature branch into `main`, tagging each major version (e.g. `v1.0.0-ui`).  

*Outcome:* Enhanced UI and secure back-end configuration.

---

## Part 4: Containerize the Application

1. **Create** a branch (`feature/dockerize`).  
2. **Write** `Dockerfile`s for frontend (React build + Nginx) and backend.  
3. **Build & run** locally, linking to an official MongoDB container:
   ```bash
   docker run -d --name mongo -p 27017:27017 mongo:latest
   docker run -d --name backend --network host yourusername/todo-backend:1.0
   ```
4. **Document** container logs, processes, and connectivity screenshots.  
5. **Push** images for both services to Docker Hub.  

*Outcome:* Production-ready container images for each service.

---

## Part 5: Deploy Containers Manually

1. **Create** a private network and volume:
   ```bash
   docker network create todo-net
   docker volume create mongo_data
   ```
2. **Run** containers on `todo-net`: MongoDB (private), backend (bound to `127.0.0.1`), and frontend (public port 80 with Nginx proxy):
   ```bash
   docker run -d --name mongo --network todo-net -v mongo_data:/data/db mongo:latest
   docker run -d --name todo-backend --network todo-net -p 127.0.0.1:5000:5000 -e MONGO_URI="mongodb://mongo:27017/TODO" yourusername/todo-backend:1.0
   docker run -d --name todo-frontend --network todo-net -p 80:80 yourusername/todo-frontend:1.0
   ```
3. **Verify** from outside the host that only port 80 is reachable.  
4. **Stop & remove** containers, then re-run to prove volume persistence.  

*Outcome:* Manual CLI-based orchestration with private networking and persistent storage.

---

## Part 6: Simplifying with Docker Compose

1. **Create** a `.env` (for sensitive values) and `docker-compose.yml` at the project root.  
2. **Define** services using `build:` contexts for `./backend` and `./frontend`, include volumes and networks:
   ```yaml
   services:
     db:
       image: mongo:latest
       volumes: [mongo_data:/data/db]
     backend:
       build: ./backend
       env_file: .env
       ports: ["127.0.0.1:5000:5000"]
     frontend:
       build: ./frontend
       ports: ["80:80"]
   volumes:
     mongo_data: {}
   networks:
     default: { driver: bridge }
   ```
3. **Launch** all services:
   ```bash
   docker-compose up --build -d
   ```
4. **Test**: access `http://<host-ip>/` for the React app and `http://<host-ip>/api/get` via the reverse proxy.  

*Outcome:* One-command deployment, reproducible across environments.

---

## Part 7: Repository Update

1. **Clean Slate:** remove local Docker artifacts: `docker system prune -a`.  
2. **Add** `docker-compose.yml` and `.env` to your Git repo.  
3. **Commit** and **push** to GitHub:
   ```bash
   git add docker-compose.yml .env README.md
   git commit -m "chore: add Docker Compose orchestration"
   git push origin main
   ```

---

**Good luck!**

