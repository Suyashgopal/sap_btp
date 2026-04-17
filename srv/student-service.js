const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const { Students } = this.entities;

    this.before('CREATE', Students, async (req) => {
        const student = req.data;
        
        if (student.age <= 0) {
            req.error(400, 'Age must be greater than 0');
            return;
        }
        
        if (!student.name || student.name.trim().length < 2) {
            req.error(400, 'Name must be at least 2 characters long');
            return;
        }
        
        if (!student.course || student.course.trim().length < 3) {
            req.error(400, 'Course must be at least 3 characters long');
            return;
        }
    });

    this.before('UPDATE', Students, async (req) => {
        const student = req.data;
        
        if (student.age !== undefined && student.age <= 0) {
            req.error(400, 'Age must be greater than 0');
            return;
        }
        
        if (student.name !== undefined && student.name.trim().length < 2) {
            req.error(400, 'Name must be at least 2 characters long');
            return;
        }
        
        if (student.course !== undefined && student.course.trim().length < 3) {
            req.error(400, 'Course must be at least 3 characters long');
            return;
        }
    });
});
