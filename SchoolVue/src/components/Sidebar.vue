<template>
  <aside class="sidebar">
    <nav class="sidebar-nav">
      <ul>
        <li>
          <router-link to="/" class="nav-link" active-class="active">
            <i class="fas fa-tachometer-alt"></i>
            <span>لوحة التحكم</span>
          </router-link>
        </li>
        <li>
          <router-link to="/students" class="nav-link" active-class="active">
            <i class="fas fa-user-graduate"></i>
            <span>الطلاب</span>
          </router-link>
        </li>
        <li>
          <router-link to="/teachers" class="nav-link" active-class="active">
            <i class="fas fa-chalkboard-teacher"></i>
            <span>المدرسون</span>
          </router-link>
        </li>
        <li>
          <router-link to="/accounts" class="nav-link" active-class="active">
            <i class="fas fa-calculator"></i>
            <span>الحسابات</span>
          </router-link>
        </li>
        <li>
          <a href="#" class="nav-link">
            <i class="fas fa-book"></i>
            <span>المواد الدراسية</span>
          </a>
        </li>
        <li>
          <a href="#" class="nav-link">
            <i class="fas fa-calendar-alt"></i>
            <span>الجدول الدراسي</span>
          </a>
        </li>
        <li>
          <a href="#" class="nav-link">
            <i class="fas fa-clipboard-list"></i>
            <span>التقارير</span>
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: var(--dark-gray);
  color: white;
  height: calc(100vh - 70px);
  position: sticky;
  top: 70px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
}

.sidebar-nav li {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: var(--primary-orange);
}

.nav-link i {
  margin-left: 10px;
  width: 20px;
  text-align: center;
}
</style>
