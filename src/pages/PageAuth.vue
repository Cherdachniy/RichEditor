<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import axios from 'axios';

const toast = useToast()
const router = useRouter()
const userStore = useUserStore();
const email = ref<string>('')
const password = ref<string>('')
const isLogin = ref<boolean>(true)
const isLoading = ref<boolean>(false)

const signIn = async (): Promise<void> => {
    isLoading.value = true
    try {
        await axios.post('http://localhost:3000/login',
            { username: email.value, password: password.value, },
            { headers: { 'Content-Type': 'application/json' } }
        );

        sessionStorage.setItem('loggedUser', JSON.stringify({ username: email.value, loggedIn: true }));
        userStore.isLogged = true;
        router.push('/')
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
        }
    } finally {
        isLoading.value = false
    }
}

const submitForm = (): void => {
    if (isLogin.value) {
        signIn()
    }
}
</script>

<template>
    <app-toast position="bottom-right" />
    <div class="flex justify-content-center p-2">
        <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
            <div class="text-center mb-3">
                <div class="text-900 text-3xl font-medium mb-3">Вход</div>
            </div>

            <form @submit.prevent="submitForm">
                <label for="email" class="block text-900 font-medium mb-2">Email</label>
                <app-input-text v-model="email" id="email" type="email" class="w-full mb-3" />

                <label for="password" class="block text-900 font-medium mb-2">Пароль</label>
                <app-input-text v-model="password" id="password" type="password" class="w-full mb-3" />

                <app-button :label="'Войти'" type="submit" icon="pi pi-user" :loading="isLoading" class="w-full">
                </app-button>
            </form>
        </div>
    </div>
</template>

<style lang="">

</style>