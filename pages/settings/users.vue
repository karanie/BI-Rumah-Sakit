<template>
  <DataTable v-if="status == 'success'" :value="data?.rows" paginator :rows="10" :virtualScrollerOptions="{ itemSize: 59 }" v-model:filters="filters" :globalFilterFields="['user_id', 'username', 'nama_lengkap', 'role']">
    <template #header>
      <div class="table__header">
        <div class="table__header__heading">
          <Button icon="pi pi-plus" @click="() => navigateTo('/settings/users/create')" label="User Baru" />
        </div>
        <div class="table__header__trailing">
          <InputGroup>
            <InputGroupAddon>
              <Icon name="material-symbols:search" />
            </InputGroupAddon>
            <InputText placeholder="Cari" v-model="filters.global.value" />
          </InputGroup>
          <Button icon="pi" rounded plain text @click="() => refresh()"><Icon name="material-symbols:refresh" /></Button>
        </div>
      </div>
    </template>
    <Column field="user_id" header="User ID" />
    <Column field="username" header="Username" />
    <Column field="nama_lengkap" header="Nama Lengkap" />
    <Column field="role" header="Role" />
    <Column field="ctime" header="Tanggal Buat">
      <template #body="slotProps">
        {{ (new Date(slotProps.data.ctime)).toLocaleDateString() }}
      </template>
    </Column>
    <Column field="action" header="">
      <template #body="slotProps">
        <ButtonGroup>
        <Button icon="pi" severity="secondary" @click="() => navigateTo(`/settings/users/${slotProps.data.user_id}/edit`)" ><Icon name="material-symbols:edit" /></Button>
        <Button icon="pi" severity="danger" @click="async () => await deleteUser(slotProps.data.user_id)"><Icon name="material-symbols:delete" /></Button>
        </ButtonGroup>
      </template>
    </Column>
  </DataTable>
  <template v-if="status == 'pending'">
    <div class="skeletons">
      <Skeleton class="skeletons__item skeletons__item--header" height="1.25rem" />
      <Skeleton class="skeletons__item skeletons__item--body" height="1rem" />
      <Skeleton class="skeletons__item skeletons__item--body" height="1rem" />
      <Skeleton class="skeletons__item skeletons__item--body" height="1rem" />
    </div>
  </template>
  <NuxtPage />
</template>

<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api';

definePageMeta({
  layout: "settings",
});

const route = useRoute();

const { data, status, refresh, error } = useFetch("/api/users", {
  server: false,
  lazy: true,
  watch: false,
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

async function deleteUser(id: number) {
  await $fetch(`/api/users/${id}`, { method: "DELETE" } );
  refresh();
}

watch(() => route.path, () => route.path == "/settings/users" && refresh());
</script>

<style scoped lang="scss">
.table {
  &__header {
    display: flex;

    &__trailing {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 0 auto;
    }
  }
}

.skeletons {
  &__item {
    margin: 0.75rem 1rem;
    &--header {
    }
  }
}
</style>
