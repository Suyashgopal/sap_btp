namespace my.student.management;

/**
 * Student Management Data Model
 * Defines the Students entity with basic student information
 */
entity Students {
    key ID      : UUID;          // Unique identifier for each student
    name        : String(100);   // Student's full name
    age         : Integer;       // Student's age (must be > 0)
    course      : String(50);    // Course the student is enrolled in
    createdAt   : DateTime;      // Timestamp when record was created
    updatedAt   : DateTime;      // Timestamp when record was last updated
}
