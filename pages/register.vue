<template>
  <div class="form">
    <div class="form__message">
      Silahkan register dengan username dan password anda. Laman ini
      dipergunakan untuk development saja.
    </div>
    <form @submit.prevent="register" class="form__content">
      <FloatLabel>
        <InputText id="username" v-model="username" />
        <label for="username">Username</label>
      </FloatLabel>
      <FloatLabel>
        <InputText id="nama_lengkap" v-model="nama_lengkap" />
        <label for="username">Nama Lengkap</label>
      </FloatLabel>
      <FloatLabel>
        <InputText id="jabatan" v-model="jabatan" />
        <label for="username">Jabatan</label>
      </FloatLabel>
      <FloatLabel>
        <Dropdown id="role" :options="roles" optionLabel="name" v-model="role" />
        <label for="username">Role</label>
      </FloatLabel>
      <FloatLabel>
        <Password id="password" v-model="password" :feedback="false" toggleMask />
        <label for="password">Password</label>
      </FloatLabel>
      <div class="form-button">
        <NuxtLink to="/login">
          <Button class="form-button__button" label="Login" outlined />
        </NuxtLink>
        <Button :disabled="registerCheck" type="submit" class="form-button__button" label="Register" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "loginregis",
  auth: false,
  unauthenticatedOnly: true,
  navigateAuthenticatedTo: "/login"
});

const { signIn } = useAuth();
const username = ref();
const nama_lengkap = ref();
const password = ref();
const jabatan = ref();
const role = ref();
const roles = ref([
  { name: "Admin", value: "admin"},
  { name: "Non-admin", value: "non_admin"},
]);

const registerCheck = computed(() => !(username.value && nama_lengkap.value && password.value && jabatan.value && role.value));
const getRole = computed(() => role.value.value);

const { execute } = await useFetch('/api/auth/register', {
  method: "POST",
  body: {
    username: username,
    nama_lengkap: nama_lengkap,
    password: password,
    jabatan: jabatan,
    role: getRole
  },
  server: false,
  lazy: true,
  immediate: false,
  watch: false,
  onResponse() {
    signIn({
      username: username.value,
      password: password.value
    },{
      callbackUrl: "/",
    })
  }
})

async function register() {
  execute()
}

</script>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: row;
  gap: 2rem;

  &__content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
}

.form-button {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  width: 100%;
  &__button {
    width: 96px;
  }
}
</style>
