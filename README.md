# **Task Management API** 🚀

A RESTful API for managing tasks with authentication, role-based access control (RBAC), request validation, rate limiting, and security features.

## **📌 Features**

- **Task Management**: Create, retrieve, update, and delete tasks
- **Authentication**: JWT-based authentication with refresh tokens
- **RBAC**: Restrict access based on user roles
- **Validation**: Uses `class-validator` for input validation
- **Rate Limiting**: Per-endpoint rate limiting
- **Security**: Helmet, CORS, Input Sanitization, SQL Injection prevention
- **API Documentation**: Auto-generated using **Swagger (JSDoc)**

---

## **🚀 Installation**

### **1️⃣ Prerequisites**

- Node.js (v18+)
- PostgreSQL (v15+)
- Docker & Docker Compose (Optional)

### **2️⃣ Setup & Run Locally**

```bash
git clone https://github.com/DevGbolade/taskApi.git

cd taskApi

npm install

cp .env.example .env

npm run dev
```

Server runs at `http://localhost:5070`  
API docs available at `http://localhost:5070/api/docs`

---

## **🐳 Running with Docker**

1. Ensure Docker is installed and running
2. Run the API and database using Docker Compose:

   ```bash
   docker-compose up --build
   ```

3. Access API at `http://localhost:5070`

---

## **📌 API Endpoints**

### **🔑 Authentication**

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Register new user    |
| POST   | `/api/auth/login`    | User login           |
| POST   | `/api/auth/refresh`  | Refresh access token |
| POST   | `/api/auth/logout`   | Logout user          |

### **📋 Task Management**

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/api/tasks`     | Create a task     |
| GET    | `/api/tasks`     | Get all tasks     |
| GET    | `/api/tasks/:id` | Get a single task |
| PUT    | `/api/tasks/:id` | Update a task     |
| DELETE | `/api/tasks/:id` | Delete a task     |

---

## **📜 Environment Variables**

Create a `.env.prod` file for production:

```ini
NODE_ENV=production
PORT=5070
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=task_api_db
JWT_SECRET="your_secret_key"
REFRESH_TOKEN_SECRET="your_refresh_secret"
```

---

🔥 **Happy Coding!** 🚀
