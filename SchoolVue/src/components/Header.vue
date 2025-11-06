<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <h1>نظام إدارة المدارس</h1>
      </div>
      <div class="user-info">
        <span>مرحباً، أحمد</span>
        <div class="avatar">
          <i class="fas fa-user"></i>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
};
</script>

<style scoped>
.header {
  background-color: var(--primary-blue);
  color: white;
  padding: 0 20px;
  box-shadow: var(--shadow);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.logo h1 {
  font-size: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: var(--primary-orange);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
