<template>
  <div class="form">
    <div class="form__message">
      Silahkan login dengan username dan password anda.
    </div>
    <div class="form__content">
      <FloatLabel>
        <InputText id="username" v-model="username" />
        <label for="username">Username</label>
      </FloatLabel>
      <FloatLabel>
        <Password id="password" v-model="password" :feedback="false" />
        <label for="password">Password</label>
      </FloatLabel>
      <div class="form-button">
        <NuxtLink to="/register">
          <Button class="form-button__button" label="Register" outlined />
        </NuxtLink>
        <Button class="form-button__button" label="Login" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "loginregis",
});

const username = ref();
const password = ref();
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
