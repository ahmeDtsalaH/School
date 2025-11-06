<template>
<div id="app">
  <Header />
  <div class="main-container">
    <Sidebar />
    <div class="content">
      <router-view />
    </div>
  </div>
  <Modal 
    v-if="showModal" 
    :modalData="modalData" 
    @close="closeModal" 
  />
</div>
</template>

<script>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
import Modal from './components/Modal.vue'

export default {
name: 'App',
components: {
  Header,
  Sidebar,
  Modal
},
data() {
  return {
    showModal: false,
    modalData: {}
  }
},
methods: {
  openModal(data) {
    this.modalData = data
    this.showModal = true
  },
  closeModal() {
    this.showModal = false
    this.modalData = {}
  }
},
provide() {
  return {
    openModal: this.openModal
  }
}
}
</script>

<style>
:root {
--primary-orange: #FF7F32;
--primary-blue: #3498DB;
--accent-red: #E74C3C;
--light-gray: #F5F5F5;
--dark-gray: #2C3E50;
--white: #FFFFFF;
--shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

* {
margin: 0;
padding: 0;
box-sizing: border-box;
font-family: 'Tajawal', 'Arial', sans-serif;
}

body {
background-color: var(--light-gray);
direction: rtl;
}

#app {
min-height: 100vh;
display: flex;
flex-direction: column;
}

.main-container {
display: flex;
flex: 1;
}

.content {
flex: 1;
padding: 20px;
overflow-y: auto;
}

/* تصميم الأزرار */
.btn {
padding: 10px 15px;
border: none;
border-radius: 5px;
cursor: pointer;
font-weight: bold;
transition: all 0.3s ease;
}

.btn-primary {
background-color: var(--primary-orange);
color: white;
}

.btn-primary:hover {
background-color: #e06a28;
}

.btn-secondary {
background-color: var(--primary-blue);
color: white;
}

.btn-secondary:hover {
background-color: #2980B9;
}

.btn-danger {
background-color: var(--accent-red);
color: white;
}

.btn-danger:hover {
background-color: #C0392B;
}

/* تصميم البطاقات */
.card {
background-color: var(--white);
border-radius: 8px;
box-shadow: var(--shadow);
padding: 20px;
margin-bottom: 20px;
}

/* تصميم الجداول */
.table {
width: 100%;
border-collapse: collapse;
margin-top: 15px;
}

.table th, .table td {
padding: 12px 15px;
text-align: right;
border-bottom: 1px solid #ddd;
}

.table th {
background-color: var(--primary-blue);
color: white;
}

.table tr:hover {
background-color: #f1f1f1;
}
</style>