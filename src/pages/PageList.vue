<template>
  <div>
    <h1>Список проектов</h1>
    <div class="card p-fluid">
      <app-data-table
        :value="products"
        :size="'large'"
        v-model:editingRows="editingRows"
        editMode="row"
        dataKey="id"
        @row-edit-save="onRowEditSave"
        stripedRows
        tableStyle="min-width: 50rem"
      >
        <app-column class="max-w-10rem" field="id" header="id"></app-column>
        <app-column class="max-w-10rem" field="project_name" header="Project"></app-column>
        <app-column class="max-w-10rem" field="privacy_doc" header="Privacy">
          <template #body="{ data, field }">
            <app-button @click="getFileData(data[field])" icon="pi pi-pencil"></app-button>
            <p class="max-w-full my-1 text-sm opacity-50 text-overflow-ellipsis overflow-hidden">
              {{ data[field] }}
            </p>
          </template>
          <template #editor="{ data, field }">
            <app-input-text v-model="data[field]" fluid />
          </template>
        </app-column>
        <app-column class="max-w-10rem" field="terms_doc" header="Terms">
          <template #body="{ data, field }">
            <app-button @click="getFileData(data[field])" icon="pi pi-pencil"></app-button>
            <p class="max-w-full my-1 text-sm opacity-50 text-overflow-ellipsis overflow-hidden">
              {{ data[field] }}
            </p>
          </template>
          <template #editor="{ data, field }">
            <app-input-text v-model="data[field]" fluid />
          </template>
        </app-column>
        <app-column
          class="max-w-10rem"
          :rowEditor="true"
          style="width: 10%; min-width: 8rem"
          bodyStyle="text-align:center"
        >
        </app-column>
      </app-data-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

const userStore = useUserStore()
const router = useRouter()
const toast = useToast()
const products = ref()
const editingRows = ref([])

onMounted(() => {
  getRoutes()
})

const onRowEditSave = (event: any) => {
  let { newData, index } = event
  products.value[index] = newData
  updateData(products.value[index].project_name)
}

const updateData = async (project_name: string) => {
  try {
    let sendingData = products.value.find(
      (product: object) => product.project_name === project_name
    )
    await axios.put(`http://localhost:3000/projects/:${project_name}`, sendingData)
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
    }
    console.error('There was an error!', error)
  }
}

const getRoutes = async () => {
  try {
    const response = await axios.get('http://localhost:3000/projects')
    products.value = response.data
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
    }
    console.error('There was an error!', error)
  }
}

const getFileData = async (path: string) => {
  try {
    const response = await axios.get(`http://localhost:3000/docs/${path}`)
    console.log(response)
    router.push({
      name: 'editor',
      params: { project: path.split('/')[0], type: path.split('/')[1] }
    })
    userStore.dataFromPageList = response.data
  } catch (error) {
    if (error instanceof Error) {
      toast.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 })
    }
    console.error('There was an error!', error)
  }
}
</script>
