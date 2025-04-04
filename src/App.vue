<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from './stores/user';
import AppHeader from '@/components/AppHeader.vue';

const isLoading = ref<boolean>(false);
const userStore = useUserStore();

onMounted(() => {
  if (sessionStorage.getItem('loggedUser')) {
    userStore.username = JSON.parse(sessionStorage.getItem('loggedUser')).username
    userStore.isLogged = JSON.parse(sessionStorage.getItem('loggedUser')).loggedIn
  } else {
    userStore.username = ''
    userStore.isLogged = false
  }
  isLoading.value = false
})
</script>

<template>
  <div class="container">
    <app-header></app-header>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1280px;
  margin: auto;
  padding: 20px;
}
</style>
