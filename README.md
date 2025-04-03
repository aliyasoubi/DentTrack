# 🦷 DentTrack - Dental Clinic Management System

![DentTrack Logo](https://via.placeholder.com/150x150.png?text=DentTrack)

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)

## 📋 Overview

DentTrack is a comprehensive dental clinic management system designed to streamline inventory management, patient records, and administrative tasks for dental practices. This repository contains the backend API built with NestJS, MongoDB, and TypeScript.

## ✨ Features

- **Inventory Management**: Track dental supplies with detailed categorization
- **Stock Monitoring**: Alerts for low stock and expiring items
- **Supplier Management**: Track suppliers and reorder points
- **RESTful API**: Well-documented endpoints with Swagger
- **Type Safety**: Built with TypeScript for robust development
- **Modular Architecture**: Easy to extend with new features

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aliyasoubi/denttrack.git
   cd denttrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

4. Start the development server:
   ```bash
   npm run start:dev
   ```

5. Access the API documentation:
   ```
   http://localhost:3000/api
   ```

## 📚 API Documentation

### Inventory Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/inventory` | Get all inventory items with optional filtering |
| `GET` | `/inventory/:id` | Get a specific inventory item |
| `POST` | `/inventory` | Create a new inventory item |
| `PATCH` | `/inventory/:id` | Update an inventory item |
| `DELETE` | `/inventory/:id` | Delete an inventory item |
| `GET` | `/inventory/low-stock` | Get items with low stock |
| `GET` | `/inventory/expiring` | Get items expiring soon |
| `PATCH` | `/inventory/:id/quantity` | Update item quantity |

### Query Parameters

The `/inventory` endpoint supports the following query parameters:

- `category`: Filter by category
- `subCategory`: Filter by subcategory
- `brand`: Filter by brand
- `supplier`: Filter by supplier
- `minQuantity`: Filter by minimum quantity
- `maxQuantity`: Filter by maximum quantity
- `expiringBefore`: Filter by expiry date before

## 🏗️ Project Structure

```
denttrack/
├── backend/
│   ├── src/
│   │   ├── inventory/
│   │   │   ├── dto/
│   │   │   ├── schemas/
│   │   │   ├── inventory.controller.ts
│   │   │   ├── inventory.service.ts
│   │   │   └── inventory.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## 📊 Inventory Categories

DentTrack organizes dental supplies into the following categories:

- **Implant & Abutment Components**
- **Consumables & Disposables**
- **Impression & Matrix Materials**
- **Local Anesthetics & Pharmaceuticals**
- **Restorative Materials & Bonding Agents**
- **Endodontic & Irrigation Supplies**
- **Etching, Polishing & Bleaching Agents**
- **Surgical & Sterilization Supplies**
- **Dental Instruments & Accessories**
- **Cleaning, Disinfection & Maintenance Supplies**
- **Office & Miscellaneous Supplies**

## 🔧 Development

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build
```

### Starting Production Server

```bash
npm run start:prod
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [Swagger](https://swagger.io/) - API documentation
