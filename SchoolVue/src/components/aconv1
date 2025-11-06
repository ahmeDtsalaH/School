<template>
  <div class="accounts">
    <div class="page-header">
      <h2>الإدارة المالية</h2>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="generateFinancialReport">
          <i class="fas fa-file-pdf"></i>
          تقرير مالي
        </button>
        <button class="btn btn-primary" @click="openQuickInvoiceModal">
          <i class="fas fa-plus"></i>
          فاتورة سريعة
        </button>
      </div>
    </div>

    <!-- لوحة الإحصائيات المالية -->
    <div class="financial-dashboard">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background-color: #27ae60">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div class="stat-info">
            <h3>{{ formatCurrency(financialStats.total_revenue || 0) }}</h3>
            <p>إجمالي الإيرادات</p>
            <span class="stat-trend positive">+12%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background-color: #e74c3c">
            <i class="fas fa-hand-holding-usd"></i>
          </div>
          <div class="stat-info">
            <h3>{{ formatCurrency(expenseStats.total_expenses || 0) }}</h3>
            <p>إجمالي المصروفات</p>
            <span class="stat-trend negative">+8%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background-color: #3498db">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-info">
            <h3>{{ formatCurrency(netProfit) }}</h3>
            <p>صافي الربح</p>
            <span class="stat-trend positive">+15%</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background-color: #f39c12">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="stat-info">
            <h3>{{ formatCurrency(financialStats.pending_amount || 0) }}</h3>
            <p>المتأخرات</p>
            <span class="stat-trend negative">+5%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- تبويبات الأقسام المالية -->
    <div class="financial-tabs">
      <div class="tabs-header">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i>
          {{ tab.name }}
        </button>
      </div>

      <div class="tab-content">
        <!-- قسم رسوم الطلاب -->
        <div v-if="activeTab === 'students'" class="tab-panel">
          <div class="panel-header">
            <h3>إدارة رسوم الطلاب</h3>
            <div class="panel-actions">
              <button class="btn btn-outline" @click="exportInvoices">
                <i class="fas fa-download"></i>
                تصدير
              </button>
              <button class="btn btn-primary" @click="openAddInvoiceModal">
                <i class="fas fa-plus"></i>
                إنشاء فاتورة
              </button>
            </div>
          </div>

          <div class="filters card">
            <div class="filter-group">
              <label>بحث:</label>
              <input 
                type="text" 
                v-model="invoiceSearch" 
                placeholder="ابحث في الفواتير..."
                @input="searchInvoices"
              >
            </div>
            <div class="filter-group">
              <label>الحالة:</label>
              <select v-model="invoiceFilter" @change="filterInvoices">
                <option value="all">جميع الفواتير</option>
                <option value="paid">المسددة</option>
                <option value="pending">المعلقة</option>
                <option value="overdue">المتأخرة</option>
              </select>
            </div>
            <div class="filter-group">
              <label>الفصل:</label>
              <select v-model="selectedClass" @change="filterInvoices">
                <option value="">جميع الفصول</option>
                <option value="الصف الأول">الصف الأول</option>
                <option value="الصف الثاني">الصف الثاني</option>
                <option value="الصف الثالث">الصف الثالث</option>
              </select>
            </div>
          </div>

          <div class="table-container card">
            <div class="table-header">
              <div class="table-info">
                <span>إجمالي الفواتير: {{ filteredInvoices.length }}</span>
                <span>المبلغ الإجمالي: {{ formatCurrency(totalInvoicesAmount) }}</span>
              </div>
              <div class="table-actions">
                <button class="btn btn-sm" @click="refreshInvoices">
                  <i class="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>

            <div class="loading" v-if="loadingInvoices">
              <i class="fas fa-spinner fa-spin"></i>
              جاري تحميل الفواتير...
            </div>

            <div class="table-responsive" v-else>
              <table class="table">
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" v-model="selectAllInvoices" @change="toggleSelectAllInvoices">
                    </th>
                    <th @click="sortInvoices('id')">
                      رقم الفاتورة
                      <i class="fas fa-sort" :class="getSortIcon('id')"></i>
                    </th>
                    <th @click="sortInvoices('student.name')">الطالب</th>
                    <th @click="sortInvoices('student.class')">الفصل</th>
                    <th @click="sortInvoices('amount')">
                      المبلغ
                      <i class="fas fa-sort" :class="getSortIcon('amount')"></i>
                    </th>
                    <th @click="sortInvoices('issue_date')">
                      تاريخ الإصدار
                      <i class="fas fa-sort" :class="getSortIcon('issue_date')"></i>
                    </th>
                    <th @click="sortInvoices('due_date')">
                      تاريخ الاستحقاق
                      <i class="fas fa-sort" :class="getSortIcon('due_date')"></i>
                    </th>
                    <th @click="sortInvoices('status')">الحالة</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="invoice in paginatedInvoices" :key="invoice.id" 
                      :class="{ selected: selectedInvoices.includes(invoice.id) }">
                    <td>
                      <input type="checkbox" 
                             :value="invoice.id" 
                             v-model="selectedInvoices"
                             @change="updateSelectAll">
                    </td>
                    <td>#{{ invoice.id }}</td>
                    <td>
                      <div class="student-info">
                        <strong>{{ invoice.student?.name }}</strong>
                        <small>{{ invoice.student?.email }}</small>
                      </div>
                    </td>
                    <td>{{ invoice.student?.class }}</td>
                    <td>
                      <span class="amount" :class="{ paid: invoice.status === 'paid' }">
                        {{ formatCurrency(invoice.amount) }}
                      </span>
                    </td>
                    <td>{{ formatDate(invoice.issue_date) }}</td>
                    <td :class="{ 
                      overdue: isOverdue(invoice.due_date) && invoice.status !== 'paid',
                      'text-warning': isDueSoon(invoice.due_date) && invoice.status !== 'paid'
                    }">
                      {{ formatDate(invoice.due_date) }}
                      <span v-if="isOverdue(invoice.due_date) && invoice.status !== 'paid'" 
                            class="overdue-badge">
                        !
                      </span>
                    </td>
                    <td>
                      <span class="status-badge" :class="invoice.status">
                        {{ getInvoiceStatusText(invoice.status) }}
                      </span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon btn-success" 
                                @click="markInvoiceAsPaid(invoice)"
                                v-if="invoice.status !== 'paid'"
                                title="تسديد">
                          <i class="fas fa-check"></i>
                        </button>
                        <button class="btn-icon btn-info" 
                                @click="viewInvoice(invoice)"
                                title="عرض">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-warning" 
                                @click="editInvoice(invoice)"
                                title="تعديل">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" 
                                @click="deleteInvoice(invoice.id)"
                                title="حذف">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div class="no-data" v-if="filteredInvoices.length === 0">
                <i class="fas fa-file-invoice"></i>
                <p>لا توجد فواتير</p>
                <button class="btn btn-primary" @click="openAddInvoiceModal">
                  إنشاء أول فاتورة
                </button>
              </div>
            </div>

            <!-- التصفح -->
            <div class="pagination-container" v-if="filteredInvoices.length > 0">
              <div class="pagination-info">
                عرض {{ startIndex + 1 }} - {{ endIndex }} من {{ filteredInvoices.length }}
              </div>
              <div class="pagination">
                <button class="btn btn-sm" 
                        @click="changeInvoicePage(currentInvoicePage - 1)"
                        :disabled="currentInvoicePage === 1">
                  <i class="fas fa-chevron-right"></i>
                </button>
                <span class="page-info">الصفحة {{ currentInvoicePage }} من {{ totalInvoicePages }}</span>
                <button class="btn btn-sm" 
                        @click="changeInvoicePage(currentInvoicePage + 1)"
                        :disabled="currentInvoicePage === totalInvoicePages">
                  <i class="fas fa-chevron-left"></i>
                </button>
              </div>
              <div class="page-size">
                <select v-model="invoicePageSize" @change="resetInvoicePagination">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span>لكل صفحة</span>
              </div>
            </div>
          </div>

          <!-- إجراءات جماعية -->
          <div class="bulk-actions" v-if="selectedInvoices.length > 0">
            <div class="bulk-actions-content">
              <span>تم اختيار {{ selectedInvoices.length }} فاتورة</span>
              <div class="bulk-buttons">
                <button class="btn btn-success btn-sm" @click="bulkMarkAsPaid">
                  <i class="fas fa-check"></i>
                  تسديد المحدد
                </button>
                <button class="btn btn-danger btn-sm" @click="bulkDeleteInvoices">
                  <i class="fas fa-trash"></i>
                  حذف المحدد
                </button>
                <button class="btn btn-outline btn-sm" @click="clearSelection">
                  <i class="fas fa-times"></i>
                  إلغاء التحديد
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- قسم مرتبات المدرسين -->
        <div v-else-if="activeTab === 'teachers'" class="tab-panel">
          <div class="panel-header">
            <h3>إدارة مرتبات المدرسين</h3>
            <div class="panel-actions">
              <button class="btn btn-outline" @click="exportSalaries">
                <i class="fas fa-download"></i>
                تصدير
              </button>
              <button class="btn btn-primary" @click="openAddSalaryModal">
                <i class="fas fa-plus"></i>
                إضافة راتب
              </button>
            </div>
          </div>

          <div class="filters card">
            <div class="filter-group">
              <label>بحث:</label>
              <input 
                type="text" 
                v-model="salarySearch" 
                placeholder="ابحث في المرتبات..."
                @input="searchSalaries"
              >
            </div>
            <div class="filter-group">
              <label>الحالة:</label>
              <select v-model="salaryFilter" @change="filterSalaries">
                <option value="all">جميع المرتبات</option>
                <option value="paid">المسددة</option>
                <option value="pending">المعلقة</option>
              </select>
            </div>
            <div class="filter-group">
              <label>الشهر:</label>
              <select v-model="selectedMonth" @change="filterSalaries">
                <option value="">جميع الأشهر</option>
                <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
              </select>
            </div>
          </div>

          <div class="table-container card">
            <div class="table-header">
              <div class="table-info">
                <span>إجمالي المرتبات: {{ filteredSalaries.length }}</span>
                <span>إجمالي المستحقات: {{ formatCurrency(totalSalariesAmount) }}</span>
              </div>
              <div class="table-actions">
                <button class="btn btn-sm" @click="refreshSalaries">
                  <i class="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>

            <div class="loading" v-if="loadingSalaries">
              <i class="fas fa-spinner fa-spin"></i>
              جاري تحميل البيانات...
            </div>

            <div class="table-responsive" v-else>
              <table class="table">
                <thead>
                  <tr>
                    <th>المدرس</th>
                    <th>التخصص</th>
                    <th>الراتب الأساسي</th>
                    <th>الحوافز</th>
                    <th>الخصومات</th>
                    <th>الصافي</th>
                    <th>الشهر</th>
                    <th>حالة الراتب</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="salary in filteredSalaries" :key="salary.id">
                    <td>
                      <div class="teacher-info">
                        <strong>{{ salary.teacher?.name }}</strong>
                        <small>{{ salary.teacher?.email }}</small>
                      </div>
                    </td>
                    <td>{{ salary.teacher?.specialization }}</td>
                    <td>{{ formatCurrency(salary.base_salary) }}</td>
                    <td>
                      <span class="bonus-amount" v-if="salary.bonuses > 0">
                        +{{ formatCurrency(salary.bonuses) }}
                      </span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <span class="deduction-amount" v-if="salary.deductions > 0">
                        -{{ formatCurrency(salary.deductions) }}
                      </span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <strong class="net-salary">{{ formatCurrency(salary.net_salary) }}</strong>
                    </td>
                    <td>
                      <span class="month-year">
                        {{ salary.month }} / {{ salary.year }}
                      </span>
                    </td>
                    <td>
                      <span class="status-badge" :class="salary.status">
                        {{ salary.status === 'paid' ? 'مسدد' : 'معلق' }}
                      </span>
                      <div v-if="salary.payment_date" class="payment-date">
                        {{ formatDate(salary.payment_date) }}
                      </div>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon btn-success" 
                                @click="processSalaryPayment(salary)"
                                v-if="salary.status !== 'paid'"
                                title="صرف الراتب">
                          <i class="fas fa-money-check"></i>
                        </button>
                        <button class="btn-icon btn-info" 
                                @click="viewSalary(salary)"
                                title="عرض">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-warning" 
                                @click="editSalary(salary)"
                                title="تعديل">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" 
                                @click="deleteSalary(salary.id)"
                                title="حذف">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div class="no-data" v-if="filteredSalaries.length === 0">
                <i class="fas fa-money-check"></i>
                <p>لا توجد بيانات مرتبات</p>
                <button class="btn btn-primary" @click="openAddSalaryModal">
                  إضافة أول راتب
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- قسم المصروفات -->
        <div v-else-if="activeTab === 'expenses'" class="tab-panel">
          <div class="panel-header">
            <h3>إدارة المصروفات</h3>
            <div class="panel-actions">
              <button class="btn btn-outline" @click="exportExpenses">
                <i class="fas fa-download"></i>
                تصدير
              </button>
              <button class="btn btn-primary" @click="openAddExpenseModal">
                <i class="fas fa-plus"></i>
                إضافة مصروف
              </button>
            </div>
          </div>

          <div class="expenses-summary">
            <div class="summary-cards">
              <div class="summary-card operational">
                <div class="summary-icon">
                  <i class="fas fa-cogs"></i>
                </div>
                <div class="summary-content">
                  <h4>مصروفات تشغيلية</h4>
                  <span class="amount">{{ formatCurrency(expenseStats.operational_expenses || 0) }}</span>
                </div>
              </div>
              <div class="summary-card administrative">
                <div class="summary-icon">
                  <i class="fas fa-user-tie"></i>
                </div>
                <div class="summary-content">
                  <h4>مصروفات إدارية</h4>
                  <span class="amount">{{ formatCurrency(expenseStats.administrative_expenses || 0) }}</span>
                </div>
              </div>
              <div class="summary-card academic">
                <div class="summary-icon">
                  <i class="fas fa-book"></i>
                </div>
                <div class="summary-content">
                  <h4>مصروفات تعليمية</h4>
                  <span class="amount">{{ formatCurrency(expenseStats.academic_expenses || 0) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="filters card">
            <div class="filter-group">
              <label>بحث:</label>
              <input 
                type="text" 
                v-model="expenseSearch" 
                placeholder="ابحث في المصروفات..."
                @input="searchExpenses"
              >
            </div>
            <div class="filter-group">
              <label>النوع:</label>
              <select v-model="expenseTypeFilter" @change="filterExpenses">
                <option value="all">جميع الأنواع</option>
                <option value="operational">تشغيلية</option>
                <option value="administrative">إدارية</option>
                <option value="academic">تعليمية</option>
              </select>
            </div>
            <div class="filter-group">
              <label>الفترة:</label>
              <select v-model="expensePeriodFilter" @change="filterExpenses">
                <option value="all">كل الفترات</option>
                <option value="month">هذا الشهر</option>
                <option value="quarter">هذا الربع</option>
                <option value="year">هذه السنة</option>
              </select>
            </div>
          </div>

          <div class="table-container card">
            <div class="table-header">
              <div class="table-info">
                <span>إجمالي المصروفات: {{ filteredExpenses.length }}</span>
                <span>المبلغ الإجمالي: {{ formatCurrency(totalExpensesAmount) }}</span>
              </div>
              <div class="table-actions">
                <button class="btn btn-sm" @click="refreshExpenses">
                  <i class="fas fa-sync-alt"></i>
                </button>
              </div>
            </div>

            <div class="loading" v-if="loadingExpenses">
              <i class="fas fa-spinner fa-spin"></i>
              جاري تحميل المصروفات...
            </div>

            <div class="table-responsive" v-else>
              <table class="table">
                <thead>
                  <tr>
                    <th>التاريخ</th>
                    <th>نوع المصروف</th>
                    <th>الفئة</th>
                    <th>الوصف</th>
                    <th>المبلغ</th>
                    <th>طريقة الدفع</th>
                    <th>المستلم</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="expense in filteredExpenses" :key="expense.id">
                    <td>
                      <div class="date-cell">
                        <strong>{{ formatDate(expense.date) }}</strong>
                        <small>{{ formatTime(expense.created_at) }}</small>
                      </div>
                    </td>
                    <td>
                      <span class="expense-type" :class="expense.type">
                        <i :class="getExpenseTypeIcon(expense.type)"></i>
                        {{ getExpenseTypeText(expense.type) }}
                      </span>
                    </td>
                    <td>
                      <span class="expense-category">{{ expense.category }}</span>
                    </td>
                    <td>
                      <div class="description-cell">
                        {{ expense.description }}
                        <small v-if="expense.notes" class="text-muted">
                          {{ expense.notes }}
                        </small>
                      </div>
                    </td>
                    <td>
                      <span class="expense-amount">{{ formatCurrency(expense.amount) }}</span>
                    </td>
                    <td>
                      <span class="payment-method" :class="expense.payment_method">
                        <i :class="getPaymentMethodIcon(expense.payment_method)"></i>
                        {{ getPaymentMethodText(expense.payment_method) }}
                      </span>
                    </td>
                    <td>
                      <div class="recipient-cell">
                        <strong>{{ expense.recipient }}</strong>
                        <small v-if="expense.reference_number" class="text-muted">
                          Ref: {{ expense.reference_number }}
                        </small>
                      </div>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon btn-info" 
                                @click="viewExpense(expense)"
                                title="عرض">
                          <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-warning" 
                                @click="editExpense(expense)"
                                title="تعديل">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-danger" 
                                @click="deleteExpense(expense.id)"
                                title="حذف">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div class="no-data" v-if="filteredExpenses.length === 0">
                <i class="fas fa-receipt"></i>
                <p>لا توجد مصروفات</p>
                <button class="btn btn-primary" @click="openAddExpenseModal">
                  إضافة أول مصروف
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- Modal الفواتير -->
    <div v-if="showInvoiceModal" class="modal-overlay" @click.self="closeInvoiceModal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>{{ invoiceModalTitle }}</h3>
          <button class="close-btn" @click="closeInvoiceModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveInvoice" class="form-grid">
            <div class="form-group">
              <label>الطالب *</label>
              <select v-model="invoiceForm.student_id" required class="form-control">
                <option value="">اختر الطالب</option>
                <option v-for="student in activeStudents" :key="student.id" :value="student.id">
                  {{ student.name }} - {{ student.class }} - {{ student.email }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>المبلغ *</label>
              <div class="input-with-symbol">
                <input type="number" v-model="invoiceForm.amount" required min="0" step="0.01" class="form-control">
                <span class="input-symbol">ر.س</span>
              </div>
            </div>
            
            <div class="form-group full-width">
              <label>الوصف *</label>
              <textarea v-model="invoiceForm.description" rows="3" required class="form-control" 
                        placeholder="وصف الفاتورة والخدمات المقدمة..."></textarea>
            </div>
            
            <div class="form-group">
              <label>تاريخ الإصدار *</label>
              <input type="date" v-model="invoiceForm.issue_date" required class="form-control">
            </div>
            
            <div class="form-group">
              <label>تاريخ الاستحقاق *</label>
              <input type="date" v-model="invoiceForm.due_date" required class="form-control">
            </div>
            
            <div class="form-group">
              <label>السنة الدراسية *</label>
              <select v-model="invoiceForm.academic_year" required class="form-control">
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>الفصل الدراسي *</label>
              <select v-model="invoiceForm.semester" required class="form-control">
                <option value="الأول">الأول</option>
                <option value="الثاني">الثاني</option>
                <option value="الصيفي">الصيفي</option>
              </select>
            </div>

            <div class="form-group full-width" v-if="editingInvoice">
              <label>حالة الفاتورة</label>
              <select v-model="invoiceForm.status" class="form-control">
                <option value="pending">معلقة</option>
                <option value="paid">مسددة</option>
                <option value="overdue">متأخرة</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeInvoiceModal">إلغاء</button>
          <button type="button" class="btn btn-primary" @click="saveInvoice" :disabled="saving">
            <i class="fas fa-save" v-if="!saving"></i>
            <i class="fas fa-spinner fa-spin" v-else></i>
            {{ saving ? 'جاري الحفظ...' : 'حفظ' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal عرض الفاتورة -->
    <div v-if="showViewInvoiceModal" class="modal-overlay" @click.self="closeViewInvoiceModal">
      <div class="modal">
        <div class="modal-header">
          <h3>فاتورة #{{ viewedInvoice?.id }}</h3>
          <button class="close-btn" @click="closeViewInvoiceModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="invoice-details" v-if="viewedInvoice">
            <div class="detail-section">
              <h4>معلومات الفاتورة</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <label>الطالب:</label>
                  <span>{{ viewedInvoice.student?.name }}</span>
                </div>
                <div class="detail-item">
                  <label>الفصل:</label>
                  <span>{{ viewedInvoice.student?.class }}</span>
                </div>
                <div class="detail-item">
                  <label>المبلغ:</label>
                  <span class="amount">{{ formatCurrency(viewedInvoice.amount) }}</span>
                </div>
                <div class="detail-item">
                  <label>الحالة:</label>
                  <span class="status-badge" :class="viewedInvoice.status">
                    {{ getInvoiceStatusText(viewedInvoice.status) }}
                  </span>
                </div>
                <div class="detail-item">
                  <label>تاريخ الإصدار:</label>
                  <span>{{ formatDate(viewedInvoice.issue_date) }}</span>
                </div>
                <div class="detail-item">
                  <label>تاريخ الاستحقاق:</label>
                  <span>{{ formatDate(viewedInvoice.due_date) }}</span>
                </div>
              </div>
            </div>
            <div class="detail-section" v-if="viewedInvoice.description">
              <h4>الوصف</h4>
              <p>{{ viewedInvoice.description }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeViewInvoiceModal">إغلاق</button>
          <button type="button" class="btn btn-primary" @click="printInvoice(viewedInvoice)" v-if="viewedInvoice">
            <i class="fas fa-print"></i>
            طباعة
          </button>
        </div>
      </div>
    </div>

    <!-- Modal المرتبات -->
    <div v-if="showSalaryModal" class="modal-overlay" @click.self="closeSalaryModal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>{{ salaryModalTitle }}</h3>
          <button class="close-btn" @click="closeSalaryModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveSalary" class="form-grid">
            <div class="form-group">
              <label>المدرس *</label>
              <select v-model="salaryForm.teacher_id" required class="form-control">
                <option value="">اختر المدرس</option>
                <option v-for="teacher in activeTeachers" :key="teacher.id" :value="teacher.id">
                  {{ teacher.name }} - {{ teacher.specialization }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>الراتب الأساسي *</label>
              <div class="input-with-symbol">
                <input type="number" v-model="salaryForm.base_salary" required min="0" step="0.01" class="form-control">
                <span class="input-symbol">ر.س</span>
              </div>
            </div>
            
            <div class="form-group">
              <label>الحوافز</label>
              <div class="input-with-symbol">
                <input type="number" v-model="salaryForm.bonuses" min="0" step="0.01" class="form-control">
                <span class="input-symbol">ر.س</span>
              </div>
            </div>
            
            <div class="form-group">
              <label>الخصومات</label>
              <div class="input-with-symbol">
                <input type="number" v-model="salaryForm.deductions" min="0" step="0.01" class="form-control">
                <span class="input-symbol">ر.س</span>
              </div>
            </div>
            
            <div class="form-group">
              <label>الصافي</label>
              <div class="input-with-symbol">
                <input type="number" :value="netSalary" readonly class="form-control readonly">
                <span class="input-symbol">ر.س</span>
              </div>
            </div>
            
            <div class="form-group">
              <label>الشهر *</label>
              <select v-model="salaryForm.month" required class="form-control">
                <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>السنة *</label>
              <select v-model="salaryForm.year" required class="form-control">
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label>ملاحظات</label>
              <textarea v-model="salaryForm.notes" rows="3" class="form-control" 
                        placeholder="ملاحظات إضافية حول الراتب..."></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeSalaryModal">إلغاء</button>
          <button type="button" class="btn btn-primary" @click="saveSalary" :disabled="saving">
            <i class="fas fa-save" v-if="!saving"></i>
            <i class="fas fa-spinner fa-spin" v-else></i>
            {{ saving ? 'جاري الحفظ...' : 'حفظ' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal المصروفات -->
    <div v-if="showExpenseModal" class="modal-overlay" @click.self="closeExpenseModal">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>{{ expenseModalTitle }}</h3>
          <button class="close-btn" @click="closeExpenseModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveExpense" class="form-grid">
            <div class="form-group">
              <label>نوع المصروف *</label>
              <select v-model="expenseForm.type" required class="form-control">
                <option value="operational">تشغيلي</option>
                <option value="administrative">إداري</option>
                <option value="academic">تعليمي</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>الفئة *</label>
              <input type="text" v-model="expenseForm.category" required class="form-control" 
                     placeholder="مثال: كهرباء, إنترنت, قرطاسية...">
            </div>
            
            <div class="form-group">
              <label>المبلغ *</label>
              <div class="input-with-symbol">
                <input type="number" v-model="expenseForm.amount" required min="0" step="0.01" class="form-control">
                <span class="input-symbol">ر.س</span>
              </div>
            </div>
            
            <div class="form-group full-width">
              <label>الوصف *</label>
              <textarea v-model="expenseForm.description" rows="3" required class="form-control" 
                        placeholder="وصف تفصيلي للمصروف..."></textarea>
            </div>
            
            <div class="form-group">
              <label>التاريخ *</label>
              <input type="date" v-model="expenseForm.date" required class="form-control">
            </div>
            
            <div class="form-group">
              <label>طريقة الدفع *</label>
              <select v-model="expenseForm.payment_method" required class="form-control">
                <option value="cash">نقدي</option>
                <option value="transfer">تحويل بنكي</option>
                <option value="check">شيك</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>المستلم *</label>
              <input type="text" v-model="expenseForm.recipient" required class="form-control">
            </div>
            
            <div class="form-group">
              <label>رقم المرجع</label>
              <input type="text" v-model="expenseForm.reference_number" class="form-control">
            </div>

            <div class="form-group full-width">
              <label>ملاحظات</label>
              <textarea v-model="expenseForm.notes" rows="2" class="form-control"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeExpenseModal">إلغاء</button>
          <button type="button" class="btn btn-primary" @click="saveExpense" :disabled="saving">
            <i class="fas fa-save" v-if="!saving"></i>
            <i class="fas fa-spinner fa-spin" v-else></i>
            {{ saving ? 'جاري الحفظ...' : 'حفظ' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '../http';

export default {
  name: 'Accounts',
  data() {
    return {
      activeTab: 'students',
      tabs: [
        { id: 'students', name: 'رسوم الطلاب', icon: 'fas fa-user-graduate' },
        { id: 'teachers', name: 'مرتبات المدرسين', icon: 'fas fa-chalkboard-teacher' },
        { id: 'expenses', name: 'المصروفات', icon: 'fas fa-receipt' },
      ],
      
      // الفواتير
      invoices: [],
      filteredInvoices: [],
      loadingInvoices: false,
      invoiceSearch: '',
      invoiceFilter: 'all',
      selectedClass: '',
      selectedPeriod: 'all',
      invoiceSortField: 'id',
      invoiceSortDirection: 'desc',
      selectedInvoices: [],
      selectAllInvoices: false,
      currentInvoicePage: 1,
      invoicePageSize: 10,
      
      // المرتبات
      salaries: [],
      filteredSalaries: [],
      loadingSalaries: false,
      salarySearch: '',
      salaryFilter: 'all',
      selectedMonth: '',
      
      // المصروفات
      expenses: [],
      filteredExpenses: [],
      loadingExpenses: false,
      expenseSearch: '',
      expenseTypeFilter: 'all',
      expensePeriodFilter: 'all',
      
      // الإحصائيات
      financialStats: {},
      expenseStats: {},
      salaryStats: {},
      
      // البيانات المساعدة
      students: [],
      teachers: [],
      months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
      
      // Modals
      showInvoiceModal: false,
      showViewInvoiceModal: false,
      showSalaryModal: false,
      showExpenseModal: false,
      saving: false,
      
      // Forms
      invoiceModalTitle: '',
      salaryModalTitle: '',
      expenseModalTitle: '',
      viewedInvoice: null,
      
      invoiceForm: {
        student_id: '',
        amount: '',
        description: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: this.getNextMonthDate(),
        academic_year: '2023-2024',
        semester: 'الأول',
        status: 'pending'
      },
      
      salaryForm: {
        teacher_id: '',
        base_salary: '',
        bonuses: '0',
        deductions: '0',
        month: new Date().toLocaleString('ar-EG', { month: 'long' }),
        year: new Date().getFullYear().toString(),
        notes: ''
      },
      
      expenseForm: {
        type: 'operational',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        recipient: '',
        reference_number: '',
        notes: ''
      },
      
      editingInvoice: null,
      editingSalary: null,
      editingExpense: null
    };
  },
  computed: {
    netProfit() {
      return (this.financialStats.total_revenue || 0) - (this.expenseStats.total_expenses || 0) - (this.salaryStats.total_paid || 0);
    },
    
    netSalary() {
      const base = parseFloat(this.salaryForm.base_salary) || 0;
      const bonuses = parseFloat(this.salaryForm.bonuses) || 0;
      const deductions = parseFloat(this.salaryForm.deductions) || 0;
      return (base + bonuses - deductions).toFixed(2);
    },

    activeStudents() {
      return this.students.filter(student => student.status === 'active');
    },

    activeTeachers() {
      return this.teachers.filter(teacher => teacher.status === 'active');
    },

    // تصفح الفواتير
    totalInvoicePages() {
      return Math.ceil(this.filteredInvoices.length / this.invoicePageSize);
    },

    paginatedInvoices() {
      const start = (this.currentInvoicePage - 1) * this.invoicePageSize;
      const end = start + this.invoicePageSize;
      return this.filteredInvoices.slice(start, end);
    },

    startIndex() {
      return (this.currentInvoicePage - 1) * this.invoicePageSize;
    },

    endIndex() {
      return Math.min(this.startIndex + this.invoicePageSize, this.filteredInvoices.length);
    },

    totalInvoicesAmount() {
      return this.filteredInvoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
    },

    totalSalariesAmount() {
      return this.filteredSalaries.reduce((sum, salary) => sum + parseFloat(salary.net_salary), 0);
    },

    totalExpensesAmount() {
      return this.filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    }
  },
  async mounted() {
    await this.fetchFinancialStats();
    await this.fetchStudents();
    await this.fetchTeachers();
    this.fetchInvoices();
    this.fetchSalaries();
    this.fetchExpenses();
  },
  methods: {
    // التنسيق
    formatCurrency(amount) {
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR'
      }).format(amount);
    },
    
    formatDate(dateString) {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('ar-EG');
    },

    formatTime(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleTimeString('ar-EG', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },
    
    getInvoiceStatusText(status) {
      const statusMap = {
        paid: 'مسددة',
        pending: 'معلقة',
        overdue: 'متأخرة'
      };
      return statusMap[status] || status;
    },
    
    getExpenseTypeText(type) {
      const typeMap = {
        operational: 'تشغيلية',
        administrative: 'إدارية',
        academic: 'تعليمية'
      };
      return typeMap[type] || type;
    },

    getExpenseTypeIcon(type) {
      const iconMap = {
        operational: 'fas fa-cogs',
        administrative: 'fas fa-user-tie',
        academic: 'fas fa-book'
      };
      return iconMap[type] || 'fas fa-receipt';
    },
    
    getPaymentMethodText(method) {
      const methodMap = {
        cash: 'نقدي',
        transfer: 'تحويل بنكي',
        check: 'شيك'
      };
      return methodMap[method] || method;
    },

    getPaymentMethodIcon(method) {
      const iconMap = {
        cash: 'fas fa-money-bill',
        transfer: 'fas fa-exchange-alt',
        check: 'fas fa-file-invoice'
      };
      return iconMap[method] || 'fas fa-money-bill-wave';
    },
    
    isOverdue(dueDate) {
      return new Date(dueDate) < new Date();
    },

    isDueSoon(dueDate) {
      const due = new Date(dueDate);
      const now = new Date();
      const diffTime = due - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays > 0;
    },

    getNextMonthDate() {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date.toISOString().split('T')[0];
    },

    getSortIcon(field) {
      if (this.invoiceSortField !== field) return '';
      return this.invoiceSortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    },

    // APIs
    async fetchFinancialStats() {
      try {
        const [financialRes, expenseRes, salaryRes] = await Promise.all([
          http.get('/invoices/stats/financial'),
          http.get('/expenses/stats/expense'),
          http.get('/salaries/stats/salary')
        ]);
        
        this.financialStats = financialRes.data;
        this.expenseStats = expenseRes.data;
        this.salaryStats = salaryRes.data;
      } catch (error) {
        console.error('Error fetching financial stats:', error);
      }
    },
    
    async fetchStudents() {
      try {
        const response = await http.get('/students');
        this.students = response.data;
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },
    
    async fetchTeachers() {
      try {
        const response = await http.get('/teachers');
        this.teachers = response.data;
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    },
    
    async fetchInvoices() {
      this.loadingInvoices = true;
      try {
        const response = await http.get('/invoices');
        this.invoices = response.data;
        this.filteredInvoices = [...this.invoices];
        this.sortInvoices('id');
      } catch (error) {
        console.error('Error fetching invoices:', error);
        this.showError('حدث خطأ في جلب الفواتير');
      } finally {
        this.loadingInvoices = false;
      }
    },
    
    async fetchSalaries() {
      this.loadingSalaries = true;
      try {
        const response = await http.get('/salaries');
        this.salaries = response.data;
        this.filteredSalaries = [...this.salaries];
      } catch (error) {
        console.error('Error fetching salaries:', error);
        this.showError('حدث خطأ في جلب المرتبات');
      } finally {
        this.loadingSalaries = false;
      }
    },
    
    async fetchExpenses() {
      this.loadingExpenses = true;
      try {
        const response = await http.get('/expenses');
        this.expenses = response.data;
        this.filteredExpenses = [...this.expenses];
      } catch (error) {
        console.error('Error fetching expenses:', error);
        this.showError('حدث خطأ في جلب المصروفات');
      } finally {
        this.loadingExpenses = false;
      }
    },

    // البحث والتصفية
    searchInvoices() {
      this.currentInvoicePage = 1;
      this.filterInvoices();
    },

    filterInvoices() {
      let filtered = this.invoices;

      // البحث
      if (this.invoiceSearch) {
        const searchTerm = this.invoiceSearch.toLowerCase();
        filtered = filtered.filter(invoice => 
          invoice.student?.name?.toLowerCase().includes(searchTerm) ||
          invoice.student?.email?.toLowerCase().includes(searchTerm) ||
          invoice.description?.toLowerCase().includes(searchTerm) ||
          invoice.id.toString().includes(searchTerm)
        );
      }

      // التصفية بالحالة
      if (this.invoiceFilter !== 'all') {
        filtered = filtered.filter(invoice => invoice.status === this.invoiceFilter);
      }

      // التصفية بالفصل
      if (this.selectedClass) {
        filtered = filtered.filter(invoice => invoice.student?.class === this.selectedClass);
      }

      this.filteredInvoices = filtered;
      this.sortInvoices(this.invoiceSortField);
    },

    sortInvoices(field) {
      if (this.invoiceSortField === field) {
        this.invoiceSortDirection = this.invoiceSortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.invoiceSortField = field;
        this.invoiceSortDirection = 'desc';
      }

      this.filteredInvoices.sort((a, b) => {
        let aValue = a;
        let bValue = b;

        // التعامل مع الحقول المتداخلة
        if (field.includes('.')) {
          const fields = field.split('.');
          aValue = a;
          bValue = b;
          for (const f of fields) {
            aValue = aValue?.[f];
            bValue = bValue?.[f];
          }
        } else {
          aValue = a[field];
          bValue = b[field];
        }

        if (this.invoiceSortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    },

    searchSalaries() {
      this.filterSalaries();
    },

    filterSalaries() {
      let filtered = this.salaries;

      if (this.salarySearch) {
        const searchTerm = this.salarySearch.toLowerCase();
        filtered = filtered.filter(salary => 
          salary.teacher?.name?.toLowerCase().includes(searchTerm) ||
          salary.teacher?.specialization?.toLowerCase().includes(searchTerm) ||
          salary.month?.toLowerCase().includes(searchTerm)
        );
      }

      if (this.salaryFilter !== 'all') {
        filtered = filtered.filter(salary => salary.status === this.salaryFilter);
      }

      if (this.selectedMonth) {
        filtered = filtered.filter(salary => salary.month === this.selectedMonth);
      }

      this.filteredSalaries = filtered;
    },

    searchExpenses() {
      this.filterExpenses();
    },

    filterExpenses() {
      let filtered = this.expenses;

      if (this.expenseSearch) {
        const searchTerm = this.expenseSearch.toLowerCase();
        filtered = filtered.filter(expense => 
          expense.description?.toLowerCase().includes(searchTerm) ||
          expense.category?.toLowerCase().includes(searchTerm) ||
          expense.recipient?.toLowerCase().includes(searchTerm)
        );
      }

      if (this.expenseTypeFilter !== 'all') {
        filtered = filtered.filter(expense => expense.type === this.expenseTypeFilter);
      }

      // تصفية بالفترة (يمكن تطويرها أكثر)
      if (this.expensePeriodFilter !== 'all') {
        const now = new Date();
        filtered = filtered.filter(expense => {
          const expenseDate = new Date(expense.date);
          // تطبيق منطق التصفية حسب الفترة
          return true; // مؤقتاً
        });
      }

      this.filteredExpenses = filtered;
    },

    // إدارة التحديد
    toggleSelectAllInvoices() {
      if (this.selectAllInvoices) {
        this.selectedInvoices = this.paginatedInvoices.map(invoice => invoice.id);
      } else {
        this.selectedInvoices = [];
      }
    },

    updateSelectAll() {
      this.selectAllInvoices = this.selectedInvoices.length === this.paginatedInvoices.length;
    },

    clearSelection() {
      this.selectedInvoices = [];
      this.selectAllInvoices = false;
    },

    // التصفح
    changeInvoicePage(page) {
      if (page >= 1 && page <= this.totalInvoicePages) {
        this.currentInvoicePage = page;
      }
    },

    resetInvoicePagination() {
      this.currentInvoicePage = 1;
    },

    // الفواتير - CRUD
    openAddInvoiceModal() {
      this.invoiceModalTitle = 'إنشاء فاتورة جديدة';
      this.editingInvoice = null;
      this.invoiceForm = {
        student_id: '',
        amount: '',
        description: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: this.getNextMonthDate(),
        academic_year: '2023-2024',
        semester: 'الأول',
        status: 'pending'
      };
      this.showInvoiceModal = true;
    },
    
    editInvoice(invoice) {
      this.invoiceModalTitle = 'تعديل الفاتورة';
      this.editingInvoice = invoice;
      this.invoiceForm = { ...invoice };
      this.showInvoiceModal = true;
    },

    viewInvoice(invoice) {
      this.viewedInvoice = invoice;
      this.showViewInvoiceModal = true;
    },
    
    closeInvoiceModal() {
      this.showInvoiceModal = false;
      this.editingInvoice = null;
    },

    closeViewInvoiceModal() {
      this.showViewInvoiceModal = false;
      this.viewedInvoice = null;
    },
    
    async saveInvoice() {
      this.saving = true;
      try {
        if (this.editingInvoice) {
          await http.put(`/invoices/${this.editingInvoice.id}`, this.invoiceForm);
          this.showSuccess('تم تحديث الفاتورة بنجاح');
        } else {
          await http.post('/invoices', this.invoiceForm);
          this.showSuccess('تم إنشاء الفاتورة بنجاح');
        }
        
        await this.fetchInvoices();
        await this.fetchFinancialStats();
        this.closeInvoiceModal();
      } catch (error) {
        console.error('Error saving invoice:', error);
        this.handleError(error, 'الفاتورة');
      } finally {
        this.saving = false;
      }
    },
    
    async markInvoiceAsPaid(invoice) {
      if (confirm(`هل تريد تسديد فاتورة ${invoice.student?.name} بقيمة ${this.formatCurrency(invoice.amount)}؟`)) {
        try {
          await http.post(`/invoices/${invoice.id}/mark-paid`);
          this.showSuccess('تم تسديد الفاتورة بنجاح');
          await this.fetchInvoices();
          await this.fetchFinancialStats();
        } catch (error) {
          console.error('Error marking invoice as paid:', error);
          this.showError('حدث خطأ في تسديد الفاتورة');
        }
      }
    },

    async bulkMarkAsPaid() {
      if (confirm(`هل تريد تسديد ${this.selectedInvoices.length} فاتورة؟`)) {
        try {
          const promises = this.selectedInvoices.map(id => 
            http.post(`/invoices/${id}/mark-paid`)
          );
          await Promise.all(promises);
          this.showSuccess(`تم تسديد ${this.selectedInvoices.length} فاتورة بنجاح`);
          await this.fetchInvoices();
          await this.fetchFinancialStats();
          this.clearSelection();
        } catch (error) {
          console.error('Error bulk marking invoices as paid:', error);
          this.showError('حدث خطأ في تسديد الفواتير');
        }
      }
    },
    
    async deleteInvoice(id) {
      if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
        try {
          await http.delete(`/invoices/${id}`);
          this.showSuccess('تم حذف الفاتورة بنجاح');
          await this.fetchInvoices();
          await this.fetchFinancialStats();
        } catch (error) {
          console.error('Error deleting invoice:', error);
          this.showError('حدث خطأ في حذف الفاتورة');
        }
      }
    },

    async bulkDeleteInvoices() {
      if (confirm(`هل أنت متأكد من حذف ${this.selectedInvoices.length} فاتورة؟`)) {
        try {
          const promises = this.selectedInvoices.map(id => 
            http.delete(`/invoices/${id}`)
          );
          await Promise.all(promises);
          this.showSuccess(`تم حذف ${this.selectedInvoices.length} فاتورة بنجاح`);
          await this.fetchInvoices();
          await this.fetchFinancialStats();
          this.clearSelection();
        } catch (error) {
          console.error('Error bulk deleting invoices:', error);
          this.showError('حدث خطأ في حذف الفواتير');
        }
      }
    },

    // المرتبات - CRUD
    openAddSalaryModal() {
      this.salaryModalTitle = 'إضافة راتب جديد';
      this.editingSalary = null;
      this.salaryForm = {
        teacher_id: '',
        base_salary: '',
        bonuses: '0',
        deductions: '0',
        month: new Date().toLocaleString('ar-EG', { month: 'long' }),
        year: new Date().getFullYear().toString(),
        notes: ''
      };
      this.showSalaryModal = true;
    },
    
    editSalary(salary) {
      this.salaryModalTitle = 'تعديل الراتب';
      this.editingSalary = salary;
      this.salaryForm = { ...salary };
      this.showSalaryModal = true;
    },

    viewSalary(salary) {
      // يمكن تطويره لعرض تفاصيل أكثر
      alert(`عرض راتب: ${salary.teacher?.name}\nالصافي: ${this.formatCurrency(salary.net_salary)}\nالحالة: ${salary.status === 'paid' ? 'مسدد' : 'معلق'}`);
    },
    
    closeSalaryModal() {
      this.showSalaryModal = false;
      this.editingSalary = null;
    },
    
    async saveSalary() {
      this.saving = true;
      try {
        const formData = {
          ...this.salaryForm,
          net_salary: this.netSalary
        };
        
        if (this.editingSalary) {
          await http.put(`/salaries/${this.editingSalary.id}`, formData);
          this.showSuccess('تم تحديث الراتب بنجاح');
        } else {
          await http.post('/salaries', formData);
          this.showSuccess('تم إضافة الراتب بنجاح');
        }
        
        await this.fetchSalaries();
        await this.fetchFinancialStats();
        this.closeSalaryModal();
      } catch (error) {
        console.error('Error saving salary:', error);
        this.handleError(error, 'الراتب');
      } finally {
        this.saving = false;
      }
    },
    
    async processSalaryPayment(salary) {
      if (confirm(`هل تريد صرف راتب ${salary.teacher?.name} بقيمة ${this.formatCurrency(salary.net_salary)}؟`)) {
        try {
          await http.post(`/salaries/${salary.id}/process-payment`);
          this.showSuccess('تم صرف الراتب بنجاح');
          await this.fetchSalaries();
          await this.fetchFinancialStats();
        } catch (error) {
          console.error('Error processing salary payment:', error);
          this.showError('حدث خطأ في صرف الراتب');
        }
      }
    },
    
    async deleteSalary(id) {
      if (confirm('هل أنت متأكد من حذف هذا الراتب؟')) {
        try {
          await http.delete(`/salaries/${id}`);
          this.showSuccess('تم حذف الراتب بنجاح');
          await this.fetchSalaries();
        } catch (error) {
          console.error('Error deleting salary:', error);
          this.showError('حدث خطأ في حذف الراتب');
        }
      }
    },
    
    // المصروفات - CRUD
    openAddExpenseModal() {
      this.expenseModalTitle = 'إضافة مصروف جديد';
      this.editingExpense = null;
      this.expenseForm = {
        type: 'operational',
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
        recipient: '',
        reference_number: '',
        notes: ''
      };
      this.showExpenseModal = true;
    },
    
    editExpense(expense) {
      this.expenseModalTitle = 'تعديل المصروف';
      this.editingExpense = expense;
      this.expenseForm = { ...expense };
      this.showExpenseModal = true;
    },

    viewExpense(expense) {
      // يمكن تطويره لعرض تفاصيل أكثر
      alert(`عرض مصروف: ${expense.description}\nالمبلغ: ${this.formatCurrency(expense.amount)}\nالنوع: ${this.getExpenseTypeText(expense.type)}`);
    },
    
    closeExpenseModal() {
      this.showExpenseModal = false;
      this.editingExpense = null;
    },
    
    async saveExpense() {
      this.saving = true;
      try {
        if (this.editingExpense) {
          await http.put(`/expenses/${this.editingExpense.id}`, this.expenseForm);
          this.showSuccess('تم تحديث المصروف بنجاح');
        } else {
          await http.post('/expenses', this.expenseForm);
          this.showSuccess('تم إضافة المصروف بنجاح');
        }
        
        await this.fetchExpenses();
        await this.fetchFinancialStats();
        this.closeExpenseModal();
      } catch (error) {
        console.error('Error saving expense:', error);
        this.handleError(error, 'المصروف');
      } finally {
        this.saving = false;
      }
    },
    
    async deleteExpense(id) {
      if (confirm('هل أنت متأكد من حذف هذا المصروف؟')) {
        try {
          await http.delete(`/expenses/${id}`);
          this.showSuccess('تم حذف المصروف بنجاح');
          await this.fetchExpenses();
          await this.fetchFinancialStats();
        } catch (error) {
          console.error('Error deleting expense:', error);
          this.showError('حدث خطأ في حذف المصروف');
        }
      }
    },
    
    // طرق مساعدة
    handleError(error, entity) {
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        this.showError(`حدث خطأ في حفظ ${entity}: ${errors.join(', ')}`);
      } else {
        this.showError(`حدث خطأ في حفظ ${entity}`);
      }
    },

    showSuccess(message) {
      alert(message); // يمكن استبداله بـ toast notification
    },

    showError(message) {
      alert(message); // يمكن استبداله بـ toast notification
    },

    // إجراءات إضافية
    refreshInvoices() {
      this.fetchInvoices();
    },

    refreshSalaries() {
      this.fetchSalaries();
    },

    refreshExpenses() {
      this.fetchExpenses();
    },

    openQuickInvoiceModal() {
      this.activeTab = 'students';
      this.openAddInvoiceModal();
    },

    generateFinancialReport() {
      this.showSuccess('جاري إنشاء التقرير المالي...');
      // يمكن إضافة كود إنشاء PDF هنا
    },

    exportInvoices() {
      this.showSuccess('جاري تصدير الفواتير...');
    },

    exportSalaries() {
      this.showSuccess('جاري تصدير المرتبات...');
    },

    exportExpenses() {
      this.showSuccess('جاري تصدير المصروفات...');
    },

    printInvoice(invoice) {
      this.showSuccess('جاري طباعة الفاتورة...');
      // يمكن إضافة كود الطباعة هنا
    }
  }
};
</script>

<style scoped>
/* تحسينات التصميم العامة */
.loading {
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #666;
}

.loading i {
  margin-left: 10px;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.no-data i {
  font-size: 4rem;
  margin-bottom: 20px;
  display: block;
  opacity: 0.5;
}

.no-data p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

/* تحسينات الجداول */
.table-container {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.table-info {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;
  color: #6c757d;
}

.table-actions .btn {
  padding: 8px 12px;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  margin: 0;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
  padding: 15px 12px;
  border-bottom: 2px solid #dee2e6;
  cursor: pointer;
  user-select: none;
}

.table th:hover {
  background: #e9ecef;
}

.table td {
  padding: 12px;
  vertical-align: middle;
  border-bottom: 1px solid #dee2e6;
}

.table tbody tr:hover {
  background: #f8f9fa;
}

.table tbody tr.selected {
  background: #e3f2fd;
}

/* تحسينات الخلايا */
.student-info, .teacher-info {
  display: flex;
  flex-direction: column;
}

.student-info strong, .teacher-info strong {
  font-weight: 600;
}

.student-info small, .teacher-info small {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 2px;
}

.amount.paid {
  color: #28a745;
  font-weight: 600;
}

.bonus-amount {
  color: #28a745;
  font-size: 0.9rem;
}

.deduction-amount {
  color: #dc3545;
  font-size: 0.9rem;
}

.net-salary {
  color: #007bff;
  font-size: 1.1rem;
}

.month-year {
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.payment-date {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 2px;
}

.date-cell {
  display: flex;
  flex-direction: column;
}

.date-cell small {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 2px;
}

.description-cell {
  max-width: 200px;
}

.recipient-cell {
  display: flex;
  flex-direction: column;
}

/* أزرار الإجراءات */
.action-buttons {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-icon:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-outline {
  background: transparent;
  border: 1px solid #6c757d;
  color: #6c757d;
}

.btn-outline:hover {
  background: #6c757d;
  color: white;
}

/* التصفح */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-info {
  font-size: 0.9rem;
  color: #6c757d;
}

.page-size {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #6c757d;
}

.page-size select {
  padding: 4px 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

/* الإجراءات الجماعية */
.bulk-actions {
  position: sticky;
  bottom: 0;
  background: #007bff;
  color: white;
  padding: 15px 20px;
  margin-top: 20px;
  border-radius: 8px;
}

.bulk-actions-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bulk-buttons {
  display: flex;
  gap: 10px;
}

/* تحسينات الـ Modals */
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
  padding: 20px;
}

.modal {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: modalAppear 0.3s ease;
}

.modal-lg {
  max-width: 700px;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  color: #495057;
  font-size: 1.4rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #6c757d;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

.modal-body {
  padding: 30px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 20px 30px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* تحسينات النماذج */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #495057;
  font-size: 0.9rem;
}

.form-control {
  padding: 12px 15px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-control.readonly {
  background: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
}

.input-with-symbol {
  position: relative;
}

.input-symbol {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-weight: 500;
}

.input-with-symbol .form-control {
  padding-left: 50px;
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
}

/* تفاصيل الفاتورة */
.invoice-details {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.detail-section h4 {
  margin-bottom: 15px;
  color: #495057;
  font-size: 1.1rem;
  border-bottom: 2px solid #007bff;
  padding-bottom: 8px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f8f9fa;
}

.detail-item label {
  font-weight: 600;
  color: #6c757d;
}

.detail-item span.amount {
  font-weight: 700;
  color: #28a745;
  font-size: 1.1rem;
}

/* تحسينات الـ Status */
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  min-width: 80px;
}

.status-badge.paid {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-badge.overdue {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.overdue-badge {
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  margin-right: 5px;
}

.text-warning {
  color: #ffc107 !important;
  font-weight: 600;
}

.text-muted {
  color: #6c757d !important;
}

/* تحسينات الـ Expenses */
.expense-type, .payment-method {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.expense-type.operational {
  background: #d1ecf1;
  color: #0c5460;
}

.expense-type.administrative {
  background: #f8d7da;
  color: #721c24;
}

.expense-type.academic {
  background: #d4edda;
  color: #155724;
}

.payment-method.cash {
  background: #fff3cd;
  color: #856404;
}

.payment-method.transfer {
  background: #d1ecf1;
  color: #0c5460;
}

.payment-method.check {
  background: #e2e3e5;
  color: #383d41;
}

.expense-category {
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.expense-amount {
  font-weight: 600;
  color: #dc3545;
  font-size: 1rem;
}

/* تحسينات الـ Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.summary-card {
  padding: 25px;
  border-radius: 12px;
  color: white;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-5px);
}

.summary-card.operational {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.summary-card.administrative {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.summary-card.academic {
  background: linear-gradient(135deg, #27ae60, #229954);
}

.summary-icon {
  font-size: 2.5rem;
  opacity: 0.9;
}

.summary-content h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  opacity: 0.9;
}

.summary-content .amount {
  font-size: 1.8rem;
  font-weight: bold;
}

/* تحسينات الـ Panel */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.panel-actions {
  display: flex;
  gap: 15px;
}

/* تحسينات الـ Filters */
.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 600;
  color: #495057;
  white-space: nowrap;
}

.filter-group input, .filter-group select {
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background: white;
  min-width: 150px;
}

.filter-group input:focus, .filter-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

/* تحسينات الاستجابة */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .tabs-header {
    flex-direction: column;
  }

  .filters {
    flex-direction: column;
  }

  .filter-group {
    width: 100%;
    justify-content: space-between;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .pagination-container {
    flex-direction: column;
    gap: 15px;
  }

  .bulk-actions-content {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .panel-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .panel-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .modal {
    width: 95%;
    margin: 10px;
  }

  .modal-lg {
    max-width: 95%;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .summary-cards {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-icon {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
}

.stat-info h3 {
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: var(--dark-gray);
}

.stat-info p {
  color: #666;
  margin-bottom: 5px;
}

.stat-trend {
  font-size: 0.9rem;
  font-weight: bold;
}

.stat-trend.positive {
  color: #27ae60;
}

.stat-trend.negative {
  color: #e74c3c;
}

.financial-tabs {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.tabs-header {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.tab-btn {
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  background: #e9ecef;
}

.tab-btn.active {
  background: white;
  border-bottom: 3px solid var(--primary-orange);
  color: var(--primary-orange);
  font-weight: bold;
}

.tab-content {
  padding: 0;
}

.tab-panel {
  padding: 30px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: bold;
  color: #495057;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  background: white;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  margin: 0 2px;
  color: var(--primary-blue);
  transition: color 0.3s ease;
}

.btn-icon:hover {
  color: var(--primary-orange);
}

.btn-icon.btn-danger {
  color: var(--accent-red);
}

.btn-icon.btn-danger:hover {
  color: #c0392b;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  min-width: 80px;
}

.status-badge.paid {
  background-color: #e8f6f3;
  color: #27ae60;
}

.status-badge.pending {
  background-color: #fef9e7;
  color: #f39c12;
}

.status-badge.overdue {
  background-color: #fdedec;
  color: #e74c3c;
}

.overdue {
  color: #e74c3c;
  font-weight: bold;
}

.expenses-summary {
  margin-bottom: 25px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.summary-card {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: white;
}

.summary-card.operational {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.summary-card.administrative {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.summary-card.academic {
  background: linear-gradient(135deg, #27ae60, #229954);
}

.summary-card h4 {
  margin-bottom: 10px;
  font-size: 1rem;
}

.summary-card .amount {
  font-size: 1.5rem;
  font-weight: bold;
}

.expense-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.expense-type.operational {
  background: #ebf5fb;
  color: #3498db;
}

.expense-type.administrative {
  background: #fdedec;
  color: #e74c3c;
}

.expense-type.academic {
  background: #e8f6f3;
  color: #27ae60;
}

.report-actions {
  display: flex;
  gap: 15px;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
}

.report-card {
  padding: 25px;
}

.report-card h4 {
  margin-bottom: 20px;
  color: var(--dark-gray);
  border-bottom: 2px solid #f8f9fa;
  padding-bottom: 10px;
}

.chart-placeholder {
  height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  margin-bottom: 20px;
}

.chart-placeholder i {
  font-size: 3rem;
  margin-bottom: 10px;
}

.report-summary {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.summary-item:last-child {
  border-bottom: none;
}

</style>