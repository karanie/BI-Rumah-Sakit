<template>
  <div class="error-details">
    <div class="error-details__desc">
      <slot />
    </div>
    <Fieldset v-if="slots.details" class="error-details__details" legend="Details" toggleable collapsed>
      <slot name="details" />
    </Fieldset>
    <Button class="error-details__refresh" v-if="props.refreshButton" label="Coba Lagi" @click="e => emit('refresh', e)" />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["refresh"]);

const props = defineProps<{
  refreshButton?: boolean,
}>();

const slots = useSlots();
</script>

<style scoped lang="scss">
.error-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  &__details {
    width: 100%;
  }

  &__refresh {
    align-self: end;
  }
}
</style>
