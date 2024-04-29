<template>
  <div>
    <Dialog v-model:visible="dialogIsVisible" modal header="Buat User Baru" @afterHide="() => navigateTo('/settings/users')">
    <form @submit.prevent="create" class="form">
      <div>
      <FloatLabel>
        <InputText
          id="username" v-model="inputData.username"
        />
        <label for="username">Username</label>
      </FloatLabel>
      </div>

      <div>
      <FloatLabel>
        <InputText
          id="nama_lengkap" v-model="inputData.nama_lengkap"
        />
        <label for="nama_lengkap">Nama Lengkap</label>
      </FloatLabel>
      </div>

      <div>
      <FloatLabel>
        <Dropdown
          id="role" v-model="inputData.role"
          :options="roleOptions" optionLabel="label"
        />
        <label for="role">Role</label>
      </FloatLabel>
      </div>

      <div>
      <FloatLabel>
        <InputText
          id="no_hp" v-model="inputData.no_hp"
          :options="roleOptions" optionLabel="label"
        />
        <label for="no_hp">No. HP</label>
      </FloatLabel>
      </div>

      <div>
      <FloatLabel>
        <InputText
          id="password" v-model="inputData.password"
          :options="roleOptions" optionLabel="label"
        />
        <label for="password">Password</label>
      </FloatLabel>
      </div>

      <div class="error" v-if="submitError">Terjadi kesalahan</div>

      <div class="form-button">
        <Button :disabled="inputDataIsReady" type="submit" class="form-button__button" label="Create" />
      </div>
    </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';

const route = useRoute();
const dialogIsVisible = ref(true);

const roleOptions: { label: string, value: string }[] = [
  { label: "Admin", value: "admin" },
  { label: "Non-Admin", value: "non_admin" },
]

const inputData = reactive({
  username: "",
  nama_lengkap: "",
  role: { label: "", value: "" },
  no_hp: "",
  password: "",
});
const inputDataIsReady = computed(() => !(inputData.username && inputData.nama_lengkap && inputData.no_hp && inputData.password && inputData.role.value));

const submitError = ref();

async function create() {
  try {
    await $fetch(`/api/auth/register`, {
      method: "POST",
      body: {
        username: inputData.username,
        nama_lengkap: inputData.nama_lengkap,
        jabatan: inputData.role.value,
        role: inputData.role.value,
        password: inputData.password,
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
</style>
