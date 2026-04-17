# Student Management System

A production-ready Student Management System built with **SAP CAP (Cloud Application Programming Model)**, **SAP HANA Cloud**, and **SAP BTP (Business Technology Platform)**.

## Features

- **Add Student**: Create new student records with validation
- **View Students**: Display all students in a responsive table
- **Update Student**: Edit existing student information
- **Delete Student**: Remove student records with confirmation
- **Data Validation**: Automatic validation for age, name, and course fields
- **Responsive Design**: Mobile-friendly UI using modern CSS
- **Error Handling**: Comprehensive error messages and loading states

## Tech Stack

- **Backend**: SAP CAP (Node.js)
- **Database**: SAP HANA Cloud
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Deployment**: SAP BTP Cloud Foundry
- **Authentication**: XSUAA
- **Data Modeling**: CDS (Core Data Services)

## Project Structure

```
student-management/
|
|-- db/                          # Database layer
|   |-- data-model.cds           # CDS data model for Students entity
|   |-- csv/
|       |-- Students.csv         # Sample data
|
|-- srv/                         # Service layer
|   |-- cat-service.cds          # Service definition
|   |-- student-service.js       # Business logic and validation
|
|-- app/                         # Frontend application
|   |-- index.html               # Main HTML page
|   |-- styles.css               # CSS styling
|   |-- script.js                # JavaScript functionality
|
|-- package.json                 # Node.js dependencies and scripts
|-- mta.yaml                     # Multi-Target Application descriptor
|-- xs-security.json             # Security configuration
|-- .cdsrc.json                  # CAP configuration
|-- .gitignore                   # Git ignore rules
|-- README.md                    # This file
```

## Prerequisites

1. **Node.js** (version 14 or higher)
2. **SAP CAP CLI** (`npm install -g @sap/cds-dk`)
3. **SAP BTP Account** with Cloud Foundry access
4. **SAP HANA Cloud** instance
5. **Multi-Tenant Application (MTA) Build Tool** (`npm install -g mbt`)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd student-management

# Install Node.js dependencies
npm install
```

### 2. Local Development Setup

#### Option A: Using SQLite (for quick testing)

Update `package.json` to use SQLite:

```json
"cds": {
  "requires": {
    "db": {
      "kind": "sqlite",
      "credentials": {
        "url": "db.sqlite"
      }
    }
  }
}
```

#### Option B: Using SAP HANA Cloud

1. Create a SAP HANA Cloud instance in your BTP account
2. Update the database credentials in `package.json`:

```json
"cds": {
  "requires": {
    "db": {
      "kind": "hana",
      "credentials": {
        "database": "YOUR_DATABASE",
        "host": "YOUR_HANA_HOST",
        "port": "39013",
        "user": "YOUR_USER",
        "password": "YOUR_PASSWORD"
      }
    }
  }
}
```

### 3. Run Locally

```bash
# Start the development server
npm run watch

# Or alternatively
cds watch
```

The application will be available at: `http://localhost:4004`

### 4. Access the Application

- **Frontend UI**: `http://localhost:4004`
- **OData Service**: `http://localhost:4004/odata/v4/catalog/Students`
- **Service Documentation**: `http://localhost:4004/odata/v4/catalog/$metadata`

## API Endpoints

### Students Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/odata/v4/catalog/Students` | Get all students |
| GET | `/odata/v4/catalog/Students({ID})` | Get specific student |
| POST | `/odata/v4/catalog/Students` | Create new student |
| PATCH | `/odata/v4/catalog/Students({ID})` | Update student |
| DELETE | `/odata/v4/catalog/Students({ID})` | Delete student |

### Custom Actions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/odata/v4/catalog/getStudentsByCourse` | Get students by course |
| POST | `/odata/v4/catalog/getStudentStats` | Get student statistics |

## Data Model

### Students Entity

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| ID | UUID | Primary Key | Unique identifier |
| name | String(100) | Required | Student's full name |
| age | Integer | > 0 | Student's age |
| course | String(50) | Required | Enrolled course |
| createdAt | DateTime | Auto | Creation timestamp |
| updatedAt | DateTime | Auto | Update timestamp |

