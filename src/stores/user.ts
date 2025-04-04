import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const username = ref<string>('')
  const isLogged = ref<boolean>(false)
  const dataFromPageList = ref<string>('')

  return { username, isLogged, dataFromPageList }
})
