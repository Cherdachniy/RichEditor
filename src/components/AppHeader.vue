<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ComputedRef } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

interface IMenuItem {
    label: string,
    icon: string,
    path: string,
    show: ComputedRef<boolean>
}

const items = ref<IMenuItem[]>([
    {
        label: 'Авторизация',
        icon: 'pi pi-user',
        path: '/auth',
        show: computed((): boolean => !userStore.isLogged)
    },
    {
        label: 'Главная',
        icon: 'pi pi-home',
        path: '/',
        show: computed((): boolean => !!userStore.isLogged)
    },
    {
        label: 'Редактор',
        icon: 'pi pi-file-edit',
        path: '/editor',
        show: computed((): boolean => !!userStore.isLogged)
    },
    {
        label: 'Список проектов',
        icon: 'pi pi-list',
        path: '/list',
        show: computed((): boolean => !!userStore.isLogged)
    },
])

const signOutMethod = async (): Promise<void> => {
    sessionStorage.removeItem('loggedUser');
    userStore.isLogged = false
    router.push('/auth')
}
</script>

<template>
    <app-menubar :model="items" class="menu">
        <template #item="{ item, props }">
            <template v-if="item.show">
                <router-link :to="item.path" class="flex align-items-center" v-bind="props.action">
                    <span :class="item.icon" class="p-menuitem-icon"></span>
                    <span class="ml-2">{{ item.label }}</span>
                </router-link>
            </template>
        </template>
        <template #end>
            <span v-if="userStore.isLogged" @click="signOutMethod" class="flex align-items-center menu-exit">
                <span class="pi pi-sign-out p-menuitem-icon"></span>
                <span class="ml-2">Выход</span>
            </span>
        </template>
    </app-menubar>
</template>

<style scoped>
.menu {
    margin: 30px 0;
}

.menu-exit {
    cursor: pointer;
}
</style>