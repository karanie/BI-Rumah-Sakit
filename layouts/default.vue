<template>
  <div class="default-layout">
    <div class="default-layout__header">
      <div class="default-layout__header__content">
        <div class="default-layout__header__content__leading">
          <span>BI Rumah Sakit</span>
        </div>
        <div class="default-layout__header__content__trailing">
          <NuxtLink to="/">
            <Button label="Home" outlined />
          </NuxtLink>
          <NuxtLink to="/data">
            <Button label="Data" outlined />
          </NuxtLink>
          <NuxtLink to="/about">
            <Button label="About" outlined />
          </NuxtLink>
          <Button text>
            <template #icon><Icon name="material-symbols:login"/></template>
          </Button>
        </div>
      </div>
    </div>
    <div class="default-layout__content">
      <div class="default-layout__content__main">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.default-layout {
  display: flex;
  height: 100vh;
  height: 100dvh;
  flex-direction: column;

  &__content {
    display: flex;
    height: 100%;
    width: 100%;
    overflow: auto;
    justify-content: center;

    &__main {
      width: 100%;
      max-width: 800px;
    }
  }

  &__header {
    position: sticky;
    display: flex;
    width: 100%;
    border-bottom: 1px solid #a0a0a050;
    align-items: center;
    justify-content: center;
    padding: 4px;
    backdrop-filter: blur(8px);

    &__content {
      display: flex;
      width: 100%;
      height: 100%;
      max-width: 800px;
      align-items: center;
      justify-content: space-between;

      &__leading {
        display: flex;
        height: 100%;
        gap: 8px;
        align-items: center;
        align-self: start;
      }

      &__trailing {
        display: flex;
        height: 100%;
        gap: 8px;
        align-items: center;
        align-self: end;
      }
    }
  }
}
</style>