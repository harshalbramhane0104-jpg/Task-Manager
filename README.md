# Book Library — React + Node.js + MySQL (3-Tier Practice App)

A simple 3-tier app for CI/CD practice:
- **Frontend**: React (built with Vite)
- **Backend**: Node.js + Express
- **Database**: MySQL

## Project structure

```
book-library-3tier/
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── api.js        <- change VITE_API_URL here per environment
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

## Running it MANUALLY (no Docker) — Windows/PowerShell

### 1. Set up MySQL

Log in as root (or a user with privileges to create databases):
```powershell
mysql -u root -p
```

Then create the database and a dedicated user:
```sql
CREATE DATABASE librarydb;
CREATE USER 'libuser'@'localhost' IDENTIFIED BY 'libpass';
GRANT ALL PRIVILEGES ON librarydb.* TO 'libuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Run the backend

Open a terminal:
```powershell
cd book-library-3tier\backend
npm install
```

Set environment variables for this terminal session:
```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_USER="libuser"
$env:DB_PASSWORD="libpass"
$env:DB_NAME="librarydb"
$env:PORT="5000"
```

Start the backend:
```powershell
npm start
```
You should see `Database connected and table ready.` followed by `Backend running on port 5000`. Leave this terminal open.

### 3. Run the frontend

Open a **second** terminal:
```powershell
cd book-library-3tier\frontend
npm install
npm run dev
```

Vite will print a local URL, typically `http://localhost:5173`. Open that in your browser.

### 4. Test it

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:5000/health` → should return `{"status":"ok"}`
- Try adding a book from the UI, or directly via curl (in a third terminal):
  ```powershell
  curl -X POST http://localhost:5000/books -H "Content-Type: application/json" -d '{\"title\":\"1984\",\"author\":\"George Orwell\"}'
  curl http://localhost:5000/books
  ```

### To stop

Press `Ctrl+C` in both the backend and frontend terminals.

---

## Once manual testing works: move to Docker

```bash
docker compose up -d --build
```
This runs all three tiers (frontend on port 80, backend on port 5000, MySQL) automatically, using the same `DB_HOST`, `DB_USER`, etc. wired up in `docker-compose.yml`.

## Then: push to GitHub and set up Jenkins

Same pattern as before:
1. `git init`, `git add .`, `git commit`, push to GitHub
2. Add a `dockerhub-creds` credential in Jenkins
3. Update `DOCKERHUB_USER` and the `git url` in the `Jenkinsfile`
4. Create a Jenkins Pipeline job pointing at your repo

## Things to practice/break on purpose

- Change `VITE_API_URL` to a wrong port and observe the frontend error
- Stop MySQL mid-run and see how the backend's retry logic (`db.js`) handles it
- Remove `dockerhub-creds` from Jenkins and read the resulting error
- Add a `.env` file to the frontend for `VITE_API_URL` instead of hardcoding it, and see how Vite picks it up automatically
