# 🚀 E-Project Phase 1 - Microservices E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://mongodb.com/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.13-orange.svg)](https://rabbitmq.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docker.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-red.svg)](https://jwt.io/)

Một hệ thống thương mại điện tử được xây dựng theo kiến trúc microservices với Node.js, Express, MongoDB, RabbitMQ và Docker. Hệ thống hỗ trợ quản lý sản phẩm, đặt hàng, xác thực người dùng và quản lý kho hàng tự động.

## 📋 Mục lục

- [🏗️ Kiến trúc hệ thống](#️-kiến-trúc-hệ-thống)
- [✨ Tính năng chính](#-tính-năng-chính)
- [🛠️ Công nghệ sử dụng](#️-công-nghệ-sử-dụng)
- [📦 Cài đặt](#-cài-đặt)
- [🚀 Chạy ứng dụng](#-chạy-ứng-dụng)
- [🔧 Cấu hình](#-cấu-hình)
- [📖 API Documentation](#-api-documentation)
- [🧪 Testing](#-testing)
- [🐳 Docker](#-docker)
- [📊 Monitoring](#-monitoring)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

## 🏗️ Kiến trúc hệ thống

### Tổng quan Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │────│  Auth Service   │────│  Product Service│
│   (Port 3003)   │    │   (Port 3000)   │    │   (Port 3001)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │              ┌─────────────────┐                │
         └──────────────│  Order Service  │────────────────┘
                        │   (Port 3002)   │
                        └─────────────────┘
                                 │
               ┌─────────────────────────────────────┐
               │                                     │
         ┌─────────────┐                   ┌─────────────┐
         │  MongoDB    │                   │  RabbitMQ   │
         │ (Port 27017)│                   │ (Port 5672) │
         └─────────────┘                   └─────────────┘
```

### Microservices

| Service | Port | Mô tả | Database | Message Queue |
|---------|------|-------|----------|---------------|
| **API Gateway** | 3003 | Điều hướng request, load balancing | ❌ | ❌ |
| **Auth Service** | 3000 | Xác thực người dùng, JWT tokens | ✅ MongoDB | ❌ |
| **Product Service** | 3001 | Quản lý sản phẩm, inventory | ✅ MongoDB | ✅ RabbitMQ |
| **Order Service** | 3002 | Xử lý đơn hàng, order tracking | ✅ MongoDB | ✅ RabbitMQ |

### Message Flow

```
1. User → API Gateway → Product Service (tạo sản phẩm)
2. User → API Gateway → Product Service → RabbitMQ → Order Service (tạo đơn hàng)
3. Order Service → RabbitMQ → Product Service (cập nhật inventory)
```

## ✨ Tính năng chính

### 🔐 Authentication & Authorization
- [x] Đăng ký tài khoản người dùng
- [x] Đăng nhập với JWT authentication
- [x] Middleware xác thực cho các protected routes
- [x] Password hashing với bcrypt

### 🛍️ Product Management
- [x] CRUD operations cho sản phẩm
- [x] Quản lý inventory với quantity tracking
- [x] Validation dữ liệu sản phẩm
- [x] Search và filter sản phẩm

### 📦 Order Management
- [x] Tạo đơn hàng với multiple products
- [x] Tự động kiểm tra và trừ số lượng sản phẩm
- [x] Order status tracking (pending → completed)
- [x] Tính toán total price tự động

### 🔄 Asynchronous Processing
- [x] Message queue với RabbitMQ
- [x] Event-driven architecture
- [x] Automatic inventory updates
- [x] Resilient message handling

### 🚪 API Gateway
- [x] Request routing đến các microservices
- [x] Centralized entry point
- [x] Load balancing capabilities

## 🛠️ Công nghệ sử dụng

### Backend Framework
- **Node.js** 18.x - JavaScript runtime
- **Express.js** 4.x - Web framework
- **Mongoose** 7.x - MongoDB ODM

### Database & Message Queue
- **MongoDB** 6.0 - NoSQL database
- **RabbitMQ** 3.13 - Message broker

### Authentication & Security
- **JSON Web Token (JWT)** - Stateless authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### DevOps & Infrastructure
- **Docker** & **Docker Compose** - Containerization
- **http-proxy** - API Gateway routing
- **amqplib** - RabbitMQ client

### Development Tools
- **nodemon** - Development auto-reload
- **dotenv** - Environment variables
- **Jest** - Testing framework (ready to implement)

## 📦 Cài đặt

### Prerequisites

Đảm bảo bạn đã cài đặt:

- [Docker](https://docs.docker.com/get-docker/) 20.x+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.x+
- [Git](https://git-scm.com/downloads)

### Clone Repository

```bash
git clone https://github.com/your-username/eproject-phase-1.git
cd eproject-phase-1
```

### Environment Setup

Tạo file `.env` cho từng service (nếu cần custom):

```bash
# Sử dụng default configurations từ docker-compose.yml
# Hoặc tạo custom .env files
```

## 🚀 Chạy ứng dụng

### Quick Start với Docker Compose

```bash
# 1. Build tất cả services
docker-compose build

# 2. Start tất cả services
docker-compose up -d

# 3. Xem logs
docker-compose logs -f

# 4. Kiểm tra status
docker-compose ps
```

### Development Mode

```bash
# Start services riêng lẻ
docker-compose up -d mongodb rabbitmq
cd auth && npm install && npm run dev
cd product && npm install && npm run dev
cd order && npm install && npm run dev
cd api-gateway && npm install && npm run dev
```

### Verification

Kiểm tra các endpoints sau:

```bash
# API Gateway
curl http://localhost:3003

# Auth Service
curl http://localhost:3000/health

# Product Service  
curl http://localhost:3001/health

# Order Service
curl http://localhost:3002/health

# RabbitMQ Management
http://localhost:15672 (guest/guest)
```

## 🔧 Cấu hình

### Docker Compose Services

```yaml
services:
  mongodb:      # Database
  rabbitmq:     # Message broker
  auth:         # Authentication service
  product:      # Product management service
  order:        # Order processing service
  api-gateway:  # API routing service
```

### Environment Variables

| Variable | Default | Mô tả |
|----------|---------|-------|
| `MONGO_URI` | `mongodb://mongoadmin:secret@mongodb:27017/ecommerce?authSource=admin` | MongoDB connection string |
| `RABBITMQ_URL` | `amqp://rabbitmq:5672` | RabbitMQ connection URL |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret |
| `PORT` | Service specific | Port cho mỗi service |

### Database Configuration

```javascript
// MongoDB Collections
- users          // Authentication data
- products       // Product catalog
- orders         // Order records
```

### Message Queue Configuration

```javascript
// RabbitMQ Queues
- orders         // Order processing messages
- products       // Inventory update messages
```

## 📖 API Documentation

### Authentication Endpoints

#### POST `/auth/register`
Đăng ký tài khoản mới

```json
{
  "username": "testuser",
  "password": "password123"
}
```

#### POST `/auth/login`
Đăng nhập và lấy JWT token

```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "userId",
    "username": "testuser"
  }
}
```

### Product Endpoints

#### GET `/api/products`
Lấy danh sách tất cả sản phẩm

**Headers:** `Authorization: Bearer <token>`

#### POST `/api/products`
Tạo sản phẩm mới

**Headers:** `Authorization: Bearer <token>`

```json
{
  "name": "Gaming Laptop",
  "description": "High performance laptop",
  "price": 1500,
  "quantity": 10
}
```

#### PUT `/api/products/:id/quantity`
Cập nhật số lượng sản phẩm

```json
{
  "quantity": 15
}
```

### Order Endpoints

#### POST `/api/products/buy`
Tạo đơn hàng mới

**Headers:** `Authorization: Bearer <token>`

```json
{
  "items": [
    {
      "productId": "productId1",
      "quantity": 2
    },
    {
      "productId": "productId2", 
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "orderId": "uuid",
  "products": [...],
  "totalPrice": 3000,
  "username": "testuser",
  "status": "pending",
  "message": "Order created successfully and being processed"
}
```

#### GET `/api/products/orders/:orderId`
Kiểm tra trạng thái đơn hàng

**Response:**
```json
{
  "orderId": "uuid",
  "status": "completed",
  "products": [...],
  "totalPrice": 3000
}
```

## 🧪 Testing

### Manual Testing với Postman

1. **Import Collection**: Sử dụng file JSON đã cung cấp
2. **Set Environment Variables**:
   - `base_url`: `http://localhost:3001`
   - `gateway_url`: `http://localhost:3003`
   - `jwt_token`: Token từ login response

### Test Flow

```bash
1. Register User → Login → Get Token
2. Create Products → Verify Inventory
3. Create Order → Check Product Quantities Reduced
4. Check Order Status → Verify Completion
```

### Unit Testing (Ready to implement)

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## 🐳 Docker

### Container Architecture

```
eproject-phase-1_default network
├── mongodb-1      (Database)
├── rabbitmq-1     (Message Broker) 
├── auth-1         (Auth Service)
├── product-1      (Product Service)
├── order-1        (Order Service)
└── api-gateway-1  (API Gateway)
```

### Useful Docker Commands

```bash
# Rebuild specific service
docker-compose build --no-cache product

# View service logs
docker-compose logs -f product

# Scale services
docker-compose up -d --scale product=3

# Stop all services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v
```

### Health Checks

Mỗi service có health check endpoints:

```bash
curl http://localhost:3000/health  # Auth
curl http://localhost:3001/health  # Product  
curl http://localhost:3002/health  # Order
curl http://localhost:3003/health  # Gateway
```

## 📊 Monitoring

### RabbitMQ Management

- **URL**: http://localhost:15672
- **Username**: guest
- **Password**: guest

**Monitoring features:**
- Queue lengths
- Message rates
- Connection status
- Exchange bindings

### MongoDB Compass

Connect string: `mongodb://mongoadmin:secret@localhost:27017/ecommerce?authSource=admin`

### Application Logs

```bash
# Real-time logs từ tất cả services
docker-compose logs -f

# Logs từ service cụ thể
docker-compose logs -f product
```

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**:
```bash
# Production environment variables
export MONGO_URI="mongodb://prod-server:27017/ecommerce"
export RABBITMQ_URL="amqp://prod-rabbitmq:5672"
export JWT_SECRET="super-secure-secret"
```

2. **Docker Production Build**:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

3. **Load Balancer Configuration**:
```nginx
upstream api_gateway {
    server gateway1:3003;
    server gateway2:3003;
    server gateway3:3003;
}
```

### Scalability Considerations

- **Horizontal Scaling**: Scale individual services
- **Database Sharding**: MongoDB cluster setup
- **Message Queue Clustering**: RabbitMQ cluster
- **Load Balancing**: nginx/HAProxy configuration

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow ESLint configuration
2. **Commit Messages**: Use conventional commits
3. **Testing**: Write tests for new features
4. **Documentation**: Update README cho changes

### Pull Request Process

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Setup

```bash
# Install dependencies for all services
./scripts/install-all.sh

# Start development environment
./scripts/dev-start.sh

# Run tests
./scripts/test-all.sh
```

## 🐛 Troubleshooting

### Common Issues

#### RabbitMQ Connection Failed
```bash
# Check RabbitMQ status
docker-compose logs rabbitmq

# Restart RabbitMQ
docker-compose restart rabbitmq
```

#### MongoDB Connection Issues
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Reset MongoDB data
docker-compose down -v
docker-compose up -d mongodb
```

#### JWT Token Expired
```bash
# Get new token
POST /auth/login
```

---

## 📞 Liên hệ

- **Project Lead**: Huỳnh Văn Quân
- **Email**: huynhquan246810@gmail.com

---

**⭐ Nếu project này hữu ích, hãy star repository!**