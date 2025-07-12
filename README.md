# StacKIT 🚀

A modern, full-stack Q&A platform inspired by Stack Overflow, built with Next.js, TypeScript, and Node.js.

![StacKIT](https://img.shields.io/badge/StacKIT-Q%26A%20Platform-blue?style=for-the-badge&logo=stackoverflow)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18-green?style=for-the-badge&logo=node.js)

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login with JWT authentication
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 📝 Questions & Answers
- Create, edit, and delete questions
- Rich text editor for question content
- Tag-based categorization system
- Search functionality with filters
- Pagination for better performance
- View count tracking

### 💬 Answer System
- Post answers to questions
- Rich text editor for answer content
- Vote system (upvote/downvote)
- Accept best answers
- Answer editing and deletion

### 🏷️ Tag Management
- Create and manage tags
- Tag-based question filtering
- Popular tags sidebar
- Tag suggestions

### 🎯 Advanced Features
- Real-time search with debouncing
- Multiple filter options (newest, popular, unanswered, etc.)
- Responsive design for all devices
- User statistics dashboard
- Admin panel for basic management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation
- **Rich Text Editor**: Custom implementation
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + bcrypt
- **File Upload**: Cloudinary + Multer
- **Validation**: class-validator
- **Security**: Helmet, CORS

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Database**: PostgreSQL
- **API Testing**: Postman

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stackit.git
   cd stackit
   ```

2. **Install frontend dependencies**
   ```bash
   pnpm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   pnpm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
   
   Create `.env` in the backend directory:
   ```env
   PORT=8000
   DATABASE_URL=postgresql://username:password@localhost:5432/stackit
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

5. **Set up the database**
   ```bash
   cd backend
   # Create database
   createdb stackit
   
   # Run migrations
   pnpm typeorm migration:run
   
   # Seed the database (optional)
   pnpm seed
   cd ..
   ```

6. **Start the development servers**

   Terminal 1 (Backend):
   ```bash
   cd backend
   pnpm dev
   ```

   Terminal 2 (Frontend):
   ```bash
   pnpm dev
   ```

7. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api