<template>
  <div class="teachers">
    <div class="page-header">
      <h2>إدارة المدرسين</h2>
      <button class="btn btn-primary" @click="openAddTeacherModal">
        <i class="fas fa-plus"></i>
        إضافة مدرس
      </button>
    </div>
    
    <div class="filters card">
      <div class="filter-group">
        <label>بحث:</label>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="ابحث عن مدرس..."
          @input="searchTeachers"
        >
      </div>
      <div class="filter-group">
        <label>التخصص:</label>
        <select v-model="selectedSpecialization" @change="filterTeachers">
          <option value="">جميع التخصصات</option>
          <option value="رياضيات">رياضيات</option>
          <option value="علوم">علوم</option>
          <option value="لغة عربية">لغة عربية</option>
          <option value="لغة إنجليزية">لغة إنجليزية</option>
          <option value="اجتماعيات">اجتماعيات</option>
          <option value="تربية إسلامية">تربية إسلامية</option>
        </select>
      </div>
    </div>

    <div class="loading" v-if="loading">
      جاري تحميل البيانات...
    </div>

    <div class="teachers-table card" v-else>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>الاسم</th>
            <th>التخصص</th>
            <th>البريد الإلكتروني</th>
            <th>الهاتف</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(teacher, index) in filteredTeachers" :key="teacher.id">
            <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
            <td>{{ teacher.name }}</td>
            <td>{{ teacher.specialization }}</td>
            <td>{{ teacher.email }}</td>
            <td>{{ teacher.phone }}</td>
            <td>
              <span class="status-badge" :class="teacher.status">
                {{ teacher.status === 'active' ? 'نشط' : 'غير نشط' }}
              </span>
            </td>
            <td>
              <button class="btn-icon" @click="editTeacher(teacher)">
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="btn-icon btn-danger" 
                @click="deleteTeacher(teacher.id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- التصفح -->
      <div class="pagination" v-if="teachers.length > 0">
        <button 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
        >
          السابق
        </button>
        <span>الصفحة {{ currentPage }}</span>
        <button 
          :disabled="filteredTeachers.length < perPage" 
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
          <form @submit.prevent="saveTeacher">
            <div class="form-group">
              <label>الاسم الكامل:</label>
              <input type="text" v-model="teacherForm.name" required>
            </div>
            <div class="form-group">
              <label>البريد الإلكتروني:</label>
              <input type="email" v-model="teacherForm.email" required>
            </div>
            <div class="form-group">
              <label>التخصص:</label>
              <select v-model="teacherForm.specialization" required>
                <option value="رياضيات">رياضيات</option>
                <option value="علوم">علوم</option>
                <option value="لغة عربية">لغة عربية</option>
                <option value="لغة إنجليزية">لغة إنجليزية</option>
                <option value="اجتماعيات">اجتماعيات</option>
                <option value="تربية إسلامية">تربية إسلامية</option>
                <option value="تربية بدنية">تربية بدنية</option>
                <option value="فنون">فنون</option>
                <option value="موسيقى">موسيقى</option>
                <option value="حاسوب">حاسوب</option>
              </select>
            </div>
            <div class="form-group">
              <label>رقم الهاتف:</label>
              <input type="tel" v-model="teacherForm.phone" required>
            </div>
            <div class="form-group">
              <label>الحالة:</label>
              <select v-model="teacherForm.status" required>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                إلغاء
              </button>
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
  name: 'Teachers',
  data() {
    return {
      loading: false,
      saving: false,
      teachers: [],
      searchQuery: '',
      selectedSpecialization: '',
      currentPage: 1,
      perPage: 10,
      showModal: false,
      modalTitle: '',
      editingTeacher: null,
      teacherForm: {
        name: '',
        email: '',
        specialization: 'رياضيات',
        phone: '',
        status: 'active'
      }
    };
  },
  computed: {
    filteredTeachers() {
      let filtered = this.teachers;

      if (this.searchQuery) {
        filtered = filtered.filter(
          teacher => 
            teacher.name.includes(this.searchQuery) ||
            teacher.email.includes(this.searchQuery)
        );
      }
      
      if (this.selectedSpecialization) {
        filtered = filtered.filter(
          teacher => teacher.specialization === this.selectedSpecialization
        );
      }

      // التصفح البسيط
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return filtered.slice(start, end);
    }
  },
  async mounted() {
    await this.fetchTeachers();
  },
  methods: {
    async fetchTeachers() {
      this.loading = true;
      try {
        const response = await http.get('/teachers');
        this.teachers = response.data;
      } catch (error) {
        console.error('Error fetching teachers:', error);
        alert('حدث خطأ في جلب بيانات المدرسين');
      } finally {
        this.loading = false;
      }
    },

    async searchTeachers() {
      if (this.searchQuery.length > 2) {
        try {
          const response = await http.get(`/teachers/search/${this.searchQuery}`);
          this.teachers = response.data;
        } catch (error) {
          console.error('Error searching teachers:', error);
        }
      } else if (this.searchQuery.length === 0) {
        await this.fetchTeachers();
      }
    },

    filterTeachers() {
      this.currentPage = 1;
    },

    changePage(page) {
      this.currentPage = page;
    },

    openAddTeacherModal() {
      this.modalTitle = 'إضافة مدرس جديد';
      this.editingTeacher = null;
      this.teacherForm = {
        name: '',
        email: '',
        specialization: 'رياضيات',
        phone: '',
        status: 'active'
      };
      this.showModal = true;
    },

    editTeacher(teacher) {
      this.modalTitle = 'تعديل بيانات المدرس';
      this.editingTeacher = teacher;
      this.teacherForm = { ...teacher };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.editingTeacher = null;
      this.teacherForm = {
        name: '',
        email: '',
        specialization: 'رياضيات',
        phone: '',
        status: 'active'
      };
    },

    async saveTeacher() {
      this.saving = true;
      try {
        if (this.editingTeacher) {
          // تحديث مدرس موجود
          await http.put(`/teachers/${this.editingTeacher.id}`, this.teacherForm);
          alert('تم تحديث بيانات المدرس بنجاح');
        } else {
          // إضافة مدرس جديد
          await http.post('/teachers', this.teacherForm);
          alert('تم إضافة المدرس بنجاح');
        }
        
        await this.fetchTeachers();
        this.closeModal();
      } catch (error) {
        console.error('Error saving teacher:', error);
        if (error.response?.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          alert(`حدث خطأ: ${errors.join(', ')}`);
        } else {
          alert('حدث خطأ في حفظ بيانات المدرس');
        }
      } finally {
        this.saving = false;
      }
    },

    async deleteTeacher(id) {
      if (confirm('هل أنت متأكد من حذف هذا المدرس؟')) {
        try {
          await http.delete(`/teachers/${id}`);
          alert('تم حذف المدرس بنجاح');
          await this.fetchTeachers();
        } catch (error) {
          console.error('Error deleting teacher:', error);
          alert('حدث خطأ في حذف المدرس');
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

.filter-group input, .filter-group select {
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
  background-color: #E8F6F3;
  color: #27AE60;
}

.status-badge.inactive {
  background-color: #FDEDEC;
  color: #E74C3C;
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

/* تحسينات للاستجابة */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-group {
    width: 100%;
    justify-content: space-between;
  }

  .teachers-table {
    overflow-x: auto;
  }

  .table {
    min-width: 600px;
  }
}

@media (max-width: 480px) {
  .modal {
    width: 95%;
    margin: 10px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>