<template>
  <div class="form">
    <div class="form__message">
      Silahkan login dengan username dan password anda.
    </div>
    <form @submit.prevent="login" class="form__content">
      <FloatLabel>
        <InputText @change="handleInput" id="username" v-model="username" :invalid="wrongUsernameOrPassword" />
        <label for="username">Username</label>
      </FloatLabel>
      <FloatLabel>
        <Password @change="handleInput" id="password" v-model="password" :feedback="false" :invalid="wrongUsernameOrPassword" />
        <label for="password">Password</label>
      </FloatLabel>
      <span class="wrong-username-password-feedback" v-if="wrongUsernameOrPassword">Username atau password salah</span>
      <div class="form-button">
        <Button :disabled="!(username && password)" type="submit" class="form-button__button" label="Login" />
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
const wrongUsernameOrPassword = ref(false);

async function login() {
  try {
    await signIn({
      username: username.value,
      password: password.value,
    }, {
      callbackUrl: "/",
    });
  } catch (err) {
    console.log(err);
    wrongUsernameOrPassword.value = true;
  }
}

function handleInput() {
  wrongUsernameOrPassword.value = false;
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

.wrong-username-password-feedback {
  color: var(--red-500);
}
</style>
