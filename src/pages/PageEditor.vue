<template>
  <div>
    <h1>Edit now: {{ $route.params.project }} {{ $route.params.type }}</h1>
    <app-editor
      ref="editorRef"
      :modelValue="content"
      @update:modelValue="onContentChange"
      @load="
        () => {
          content = userStore.dataFromPageList
        }
      "
      editorStyle="height: 320px"
    />
    <app-button label="Save" @click="sendHtml" class="my-4" />
  </div>
</template>
<script setup lang="ts">
import axios from 'axios'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'

const userStore = useUserStore()
const route = useRoute()
const editorRef = ref()
const toast = useToast()
let content = ref('<p>Начальный текст</p>')

const onContentChange = (newValue: string) => {
  content.value = newValue
}

watch(editorRef, (editor) => {
  if (!editor) return
  editor.renderValue = function renderValue(this: any, value: any) {
    if (this.quill) {
      if (value) {
        const delta = this.quill.clipboard.convert({ html: value })
        this.quill.setContents(delta, 'silent')
      } else {
        this.quill.setText('')
      }
    }
  }.bind(editor)
})

const sendHtml = async () => {
  const htmlContent = content.value // HTML-содержимое, которое нужно вставить
  // const filePath = `http://localhost:3000/docs/${route.params.project}/${route.params.type}/index.html` // Путь до файла, который нужно создать или обновить

  try {
    const response = await axios.post('http://localhost:3000/create-html', {
      htmlContent,
      project: route.params.project,
      type: route.params.type
    })

    console.log(response.data) // Логируем успешный ответ от сервера
  } catch (error) {
    if (error instanceof Error) {
      // Показываем уведомление о проблеме
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data || error.message,
        life: 3000
      })
    }
    console.error('There was an error!', error) // Логируем ошибку для отладки
  }
}
</script>
