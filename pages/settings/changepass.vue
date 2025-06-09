<template>
  <div class="form">
    <div class="form__message">
      Silahkan login dengan username dan password anda.
    </div>
    <form @submit.prevent="changePassword" class="form__content">
      <FloatLabel>
        <Password @change="handleInput" id="oldPassword" v-model="oldPassword" :feedback="false" :invalid="wrongPassword" toggleMask />
        <label for="password">Password Sekarang</label>
      </FloatLabel>
      <FloatLabel>
        <Password id="newPassword" v-model="newPassword" :feedback="false" toggleMask />
        <label for="password">Password Baru</label>
      </FloatLabel>
      <span class="wrong-username-password-feedback" v-if="wrongPassword">Password salah</span>
      <div class="form-button">
        <Button :disabled="!(oldPassword && newPassword)" type="submit" class="form-button__button" label="Ganti Password" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "loginregis",
});

const { user } = useUserSession();
const oldPassword = ref();
const newPassword = ref();
const wrongPassword = ref(false);

const { execute } = await useFetch('/api/auth/changepass', {
  method: "POST",
  body: {
    username: user.value?.username,
    oldPassword: oldPassword,
    newPassword: newPassword,
  },
  server: false,
  lazy: true,
  immediate: false,
  watch: false,
  onResponse(foobar) {
    if (foobar.response.status >= 400)
      return;
    navigateTo("/settings");
  },
  onResponseError(foobar) {
    wrongPassword.value = true;
  }
})

async function changePassword() {
  execute();
}

function handleInput() {
  wrongPassword.value = false;
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
}

.wrong-username-password-feedback {
  color: var(--red-500);
}
</style>