## Deployment to SAP BTP

### 1. Install Required Tools

```bash
# Install Cloud Foundry CLI
# Download from: https://github.com/cloudfoundry/cli/releases

# Install MTA Build Tool
npm install -g mbt

# Install SAP CAP Development Kit
npm install -g @sap/cds-dk
```

### 2. Configure BTP

1. Log in to your SAP BTP account:
```bash
cf login -a https://api.cf.<region>.hana.ondemand.com -u <username> -p <password> -o <org> -s <space>
```

2. Create required services:
```bash
# Create HANA HDI Container
cf create-service hana hdi-shared student-management-hdi-container -c '{"schema":"STUDENT_MANAGEMENT"}'

# Create XSUAA Service
cf create-service xsuaa application student-management-uaa -c xs-security.json
```

### 3. Build and Deploy

```bash
# Build the MTA project
npm run build
# Or: mbt build

# Deploy to SAP BTP
npm run deploy
# Or: cf deploy mta_archives/student-management_1.0.0.mtar
```

### 4. Access Deployed Application

After successful deployment, the application will be available at:
`https://student-management-app.<space>.<region>.apps.<domain>`

## Testing the Application

### Manual Testing Steps

1. **Add Student Test**:
   - Navigate to the application
   - Fill in the form with valid data (name, age > 0, course)
   - Click "Add Student"
   - Verify the student appears in the table

2. **Update Student Test**:
   - Click "Edit" button on any student
   - Modify the student information
   - Click "Update Student"
   - Verify the changes are reflected

3. **Delete Student Test**:
   - Click "Delete" button on any student
   - Confirm the deletion
   - Verify the student is removed from the table

4. **Validation Test**:
   - Try to add a student with age <= 0
   - Try to add a student with empty name or course
   - Verify appropriate error messages

### API Testing (using curl)

```bash
# Get all students
curl -X GET "http://localhost:4004/odata/v4/catalog/Students"

# Create a new student
curl -X POST "http://localhost:4004/odata/v4/catalog/Students" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","age":20,"course":"Computer Science"}'

# Update a student
curl -X PATCH "http://localhost:4004/odata/v4/catalog/Students(STUDENT_ID)" \
  -H "Content-Type: application/json" \
  -d '{"age":21}'

# Delete a student
curl -X DELETE "http://localhost:4004/odata/v4/catalog/Students(STUDENT_ID)"
```

## Screenshots Instructions

When documenting your project, capture the following screenshots:

1. **Project Structure**: Show the complete folder structure
2. **Application Running**: Browser view of the main application
3. **Add Student**: Form filled with sample data
4. **Students List**: Table showing multiple students
5. **Edit Student**: Form in edit mode with existing data
6. **Error Handling**: Validation error messages
7. **BTP Deployment**: Cloud Foundry deployment success message
8. **Deployed App**: Live application on BTP URL

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify HANA credentials in `package.json`
   - Check network connectivity to HANA instance
   - Ensure HANA instance is running

2. **Authentication Issues**:
   - Verify XSUAA service configuration
   - Check `xs-security.json` for correct scopes
   - Ensure proper role assignments

3. **Build Errors**:
   - Run `npm install` to refresh dependencies
   - Clear cache: `rm -rf .gen node_modules`
   - Rebuild: `cds build`

4. **Deployment Failures**:
   - Verify BTP account permissions
   - Check service availability in target space
   - Review deployment logs with `cf logs <app-name> --recent`

### Getting Help

- SAP CAP Documentation: https://cap.cloud.sap/docs/
- SAP BTP Documentation: https://help.sap.com/viewer/product/SAP_BTP/Cloud
- Community Forums: https://answers.sap.com/tags/73555000100800000886

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Version History

- **v1.0.0** - Initial release with full CRUD functionality
  - Student entity with validation
  - Responsive frontend UI
  - SAP BTP deployment support
  - Comprehensive documentation
