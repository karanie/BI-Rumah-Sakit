<template>
  <div>
    <Dialog v-model:visible="dialogIsVisible" modal header="Edit User" @afterHide="() => navigateTo('/settings/users')">
    <form v-if="status == 'success'" @submit.prevent="edit" class="form">
      <div>
      <FloatLabel>
        <InputText
          id="username" v-model="inputData.username"
          disabled
        />
        <label for="username">Username</label>
        <Button icon="pi pi-undo" text  class="changed-indicator" v-show="inputData.username != (data as any).username" @click="() => inputData.username = (data as any).username" />
      </FloatLabel>
      </div>

      <div>
      <FloatLabel>
        <InputText
          id="nama_lengkap" v-model="inputData.nama_lengkap"
        />
        <label for="nama_lengkap">Nama Lengkap</label>
        <Button icon="pi pi-undo" text  class="changed-indicator" v-show="inputData.nama_lengkap != (data as any).nama_lengkap" @click="() => inputData.nama_lengkap = (data as any).nama_lengkap" />
      </FloatLabel>
      </div>

      <div>
      <FloatLabel>
        <Dropdown
          id="role" v-model="inputData.role"
          :options="roleOptions" optionLabel="label"
        />
        <label for="role">Role</label>
        <Button icon="pi pi-undo" text  class="changed-indicator" v-show="inputData.role.value != (data as any).role" @click="() => inputData.role = setRole((data as any).role)" />
      </FloatLabel>
      </div>

      <div>
      <FloatLabel>
        <InputText
          id="no_hp" v-model="inputData.no_hp"
          :options="roleOptions" optionLabel="label"
        />
        <label for="no_hp">No. HP</label>
        <Button icon="pi pi-undo" text  class="changed-indicator" v-show="inputData.no_hp != (data as any).no_hp" @click="() => inputData.no_hp = (data as any).no_hp" />
      </FloatLabel>
      </div>

      <div class="error" v-if="submitError">Terjadi kesalahan</div>

      <div class="form-button">
        <Button :disabled="inputDataIsReady" type="submit" class="form-button__button" label="Edit" />
      </div>
    </form>
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

const inputData = reactive({
  username: "",
  nama_lengkap: "",
  role: { label: "", value: "" },
  no_hp: "",
});
const inputDataIsReady = computed(() => !(inputData.username && inputData.nama_lengkap && inputData.no_hp && inputData.role.value));

const submitError = ref();

watch(data, () => {
  if (!data.value) return;
  inputData.username = (data.value as any).username;
  inputData.nama_lengkap = (data.value as any).nama_lengkap;
  inputData.role = setRole((data.value as any).role);
  inputData.no_hp = (data.value as any).no_hp;
});

function setRole(role: string) {
  return roleOptions.find((i: { value: string, label: string }) => i.value === role) || { label: "", value: "" };
}

async function edit() {
  try {
    await $fetch(`/api/users/${(data.value as any).user_id}`, {
      method: "PUT",
      body: {
        nama_lengkap: inputData.nama_lengkap,
        role: inputData.role.value,
        no_hp: inputData.no_hp,
      }
    });
    navigateTo("/settings/users");
  } catch(err) {
    submitError.value = err;
  }
}
</script>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 2rem;
}

.changed-indicator {
  margin-left: 0.5rem;
}
</style>
