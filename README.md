# MirrorMint — Trading Strategy Management Console

MirrorMint is a secure, scalable platform designed for managing automated trading strategies. Built with a robust FastAPI backend and a high-performance Next.js frontend, it aligns with enterprise-grade standards for financial software.

## 🚀 Technology Stack

- **Backend:** Python 3.11, FastAPI, SQLAlchemy, PostgreSQL (Neon Cloud)
- **Security:** JWT Authentication, Bcrypt Password Hashing, Role-Based Access Control (RBAC)
- **Frontend:** Next.js 16 (App Router), Tailwind CSS 4, Axios, Lucide Icons
- **Typography:** Poppins (Google Fonts)
- **Database:** PostgreSQL via Neon with connection pooling

## 🛠️ Architecture

MirrorMint follows a clean, modular architecture:
- **API Versioning:** All routes are prefixed with `/api/v1/`.
- **Standardized Responses:** Consistent JSON error/success envelopes.
- **RBAC:** Strictly enforced roles (Admin vs. Regular User).
- **Dense UI:** Information-dense, light-themed professional dashboard.

---

## 🏗️ Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Neon PostgreSQL Account (or any PostgreSQL instance)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Configure .env
cp .env.example .env
# Set NEON_DATABASE_URI and SECRET_KEY
```
Run server:
```bash
uvicorn app.main:app --reload
```
*API Documentation available at http://localhost:8000/docs*

### 2. Frontend Setup
```bash
cd frontend
npm install

# Configure .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```
Run development server:
```bash
npm run dev
```
*Console available at http://localhost:3000*

---

## 🔐 API Documentation (v1)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/auth/register` | None | Any | Create new user profile |
| `POST` | `/auth/login` | None | Any | Authenticate & receive JWT |
| `GET` | `/auth/me` | JWT | Any | Get current user identity |
| `GET` | `/strategies` | JWT | user/admin | List all active strategies |
| `POST` | `/strategies` | JWT | admin | Create a new strategy |
| `PUT` | `/strategies/{id}` | JWT | admin | Modify existing strategy |
| `DELETE`| `/strategies/{id}` | JWT | admin | Remove a strategy |

---

## 📈 Scalability & Future Growth

To support millions of requests and high-frequency trading data, MirrorMint is architected for the following growth path:

### 1. Microservices Decomposition
The strategy engine and user authentication can be split into separate services. The `/strategies` logic would move to a **Strategy Service**, while auth moves to an **Identity Service**, communicating via gRPC or a Message Broker (RabbitMQ/Kafka).

### 2. Performance Caching
Implement **Redis** to cache frequently accessed strategy data and active sessions. This reduces PostgreSQL load significantly for read-heavy operations like dashboard refreshes.

### 3. Database Scaling
- **Read Replicas:** Offload dashboard `GET` requests to PostgreSQL read replicas.
- **Connection Pooling:** Use **PgBouncer** to manage thousands of concurrent DB connections efficiently.
- **Partitioning:** Partition strategy logs/history by date to maintain query performance as data grows.

### 4. High Availability
Deploy behind an **NGINX/AWS ALB** load balancer with horizontal scaling (Auto-scaling groups or Kubernetes). Use **CDN** (Cloudflare/Vercel) for optimized frontend delivery.

---

## 📄 License
MirrorMint Proprietary Strategy Software. All rights reserved.
