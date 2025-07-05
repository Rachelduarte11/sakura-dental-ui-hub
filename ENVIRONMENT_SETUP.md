# Environment Setup

This project uses environment variables to configure the API URL for different deployment environments.

## Setup Instructions

### 1. Create Environment File

Create a `.env.local` file in the root of your frontend project:

```bash
# Development (local)
NEXT_PUBLIC_API_URL=http://localhost:8080

# Production (replace with your actual backend URL)
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### 2. Environment Variables

- `NEXT_PUBLIC_API_URL`: The base URL of your Spring Boot backend API
  - **Development**: `http://localhost:8080`
  - **Production**: `https://your-backend-domain.com`

### 3. Deployment Environments

#### Development
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

#### Production
```bash
# .env.local or environment variable
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

#### Vercel Deployment
Set the environment variable in your Vercel dashboard:
- Go to your project settings
- Add environment variable: `NEXT_PUBLIC_API_URL`
- Set value to your production backend URL

#### Docker Deployment
```bash
# docker-compose.yml
environment:
  - NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### 4. API Endpoints

The application automatically uses the configured API URL for all endpoints:

- Login: `${API_URL}/api/auth/login`
- Logout: `${API_URL}/api/auth/logout`
- Username: `${API_URL}/api/users/username`
- And all other CRUD endpoints...

### 5. Testing

After setting up the environment variable:

1. Restart your Next.js development server
2. Test the login functionality
3. Verify that API calls are going to the correct URL

### 6. Security Notes

- The `NEXT_PUBLIC_` prefix makes the variable available in the browser
- This is safe for API URLs as they are not sensitive secrets
- For sensitive data, use regular environment variables (without `NEXT_PUBLIC_`) 