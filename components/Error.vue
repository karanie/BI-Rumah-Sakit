<template>
  <div class="error">
    <div class="error__head">
      <template v-if="slots.icon" />
      <Icon v-else name="material-symbols:error-outline" size="40px" />
      <span class="error__head__title">{{ props.title || "Terjadi kesalahan" }}</span>
    </div>
    <div class="error__details" v-if="slots.details">
      <slot name="details" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string,
}>();

const slots = useSlots();
</script>

<style scoped lang="scss">
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
  height: 100%;
  padding: 1rem;

  &__head {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    &__title {
      font-size: 1.2rem;
    }
  }

  &__details {
    width: 80%;
    max-width: 52em;
  }
}
</style>
