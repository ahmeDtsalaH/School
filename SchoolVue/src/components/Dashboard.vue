<template>
  <div class="dashboard">
    <h2>لوحة التحكم</h2>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background-color: var(--primary-blue)">
          <i class="fas fa-user-graduate"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.totalStudents }}</h3>
          <p>الطلاب المسجلين</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background-color: var(--primary-orange)">
          <i class="fas fa-chalkboard-teacher"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.totalTeachers }}</h3>
          <p>المدرسون</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background-color: var(--accent-red)">
          <i class="fas fa-book"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.activeStudents }}</h3>
          <p>الطلاب النشطين</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background-color: #2ecc71">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.activeTeachers }}</h3>
          <p>المدرسون النشطين</p>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="recent-activities card">
        <h3>أحدث الأنشطة</h3>
        <div class="loading" v-if="loadingActivities">
          جاري تحميل الأنشطة...
        </div>
        <ul class="activities-list" v-else>
          <li v-for="activity in recentActivities" :key="activity.id">
            <i :class="activity.icon"></i>
            <span>{{ activity.description }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </li>
          <li v-if="recentActivities.length === 0">
            <i class="fas fa-info-circle"></i>
            <span>لا توجد أنشطة حديثة</span>
          </li>
        </ul>
      </div>

      <div class="quick-actions card">
        <h3>إجراءات سريعة</h3>
        <div class="actions-grid">
          <button class="action-btn" @click="openAddStudentModal">
            <i class="fas fa-user-plus"></i>
            <span>إضافة طالب</span>
          </button>
          <button class="action-btn" @click="openAddTeacherModal">
            <i class="fas fa-chalkboard-teacher"></i>
            <span>إضافة مدرس</span>
          </button>
          <button class="action-btn" @click="navigateToAccounts">
            <i class="fas fa-file-invoice-dollar"></i>
            <span>إنشاء فاتورة</span>
          </button>
          <button class="action-btn" @click="navigateToStudents">
            <i class="fas fa-list"></i>
            <span>عرض الطلاب</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '../http';

export default {
  name: 'Dashboard',
  inject: ['openModal'],
  data() {
    return {
      loadingActivities: false,
      stats: {
        totalStudents: 0,
        totalTeachers: 0,
        activeStudents: 0,
        activeTeachers: 0
      },
      recentActivities: []
    };
  },
  async mounted() {
    await this.fetchDashboardData();
    await this.fetchRecentActivities();
  },
  methods: {
    async fetchDashboardData() {
      try {
        // جلب إحصائيات الطلاب
        const studentsResponse = await http.get('/students');
        const students = studentsResponse.data;
        
        // جلب إحصائيات المدرسين
        const teachersResponse = await http.get('/teachers');
        const teachers = teachersResponse.data;

        this.stats.totalStudents = students.length;
        this.stats.totalTeachers = teachers.length;
        this.stats.activeStudents = students.filter(s => s.status === 'active').length;
        this.stats.activeTeachers = teachers.filter(t => t.status === 'active').length;

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    },

    async fetchRecentActivities() {
      this.loadingActivities = true;
      try {
        // محاكاة جلب الأنشطة الحديثة
        // في التطبيق الحقيقي، سيكون لديك API منفصل للأنشطة
        this.recentActivities = [
          {
            id: 1,
            icon: 'fas fa-user-plus',
            description: 'تم تسجيل طالب جديد: محمد أحمد',
            time: 'منذ ساعتين'
          },
          {
            id: 2,
            icon: 'fas fa-money-bill-wave',
            description: 'تم دفع رسوم الطالب سارة خالد',
            time: 'منذ 4 ساعات'
          },
          {
            id: 3,
            icon: 'fas fa-chalkboard-teacher',
            description: 'تم تعيين مدرس جديد في مادة الرياضيات',
            time: 'منذ يوم'
          }
        ];
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        this.loadingActivities = false;
      }
    },

    openAddStudentModal() {
      this.openModal({
        type: 'addStudent',
        title: 'إضافة طالب جديد',
      });
    },

    openAddTeacherModal() {
      this.openModal({
        type: 'addTeacher',
        title: 'إضافة مدرس جديد',
      });
    },

    navigateToAccounts() {
      this.$router.push('/accounts');
    },

    navigateToStudents() {
      this.$router.push('/students');
    }
  }
};
</script>

<style scoped>
.dashboard h2 {
  margin-bottom: 20px;
  color: var(--dark-gray);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow);
  padding: 20px;
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin-left: 15px;
}

.stat-info h3 {
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.stat-info p {
  color: #777;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.activities-list {
  list-style: none;
  margin-top: 15px;
}

.activities-list li {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.activities-list li i {
  margin-left: 10px;
  color: var(--primary-blue);
  width: 20px;
  text-align: center;
}

.activity-time {
  margin-right: auto;
  color: #777;
  font-size: 0.9rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
}

.action-btn {
  background-color: var(--light-gray);
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: var(--primary-blue);
  color: white;
}

.action-btn i {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>