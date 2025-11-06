<template>
  <div class="home">
    <Dashboard />
  </div>
</template>

<script>
import Dashboard from '../components/Dashboard.vue';

export default {
  name: 'Home',
  components: {
    Dashboard,
  },
};
</script>

<style scoped>
.home {
  width: 100%;
}
</style>
