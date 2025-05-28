# FINSYN Tips Platform

## Project Overview
FINSYN Tips Platform is a cryptocurrency tipping platform that enables content creators and users to exchange tips in a secure and efficient way. The platform aims to revolutionize the way people show appreciation for content by providing a seamless cryptocurrency tipping experience.

### Purpose
- Enable instant cryptocurrency tips between users
- Provide a secure and transparent tipping system
- Support content creators with a new monetization method
- Create a community-driven platform for value exchange

### Key Features
- Secure user authentication and authorization
- Real-time tip transactions
- User profile management
- Transaction history
- Cryptocurrency wallet integration
- Role-based access control

## Data Model

### Database Schema

#### User Entity
```java
@Entity
@Table(name = "USER_")
public class User {
    @Id
    private String email;
    private String firstname;
    private String lastname;
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    @OneToMany(mappedBy = "sender")
    private List<Tip> sentTips;
    
    @OneToMany(mappedBy = "receiver")
    private List<Tip> receivedTips;
}
```

#### Tip Entity
```java
@Entity
@Table(name = "TIP")
public class Tip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;
    
    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User receiver;
    
    private BigDecimal amount;
    private String currency;
    private String message;
    private LocalDateTime timestamp;
    private TipStatus status;
}
```

### Entity Relationships
1. **User-Tip Relationship**
   - One-to-Many relationship between User and Tip
   - A user can send multiple tips (sentTips)
   - A user can receive multiple tips (receivedTips)

2. **Tip Status Flow**
   - PENDING: Initial state when tip is created
   - PROCESSING: During cryptocurrency transaction
   - COMPLETED: Successfully transferred
   - FAILED: Transaction failed

### Database Tables
1. **USER_**
   - email (PK)
   - firstname
   - lastname
   - gender

2. **TIP**
   - id (PK)
   - sender_id (FK)
   - receiver_id (FK)
   - amount
   - currency
   - message
   - timestamp
   - status

## Business Logic

### Tip Processing Flow
1. User initiates a tip
2. System validates user balance
3. Cryptocurrency transaction is processed
4. Tip status is updated
5. Both users are notified

### Security Measures
1. **Authentication**
   - Keycloak-based authentication
   - JWT token validation
   - Role-based access control

2. **Transaction Security**
   - Encrypted wallet connections
   - Secure transaction signing
   - Multi-factor authentication for large amounts

## Technical Implementation

### Frontend Components
1. **User Interface**
   - Modern, responsive design
   - Real-time updates
   - Intuitive tipping flow

2. **Wallet Integration**
   - Secure wallet connection
   - Transaction status monitoring
   - Balance display

### Backend Services
1. **User Service**
   - User management
   - Profile updates
   - Authentication handling

2. **Tip Service**
   - Tip processing
   - Transaction management
   - Status updates

3. **Wallet Service**
   - Cryptocurrency operations
   - Balance management
   - Transaction verification

## Overview
FINSYN Tips Platform is a modern web application that enables users to send and receive tips using cryptocurrency. The platform is built using a microservices architecture with Angular frontend and Spring Boot backend, secured by Keycloak authentication.

## Architecture

### Technology Stack
- **Frontend**: Angular 15+
- **Backend**: Spring Boot 2.7.5
- **Database**: PostgreSQL 14.4
- **Authentication**: Keycloak 20.0.0
- **Containerization**: Docker

### System Components
1. **Frontend Application (Angular)**
   - Modern UI with Material Design
   - Responsive layout
   - Secure authentication flow
   - Real-time updates

2. **Backend Service (Spring Boot)**
   - RESTful API
   - JWT token validation
   - User management
   - Database integration

3. **Authentication Service (Keycloak)**
   - User authentication
   - Role-based access control
   - User registration
   - Session management

4. **Database (PostgreSQL)**
   - User data storage
   - Transaction records
   - Secure data management

## Setup and Installation

### Prerequisites
- Docker and Docker Compose
- JDK 11 or higher
- Node.js 14+ and npm
- Maven

### Environment Setup
1. Clone the repository
2. Configure environment variables
3. Start the services using Docker Compose

### Docker Services
```yaml
services:
  postgresql:
    - Database service
    - Port: 5432
    - Credentials: admin/admin

  pgadmin:
    - Database management interface
    - Port: 81
    - Credentials: admin@admin.com/admin

  keycloak:
    - Authentication service
    - Port: 8081
    - Admin credentials: admin/admin
```

## Configuration

### Keycloak Setup
1. Create a new realm: 'test-app'
2. Configure clients:
   - Backend client (for Spring Boot)
   - Frontend client (for Angular)
3. Set up roles and permissions
4. Enable user registration

### Spring Boot Configuration
- Server port: 8080
- Database connection
- Keycloak integration
- Security settings

### Angular Configuration
- Development server: 4200
- API proxy configuration
- Keycloak client setup
- Environment variables

## Security

### Authentication Flow
1. User login through Keycloak
2. JWT token generation
3. Token validation in Spring Boot
4. Role-based access control

### Security Features
- JWT token-based authentication
- Role-based authorization
- Secure password handling
- CORS configuration
- SSL/TLS support

## API Documentation

### Endpoints
1. User Management
   - GET /userInfo1 - Get user info from database
   - GET /userInfo2 - Get user info from token

2. Authentication
   - POST /login - User login
   - POST /logout - User logout
   - GET /register - User registration

## Development

### Frontend Development
```bash
cd angular-app
npm install
ng serve
```

### Backend Development
```bash
cd spring-app
mvn spring-boot:run
```

### Database Management
- Access pgAdmin at http://localhost:81
- Connect to PostgreSQL at localhost:5432

## Deployment

### Production Requirements
- Azure account
- Azure CLI
- Docker registry access

### Deployment Steps
1. Build Docker images
2. Configure Azure services
3. Deploy database
4. Deploy Keycloak
5. Deploy backend
6. Deploy frontend

## Monitoring and Maintenance

### Logging
- Spring Boot logs
- Keycloak logs
- Angular error tracking

### Performance Monitoring
- Database performance
- API response times
- Frontend performance

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support, please contact the development team or create an issue in the repository.

## Git Repository Setup

### Initial Setup
1. Initialize Git repository:
```bash
git init
```

2. Add all files:
```bash
git add .
```

3. Make initial commit:
```bash
git commit -m "Initial commit: FINSYN Tips Platform"
```

4. Add remote repository:
```bash
git remote add origin <your-repository-url>
```

5. Push to remote:
```bash
git push -u origin main
```

### Project Structure
```
finsyn-tips-platform/
├── angular-app/           # Frontend application
│   ├── src/              # Source code
│   ├── package.json      # Dependencies
│   └── angular.json      # Angular configuration
├── spring-app/           # Backend application
│   ├── src/              # Source code
│   └── pom.xml           # Maven configuration
├── docs/                 # Documentation
├── docker-compose.yml    # Docker configuration
└── README.md            # Project documentation
```

### Important Files to Track
- Source code files
- Configuration files
- Documentation
- Docker configuration
- Package management files (package.json, pom.xml)

### Files to Ignore
- Build outputs
- Dependencies
- IDE files
- Environment files
- Log files
- System files

### Best Practices
1. Always check `.gitignore` before committing
2. Keep sensitive data out of repository
3. Use meaningful commit messages
4. Create separate branches for features
5. Review changes before pushing
