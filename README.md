# Team Todo App - Production-Ready Demo

A full-stack, multi-tenant todo application showcasing production-ready patterns and best practices. Built to demonstrate how Claude Code can create high-quality, enterprise-grade applications when provided with proper architectural guidance.

## 🎯 Project Goals

This demo application showcases:
- **Code Quality**: Following industry best practices and patterns
- **Full-Stack Integration**: Seamless frontend-backend communication
- **Multi-Tenancy**: Complete team isolation with secure authentication
- **Production Readiness**: Error handling, monitoring, and deployment
- **Developer Experience**: Type safety, testing, and documentation

## 🚀 Key Features

### Authentication & Security
- Email-based passwordless authentication
- Team-based multi-tenancy
- Role-based access control (Admin/Member)
- JWT token authentication with refresh mechanism
- Invite-only team joining with secure tokens

### Todo Management
- Create and manage multiple todo lists
- Assign todos to team members
- Due dates and completion tracking
- Real-time updates across team members
- Search and filter capabilities
- Activity history and audit trail

### Team Management
- Create teams during sign-up
- Invite team members via secure links
- Manage member roles and permissions
- View team activity and statistics
- Remove members with data preservation

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript (strict mode)
- **Material-UI** for consistent, accessible UI
- **React Query** for server state management
- **Zustand** for UI state management
- **React Hook Form + Yup** for form handling
- **Vite** for fast builds and HMR

### Backend
- **.NET 9** with Minimal APIs
- **Entity Framework Core** with PostgreSQL
- **JWT Authentication** with multi-tenant support
- **OpenTelemetry** for observability
- **Feature-based architecture** for maintainability

### Infrastructure
- **Docker** containerization
- **Docker Compose** for local development
- **GitHub Actions** for CI/CD
- **Nginx** for frontend serving
- **PostgreSQL** for data persistence

## 📁 Project Structure

```
├── docs/                          # Documentation
│   ├── system-architecture.md     # High-level architecture
│   ├── user-stories-*.md         # Feature specifications
│   └── api-documentation.md      # API reference
├── src/
│   ├── TodoApp.Web/             # React application
│   │   ├── src/
│   │   │   ├── apis/            # API client layer
│   │   │   ├── components/      # React components
│   │   │   ├── hooks/           # Custom hooks
│   │   │   ├── pages/           # Route pages
│   │   │   ├── stores/          # Zustand stores
│   │   │   └── schemas/         # Validation schemas
│   │   ├── Dockerfile           # Production build
│   │   └── Dockerfile.dev       # Development with hot reload
│   └── TodoApp.Api/             # .NET API
│       ├── Features/            # Feature modules
│       │   └── HealthCheck/
│       ├── Data/                # EF Core context
│       ├── Migrations/          # Database migrations
│       ├── Dockerfile           # Production build
│       └── Dockerfile.dev       # Development with hot reload
├── .github/
│   └── workflows/              # CI/CD pipelines
├── docker-compose.yml          # Local development
└── README.md                   # You are here!
```

## 🚦 Getting Started

### Prerequisites
- Docker Desktop installed
- Node.js 20+ (for local frontend development)
- .NET 9 SDK (for local backend development)
- Git

### Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/your-username/team-todo-app.git
cd team-todo-app
```

2. Start development environment:
```bash
./scripts/dev-start.sh
```

3. Access the application:
- Frontend: http://localhost:5180
- API: http://localhost:5050
- API Docs: http://localhost:5050/swagger
- MailDev: http://localhost:1090

To stop:
```bash
./scripts/dev-stop.sh
```

### Production Build

Build and run production containers:
```bash
./scripts/prod-build.sh
docker compose --profile production up -d
```

Production URLs:
- Frontend: http://localhost:8080
- API is proxied through nginx at http://localhost:8080/api

### Local Development (without Docker)

**Backend:**
```bash
cd src/TodoApp.Api
dotnet watch run
```

**Frontend:**
```bash
cd src/TodoApp.Web
npm install
npm run dev
```

## 🧪 Testing

### Running Tests

**All tests:**
```bash
docker compose -f docker-compose.test.yml up
```

**Frontend tests:**
```bash
cd src/TodoApp.Web
npm test                # Unit tests
npm run test:e2e       # E2E tests (when implemented)
```

**Backend tests:**
```bash
cd src/TodoApp.Api
dotnet test            # Unit + Integration tests
```

## 📊 Architecture Highlights

### Multi-Tenant Design
- Complete data isolation per team
- Team context in JWT claims
- Automatic tenant filtering in queries
- Secure invite-only team joining

### Security First
- Passwordless authentication
- Email verification required
- Role-based permissions
- Rate limiting on all endpoints
- Audit logging for compliance

### Production Patterns
- Health checks for all services
- Structured logging
- Graceful error handling
- Database migrations
- Optimistic UI updates

## 🚀 Deployment

### GitHub Actions CI/CD
- Automated testing on PR
- Container building and scanning
- Staging deployment
- Production release workflow

### Production Considerations
- Environment-specific configs
- Secret management
- Database backup strategy
- Monitoring and alerting
- Zero-downtime deployments

## 📚 Documentation

- [System Architecture](./docs/system-architecture.md) - Technical design details
- [User Stories](./docs/) - Complete feature specifications
- [API Documentation](./docs/api-documentation.md) - Endpoint reference
- [Development Guide](./docs/development-guide.md) - Setup and contribution

## 🤝 Contributing

This is a demo application showcasing Claude Code capabilities. While not actively seeking contributions, the codebase demonstrates patterns for:
- Code organization
- Testing strategies
- Documentation standards
- CI/CD workflows

### Development Workflow
1. **Branching**: Follow our [Branching Strategy](./docs/BRANCHING_STRATEGY.md)
   - Use feature branches: `feat/`, `fix/`, `refactor/`, etc.
   - Target `develop` branch for integration
   - Squash commits when merging

2. **Commits**: Follow [Conventional Commits](./docs/CONVENTIONAL_COMMITS.md)
   - Format: `type(scope): description`
   - Examples: `feat(auth): add email verification`

3. **Pull Requests**: 
   - Must pass all tests
   - Require code review
   - Update documentation as needed

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built with architectural guidance from production applications, demonstrating how AI-assisted development can produce enterprise-quality code when provided with proper patterns and best practices.

---

**Note**: This is a demonstration application showcasing full-stack development patterns. It includes intentional over-engineering in some areas to demonstrate various architectural concepts and best practices.