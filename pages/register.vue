<template>
  <div class="form">
    <div class="form__message">
      Silahkan register dengan username dan password anda. Laman ini
      dipergunakan untuk development saja.
    </div>
    <div class="form__content">
      <FloatLabel>
        <InputText id="username" v-model="username" />
        <label for="username">Username</label>
      </FloatLabel>
      <FloatLabel>
        <InputText id="nama_lengkap" v-model="nama_lengkap" />
        <label for="username">Nama Lengkap</label>
      </FloatLabel>
      <FloatLabel>
        <InputText id="nama_lengkap" v-model="jabatan" />
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
        <Button class="form-button__button" label="Register" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "loginregis",
});

const username = ref();
const nama_lengkap = ref();
const password = ref();
const jabatan = ref();
const role = ref();
const roles = ref([
  { name: "Admin", value: "admin"},
  { name: "Non-admin", value: "non_admin"},
]);
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
