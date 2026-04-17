const cds = require('@sap/cds');

/**
 * Student Management Service Implementation
 * Handles CRUD operations with validation logic
 */
module.exports = cds.service.impl(async function() {
    console.log('Student Service Implementation loaded successfully!');
    const { Students } = this.entities;

    /**
     * Before creating a student, validate the input data
     */
    this.before('CREATE', Students, async (req) => {
        const student = req.data;
        
        // Validate age must be greater than 0
        if (student.age <= 0) {
            req.error(400, 'Age must be greater than 0');
            return;
        }
        
        // Validate name is not empty
        if (!student.name || student.name.trim() === '') {
            req.error(400, 'Name is required');
            return;
        }
        
        // Validate course is not empty
        if (!student.course || student.course.trim() === '') {
            req.error(400, 'Course is required');
            return;
        }
        
        // Add timestamps
        const now = new Date().toISOString();
        student.createdAt = now;
        student.updatedAt = now;
        
        console.log('Creating student:', student);
    });

    /**
     * Before updating a student, validate the input data
     */
    this.before('UPDATE', Students, async (req) => {
        const student = req.data;
        
        // Validate age if provided
        if (student.age !== undefined && student.age <= 0) {
            req.error(400, 'Age must be greater than 0');
            return;
        }
        
        // Validate name if provided
        if (student.name !== undefined && (!student.name || student.name.trim() === '')) {
            req.error(400, 'Name is required');
            return;
        }
        
        // Validate course if provided
        if (student.course !== undefined && (!student.course || student.course.trim() === '')) {
            req.error(400, 'Course is required');
            return;
        }
        
        // Add updated timestamp
        student.updatedAt = new Date().toISOString();
        
        console.log('Updating student:', student);
    });

    /**
     * After reading students, log the operation
     */
    this.after('READ', Students, (data) => {
        console.log('Read students operation completed');
        return data;
    });

    /**
     * Before deleting a student, check if student exists
     */
    this.before('DELETE', Students, async (req) => {
        const studentId = req.data.ID;
        console.log('Deleting student with ID:', studentId);
    });

    /**
     * Custom action to get students by course
     */
    this.on('getStudentsByCourse', async (req) => {
        const course = req.data.course;
        
        if (!course) {
            req.error(400, 'Course parameter is required');
            return;
        }
        
        const students = await SELECT.from(Students)
            .where({ course: course });
            
        return students;
    });

    /**
     * Custom action to get student statistics
     */
    this.on('getStudentStats', async () => {
        const totalStudents = await SELECT.from(Students).count();
        const courses = await SELECT.from(Students).distinct('course');
        
        return {
            totalStudents: totalStudents,
            totalCourses: courses.length,
            courses: courses
        };
    });
});
