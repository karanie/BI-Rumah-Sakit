<template>
  <div class="form">
    <div class="form__message">
      Silahkan login dengan username dan password anda.
    </div>
    <form @submit.prevent="login" class="form__content">
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
        <Button type="submit" class="form-button__button" label="Login" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "loginregis",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/'
  },
});

const { signIn } = useAuth();
const username = ref();
const password = ref();

async function login() {
  await signIn({
    username: username.value,
    password: password.value,
  }, {
    callbackUrl: "/",
  });
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
