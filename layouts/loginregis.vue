<template>
  <div class="loginregis-layout">
    <Card class="loginregis-layout__card">
      <template #title>{{ pageName }}</template>
      <template #content>
        <slot />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const pageName = computed(() => route.name == "login" ? "Login" : "Register");
</script>

<style scoped lang="scss">
.loginregis-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: repeating-radial-gradient( circle at 0 0, transparent 0, var(--surface-50) 12px ), repeating-linear-gradient( var(--surface-200), var(--surface-100) );
  height: 100vh;
  width: 100%;

  &__card {
    width: 100%;
    max-width: 600px;
  }
}
</style>
