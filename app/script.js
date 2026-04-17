class StudentManager {
    constructor() {
        this.apiBase = '/catalog/Students';
        this.students = [];
        this.editingStudentId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStudents();
    }

    bindEvents() {
        document.getElementById('studentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.resetForm();
        });
    }

    async loadStudents() {
        try {
            this.showLoading(true);
            const response = await fetch(this.apiBase);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.students = data.value || [];
            this.renderStudents();
            this.updateStats();
            this.showLoading(false);
        } catch (error) {
            console.error('Error loading students:', error);
            this.showError('Failed to load students. Please try again.');
            this.showLoading(false);
        }
    }

    async handleFormSubmit() {
        const formData = this.getFormData();
        
        if (formData.age <= 0) {
            this.showError('Age must be greater than 0');
            return;
        }
        
        if (formData.name.length < 2) {
            this.showError('Name must be at least 2 characters long');
            return;
        }
        
        if (formData.course.length < 3) {
            this.showError('Course must be at least 3 characters long');
            return;
        }
        
        try {
            this.showLoading(true);
            
            let response;
            if (this.editingStudentId) {
                response = await fetch(`${this.apiBase}(${this.editingStudentId})`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
            } else {
                response = await fetch(this.apiBase, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }
            
            this.showSuccess(this.editingStudentId ? 'Student updated successfully!' : 'Student added successfully!');
            this.resetForm();
            await this.loadStudents();
            this.showLoading(false);
        } catch (error) {
            console.error('Error saving student:', error);
            this.showError(error.message || 'Failed to save student. Please try again.');
            this.showLoading(false);
        }
    }

    async deleteStudent(studentId) {
        if (!confirm('Are you sure you want to delete this student?')) {
            return;
        }
        
        try {
            this.showLoading(true);
            const response = await fetch(`${this.apiBase}(${studentId})`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }
            
            this.showSuccess('Student deleted successfully!');
            await this.loadStudents();
            this.showLoading(false);
        } catch (error) {
            console.error('Error deleting student:', error);
            this.showError('Failed to delete student. Please try again.');
            this.showLoading(false);
        }
    }

    editStudent(studentId) {
        const student = this.students.find(s => s.ID === studentId);
        if (!student) return;
        
        this.editingStudentId = studentId;
        document.getElementById('studentId').value = studentId;
        document.getElementById('name').value = student.name;
        document.getElementById('age').value = student.age;
        document.getElementById('course').value = student.course;
        
        document.getElementById('formTitle').textContent = 'Edit Student';
        document.getElementById('submitBtn').textContent = 'Update Student';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }

    resetForm() {
        document.getElementById('studentForm').reset();
        document.getElementById('studentId').value = '';
        this.editingStudentId = null;
        
        document.getElementById('formTitle').textContent = 'Add New Student';
        document.getElementById('submitBtn').textContent = 'Add Student';
        document.getElementById('cancelBtn').style.display = 'none';
    }

    getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            age: parseInt(document.getElementById('age').value),
            course: document.getElementById('course').value.trim()
        };
    }

    renderStudents() {
        const tbody = document.getElementById('studentsTableBody');
        const noDataMessage = document.getElementById('noDataMessage');
        
        if (this.students.length === 0) {
            tbody.innerHTML = '';
            noDataMessage.style.display = 'block';
            return;
        }
        
        noDataMessage.style.display = 'none';
        tbody.innerHTML = this.students.map(student => `
            <tr>
                <td>${this.truncateId(student.ID)}</td>
                <td>${this.escapeHtml(student.name)}</td>
                <td>${student.age}</td>
                <td>${this.escapeHtml(student.course)}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-edit" onclick="studentManager.editStudent('${student.ID}')">Edit</button>
                        <button class="btn btn-delete" onclick="studentManager.deleteStudent('${student.ID}')">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    updateStats() {
        const totalStudents = document.getElementById('totalStudents');
        totalStudents.textContent = `Total: ${this.students.length} student${this.students.length !== 1 ? 's' : ''}`;
    }

    showLoading(show) {
        const loadingMessage = document.getElementById('loadingMessage');
        loadingMessage.style.display = show ? 'block' : 'none';
    }

    showError(message) {
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    showSuccess(message) {
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }

    truncateId(id) {
        if (!id) return '';
        return id.substring(0, 8) + '...';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.studentManager = new StudentManager();
});

window.editStudent = (id) => {
    window.studentManager.editStudent(id);
};

window.deleteStudent = (id) => {
    window.studentManager.deleteStudent(id);
};
