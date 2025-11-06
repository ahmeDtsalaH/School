<template>
  <div class="students">
    <div class="page-header">
      <h2>إدارة الطلاب</h2>
      <button class="btn btn-primary" @click="openAddStudentModal">
        <i class="fas fa-plus"></i>
        إضافة طالب
      </button>
    </div>

    <div class="filters card">
      <div class="filter-group">
        <label>بحث:</label>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="ابحث عن طالب..."
          @input="searchStudents"
        />
      </div>
      <div class="filter-group">
        <label>الفصل:</label>
        <select v-model="selectedClass" @change="filterStudents">
          <option value="">جميع الفصول</option>
          <option value="الصف الأول">الصف الأول</option>
          <option value="الصف الثاني">الصف الثاني</option>
          <option value="الصف الثالث">الصف الثالث</option>
        </select>
      </div>
    </div>

    <div class="loading" v-if="loading">
      جاري تحميل البيانات...
    </div>

    <div class="students-table card" v-else>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>الفصل</th>
            <th>البريد الإلكتروني</th>
            <th>الهاتف</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in filteredStudents" :key="student.id">
            <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.class }}</td>
            <td>{{ student.email }}</td>
            <td>{{ student.phone }}</td>
            <td>
              <span class="status-badge" :class="student.status">
                {{ student.status === 'active' ? 'نشط' : 'غير نشط' }}
              </span>
            </td>
            <td>
              <button class="btn-icon" @click="editStudent(student)">
                <i class="fas fa-edit"></i>
              </button>
              <button
                class="btn-icon btn-danger"
                @click="deleteStudent(student.id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- التصفح -->
      <div class="pagination" v-if="students.length > 0">
        <button 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
        >
          السابق
        </button>
        <span>الصفحة {{ currentPage }}</span>
        <button 
          :disabled="filteredStudents.length < perPage" 
          @click="changePage(currentPage + 1)"
        >
          التالي
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveStudent">
            <div class="form-group">
              <label>الاسم الكامل:</label>
              <input type="text" v-model="studentForm.name" required>
            </div>
            <div class="form-group">
              <label>البريد الإلكتروني:</label>
              <input type="email" v-model="studentForm.email" required>
            </div>
            <div class="form-group">
              <label>الهاتف:</label>
              <input type="tel" v-model="studentForm.phone" required>
            </div>
            <div class="form-group">
              <label>الفصل:</label>
              <select v-model="studentForm.class" required>
                <option value="الصف الأول">الصف الأول</option>
                <option value="الصف الثاني">الصف الثاني</option>
                <option value="الصف الثالث">الصف الثالث</option>
              </select>
            </div>
            <div class="form-group">
              <label>الحالة:</label>
              <select v-model="studentForm.status" required>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">إلغاء</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                {{ saving ? 'جاري الحفظ...' : 'حفظ' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '../http';

export default {
  name: 'Students',
  data() {
    return {
      loading: false,
      saving: false,
      students: [],
      searchQuery: '',
      selectedClass: '',
      currentPage: 1,
      perPage: 10,
      showModal: false,
      modalTitle: '',
      editingStudent: null,
      studentForm: {
        name: '',
        email: '',
        phone: '',
        class: 'الصف الأول',
        status: 'active'
      }
    };
  },
  computed: {
    filteredStudents() {
      let filtered = this.students;

      if (this.searchQuery) {
        filtered = filtered.filter(
          (student) =>
            student.name.includes(this.searchQuery) ||
            student.email.includes(this.searchQuery)
        );
      }

      if (this.selectedClass) {
        filtered = filtered.filter(
          (student) => student.class === this.selectedClass
        );
      }

      // التصفح البسيط
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return filtered.slice(start, end);
    }
  },
  async mounted() {
    await this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      this.loading = true;
      try {
        const response = await http.get('/students');
        this.students = response.data;
      } catch (error) {
        console.error('Error fetching students:', error);
        alert('حدث خطأ في جلب بيانات الطلاب');
      } finally {
        this.loading = false;
      }
    },

    async searchStudents() {
      if (this.searchQuery.length > 2) {
        try {
          const response = await http.get(`/students/search/${this.searchQuery}`);
          this.students = response.data;
        } catch (error) {
          console.error('Error searching students:', error);
        }
      } else if (this.searchQuery.length === 0) {
        await this.fetchStudents();
      }
    },

    filterStudents() {
      this.currentPage = 1;
    },

    changePage(page) {
      this.currentPage = page;
    },

    openAddStudentModal() {
      this.modalTitle = 'إضافة طالب جديد';
      this.editingStudent = null;
      this.studentForm = {
        name: '',
        email: '',
        phone: '',
        class: 'الصف الأول',
        status: 'active'
      };
      this.showModal = true;
    },

    editStudent(student) {
      this.modalTitle = 'تعديل بيانات الطالب';
      this.editingStudent = student;
      this.studentForm = { ...student };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.editingStudent = null;
      this.studentForm = {
        name: '',
        email: '',
        phone: '',
        class: 'الصف الأول',
        status: 'active'
      };
    },

    async saveStudent() {
      this.saving = true;
      try {
        if (this.editingStudent) {
          // تحديث طالب موجود
          await http.put(`/students/${this.editingStudent.id}`, this.studentForm);
          alert('تم تحديث بيانات الطالب بنجاح');
        } else {
          // إضافة طالب جديد
          await http.post('/students', this.studentForm);
          alert('تم إضافة الطالب بنجاح');
        }
        
        await this.fetchStudents();
        this.closeModal();
      } catch (error) {
        console.error('Error saving student:', error);
        if (error.response?.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          alert(`حدث خطأ: ${errors.join(', ')}`);
        } else {
          alert('حدث خطأ في حفظ بيانات الطالب');
        }
      } finally {
        this.saving = false;
      }
    },

    async deleteStudent(id) {
      if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
        try {
          await http.delete(`/students/${id}`);
          alert('تم حذف الطالب بنجاح');
          await this.fetchStudents();
        } catch (error) {
          console.error('Error deleting student:', error);
          alert('حدث خطأ في حذف الطالب');
        }
      }
    }
  }
};
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 20px;
  font-size: 1.1rem;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  padding: 15px;
}

.pagination button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:not(:disabled):hover {
  background: #f5f5f5;
}

/* باقي الـ styles تبقى كما هي */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: bold;
}

.filter-group input,
.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  margin: 0 2px;
  color: var(--primary-blue);
}

.btn-icon.btn-danger {
  color: var(--accent-red);
}

.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status-badge.active {
  background-color: #e8f6f3;
  color: #27ae60;
}

.status-badge.inactive {
  background-color: #fdedec;
  color: #e74c3c;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #777;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input, 
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>