<template>
  <div>
    <Dialog v-model:visible="dialogIsVisible" modal header="Data User" @afterHide="() => navigateTo('/settings/users')">
    <div class="data">
      <div class="data__attribute">
        <span class="data__attribute__label">User ID</span>
        <span class="data__attribute__value">{{ (data as any).user_id }}</span>
      </div>
      <div class="data__attribute">
        <span class="data__attribute__label">Username</span>
        <span class="data__attribute__value">{{ (data as any).username }}</span>
      </div>
      <div class="data__attribute">
        <span class="data__attribute__label">Nama Lengkap</span>
        <span class="data__attribute__value">{{ (data as any).nama_lengkap }}</span>
      </div>
      <div class="data__attribute">
        <span class="data__attribute__label">Role</span>
        <span class="data__attribute__value">{{ (data as any).role }}</span>
      </div>
      <div class="data__attribute">
        <span class="data__attribute__label">Tanggal Buat</span>
        <span class="data__attribute__value">{{ (data as any).ctime }}</span>
      </div>
    </div>
    <Button class="action-button" label="Edit" @click="navigateTo(`${route.path}/edit`)" />
    <template v-if="status == 'pending'">
      <div class="skeletons">
        <Skeleton class="skeletons__item skeletons__item--header" height="1.25rem" />
        <Skeleton class="skeletons__item skeletons__item--body" height="1rem" />
        <Skeleton class="skeletons__item skeletons__item--body" height="1rem" />
        <Skeleton class="skeletons__item skeletons__item--body" height="1rem" />
      </div>
    </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const dialogIsVisible = ref(true);

const { data, status, refresh, error } = useFetch(`/api/users/${route.params.id}`, {
  server: false,
  lazy: true,
  watch: false,
});

const roleOptions: { label: string, value: string }[] = [
  { label: "Admin", value: "admin" },
  { label: "Non-Admin", value: "non_admin" },
]
</script>

<style scoped lang="scss">
.data {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__attribute {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
    width: 400px;

    &__label {
      font-weight: bold;
    }
  }
}

.action-button {
  margin-top: 2rem;
}

.changed-indicator {
  margin-left: 0.5rem;
}
</style>
