<template>
<div class="modal-overlay" @click.self="close">
  <div class="modal">
    <div class="modal-header">
      <h3>{{ modalData.title }}</h3>
      <button class="close-btn" @click="close">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="modal-body">
      <!-- نموذج إضافة/تعديل الطالب -->
      <div v-if="modalData.type === 'addStudent' || modalData.type === 'editStudent'">
        <form @submit.prevent="submitStudentForm">
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
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="close">إلغاء</button>
            <button type="submit" class="btn btn-primary">حفظ</button>
          </div>
        </form>
      </div>
      
      <!-- نموذج إضافة/تعديل المدرس -->
      <div v-else-if="modalData.type === 'addTeacher' || modalData.type === 'editTeacher'">
        <form @submit.prevent="submitTeacherForm">
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
            <input type="text" v-model="teacherForm.specialization" required>
          </div>
          <div class="form-group">
            <label>رقم الهاتف:</label>
            <input type="tel" v-model="teacherForm.phone" required>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="close">إلغاء</button>
            <button type="submit" class="btn btn-primary">حفظ</button>
          </div>
        </form>
      </div>
      
      <!-- نموذج الفواتير -->
      <div v-else-if="modalData.type === 'addInvoice' || modalData.type === 'editInvoice'">
        <form @submit.prevent="submitInvoiceForm">
          <div class="form-group">
            <label>الطالب:</label>
            <select v-model="invoiceForm.studentId" required>
              <option value="">اختر الطالب</option>
              <option value="1">أحمد محمد</option>
              <option value="2">سارة خالد</option>
              <option value="3">محمد علي</option>
            </select>
          </div>
          <div class="form-group">
            <label>المبلغ:</label>
            <input type="number" v-model="invoiceForm.amount" required>
          </div>
          <div class="form-group">
            <label>تاريخ الاستحقاق:</label>
            <input type="date" v-model="invoiceForm.dueDate" required>
          </div>
          <div class="form-group">
            <label>الوصف:</label>
            <textarea v-model="invoiceForm.description" rows="3"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="close">إلغاء</button>
            <button type="submit" class="btn btn-primary">حفظ</button>
          </div>
        </form>
      </div>
      
      <!-- عرض الفاتورة -->
      <div v-else-if="modalData.type === 'viewInvoice'">
        <div class="invoice-details">
          <div class="detail-row">
            <strong>رقم الفاتورة:</strong>
            <span>#{{ modalData.data.id }}</span>
          </div>
          <div class="detail-row">
            <strong>الطالب:</strong>
            <span>{{ modalData.data.student }}</span>
          </div>
          <div class="detail-row">
            <strong>المبلغ:</strong>
            <span>{{ modalData.data.amount }} ر.س</span>
          </div>
          <div class="detail-row">
            <strong>تاريخ الاستحقاق:</strong>
            <span>{{ modalData.data.dueDate }}</span>
          </div>
          <div class="detail-row">
            <strong>الحالة:</strong>
            <span class="status-badge" :class="modalData.data.status">
              {{ modalData.data.status === 'paid' ? 'مسددة' : 'معلقة' }}
            </span>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="close">إغلاق</button>
        </div>
      </div>
      
      <!-- نموذج افتراضي إذا لم يتطابق أي نوع -->
      <div v-else>
        <p>نوع النموذج غير معروف: {{ modalData.type }}</p>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="close">إغلاق</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
name: 'Modal',
props: {
  modalData: {
    type: Object,
    required: true
  }
},
data() {
  return {
    studentForm: {
      name: '',
      email: '',
      phone: '',
      class: 'الصف الأول'
    },
    teacherForm: {
      name: '',
      email: '',
      specialization: '',
      phone: ''
    },
    invoiceForm: {
      studentId: '',
      amount: '',
      dueDate: '',
      description: ''
    }
  }
},
methods: {
  close() {
    this.$emit('close')
  },
  submitStudentForm() {
    // كود إرسال بيانات الطالب
    console.log('بيانات الطالب:', this.studentForm)
    alert('تم حفظ بيانات الطالب بنجاح!')
    this.close()
  },
  submitTeacherForm() {
    // كود إرسال بيانات المدرس
    console.log('بيانات المدرس:', this.teacherForm)
    alert('تم حفظ بيانات المدرس بنجاح!')
    this.close()
  },
  submitInvoiceForm() {
    // كود إرسال بيانات الفاتورة
    console.log('بيانات الفاتورة:', this.invoiceForm)
    alert('تم إنشاء الفاتورة بنجاح!')
    this.close()
  }
},
mounted() {
  // تعبئة النماذج بالبيانات إذا كان تعديل
  if (this.modalData.type === 'editStudent' && this.modalData.data) {
    this.studentForm = { ...this.modalData.data }
  }
  
  if (this.modalData.type === 'editTeacher' && this.modalData.data) {
    this.teacherForm = { ...this.modalData.data }
  }
  
  if (this.modalData.type === 'editInvoice' && this.modalData.data) {
    this.invoiceForm = { ...this.modalData.data }
  }
}
}
</script>

<style scoped>
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
.form-group select, 
.form-group textarea {
width: 100%;
padding: 10px;
border: 1px solid #ddd;
border-radius: 4px;
font-family: inherit;
}

.form-actions {
display: flex;
justify-content: flex-end;
gap: 10px;
margin-top: 20px;
}

.invoice-details {
display: flex;
flex-direction: column;
gap: 15px;
}

.detail-row {
display: flex;
justify-content: space-between;
align-items: center;
padding: 10px 0;
border-bottom: 1px solid #eee;
}

.status-badge {
padding: 5px 10px;
border-radius: 20px;
font-size: 0.8rem;
font-weight: bold;
}

.status-badge.paid {
background-color: #E8F6F3;
color: #27AE60;
}

.status-badge.pending {
background-color: #FEF9E7;
color: #F39C12;
}
</style>