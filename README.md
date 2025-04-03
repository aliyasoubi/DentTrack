# DentTrack - Dental Clinic Management System

DentTrack is a comprehensive dental clinic management system with a focus on inventory management. The system helps dental clinics track various types of dental materials and supplies, including implants, abutments, composites, and laminates.

## Features

- Unified inventory management system
- Category-based product tracking
- Expiry date monitoring
- Low stock alerts
- Detailed filtering and search capabilities
- RESTful API with proper validation

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Express Validator
- JWT for authentication (to be implemented)

### Frontend (Coming Soon)
- React
- Material-UI
- React Router
- Formik & Yup
- Axios

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/denttrack.git
cd denttrack
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a .env file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/denttrack
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

### API Endpoints

#### Inventory Management
- GET /api/v1/inventory - Get all inventory items (with filtering)
- GET /api/v1/inventory/:id - Get single inventory item
- POST /api/v1/inventory - Create new inventory item
- PUT /api/v1/inventory/:id - Update inventory item
- DELETE /api/v1/inventory/:id - Delete inventory item
- GET /api/v1/inventory/low-stock - Get low stock items
- GET /api/v1/inventory/expiring - Get items expiring within 30 days

### Query Parameters for Filtering
- category: Filter by product category
- brand: Filter by brand name
- minQuantity: Minimum quantity threshold
- maxQuantity: Maximum quantity threshold
- expiryBefore: Items expiring before date
- expiryAfter: Items expiring after date
- sortBy: Field to sort by
- sortOrder: asc or desc
- page: Page number for pagination
- limit: Items per page

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
