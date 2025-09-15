# Flight Reservation System

Advanced Flight Reservation System built with Spring Boot, featuring seat management, transactional coherence, and comprehensive audit trails.

## Features

### Core Functionality
- **Flight Management**: Complete CRUD operations for flights with filtering and sorting
- **Seat Reservation**: Real-time seat availability checking with concurrency handling
- **Optimistic Locking**: Prevents reservation conflicts in high-concurrency scenarios
- **Audit Trail**: Complete logging of all reservation attempts (success/failure)
- **Caching**: Performance optimization for seat availability queries
- **Retry Mechanism**: Automatic retry on concurrent conflicts

### Advanced Features
- **Bean Validation**: Comprehensive request validation
- **Global Exception Handling**: Structured error responses
- **Event-Driven Architecture**: Decoupled audit logging using Spring Events
- **Asynchronous Processing**: Non-blocking audit log creation
- **Extensive Testing**: Unit and integration tests with concurrency testing

## API Endpoints

### Flights
- `GET /api/vols` - Retrieve flights with optional filtering and sorting
- `POST /api/vols` - Add flights to the database

### Reservations
- `POST /api/reservations` - Create a seat reservation

## Quick Start

1. **Build the application**:
   ```bash
   mvn clean package
   ```

2. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

3. **Access the API** at `http://localhost:8080`

## Example Usage

### Create Flights
```bash
curl -X POST http://localhost:8080/api/vols \
  -H "Content-Type: application/json" \
  -d '[{
    "dateDepart": "2024-01-15T10:00:00",
    "dateArrivee": "2024-01-15T12:00:00",
    "villeDepart": "Paris",
    "villeArrivee": "Lyon",
    "prix": 150.00,
    "tempsTrajet": 120,
    "capaciteMaximale": 180
  }]'
```

### Make Reservation
```bash
curl -X POST http://localhost:8080/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "volId": "uuid-du-vol",
    "passager": {
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@email.com"
    },
    "nombrePlaces": 2
  }'
```

### Filter Flights
```bash
curl "http://localhost:8080/api/vols?villeDepart=Paris&tri=prix"
```

## Technical Architecture

- **Framework**: Spring Boot 3.2 with Java 17
- **Database**: SQLite with JPA/Hibernate
- **Caching**: Caffeine Cache with automatic eviction
- **Concurrency**: Optimistic locking with retry mechanism
- **Testing**: JUnit 5 with MockMvc and TestContainers
- **Architecture**: Clean layered architecture with event-driven audit

## Testing

Run the comprehensive test suite:
```bash
mvn test
```

The test suite includes:
- Unit tests for service layer
- Integration tests with full Spring context
- Concurrency tests using CompletableFuture
- Validation and error handling tests

## Database Schema

The system uses the following main entities:
- **Vol**: Flight information with optimistic locking
- **Reservation**: Passenger reservations
- **AuditLog**: Complete audit trail of reservation attempts
- **Passager**: Embedded passenger information

## Performance Features

- **Caching**: Seat availability cached with automatic eviction
- **Optimistic Locking**: Minimal database locks for high throughput
- **Async Processing**: Non-blocking audit log creation
- **Connection Pooling**: Optimized database connections

This implementation demonstrates enterprise-level Java development with Spring Boot best practices, comprehensive error handling, and production-ready features.