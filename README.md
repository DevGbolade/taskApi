Here's the updated `README.md` with the addition of health check routes:

---

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

1. Ensure Docker is installed and running.
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

### **🩺 Health Check**

| Method | Endpoint       | Description                     |
| ------ | -------------- | ------------------------------- |
| GET    | `/api/healthz` | Check if the service is healthy |

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

## **📡 Kubernetes Setup**

### **Setting up kubectl for Minikube**

1. **Install Minikube** and start your cluster:

   ```bash
   minikube start
   ```

2. **Configure kubectl** to use the Minikube context:

   ```bash
   kubectl config use-context minikube
   ```

3. **Check the Minikube cluster**:

   ```bash
   kubectl cluster-info
   ```

4. **Deploy your application** to Minikube:

   - Apply the Kubernetes deployment YAML:

     ```bash
          kubectl apply -f k8s/dev/
     ```

5. **Access the API from Minikube**:

   You can expose your application via a Minikube service:

   ```bash
   minikube service task-api --url
   ```

   This will give you the URL to access your API.

---

### **Setting up kubectl for Google Kubernetes Engine (GKE)**

1. **Install Google Cloud SDK** if you haven’t already:

   Follow the instructions [here](https://cloud.google.com/sdk/docs/install).

2. **Authenticate with GCP**:

   ```bash
   gcloud auth login
   ```

3. **Set your Google Cloud project, region and zone**:

   ```bash
   gcloud config set project <YOUR_PROJECT_ID>
   gcloud config set compute/region <REGION>
   gcloud config set compute/zone <ZONE>
   ```

4. **Get credentials for your GKE cluster**:

   ```bash
   gcloud container clusters get-credentials <CLUSTER_NAME> --zone <ZONE> --project <YOUR_PROJECT_ID>
   ```

5. **Verify your GKE cluster context**:

   ```bash
   kubectl cluster-info
   ```

6. **Deploy your application** to GKE:

   - Apply the Kubernetes deployment YAML:

     ```bash
     kubectl apply -f k8s/prod/
     ```

   This will deploy your application in the production environment based on the Kubernetes configurations stored in the `k8s/prod/` directory.

7. **Access the API on GKE**:

   If your cluster is public, you can get the external IP of your service:

   ```bash
   kubectl get svc task-api
   ```

   This will provide the IP address you can use to access your API.

---

🔥 **Happy Coding!** 🚀

---
