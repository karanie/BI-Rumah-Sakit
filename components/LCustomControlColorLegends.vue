<template>
  <LCustomControl>
    <div class="legends">
      <div class="legends__item" v-for="(item, index) in props.legends" :key="index">
        <div class="legends__item__color" :style="{ 'background': item.color }" />
          <div class="legends__item__label">
            {{ item.label }}
          </div>
      </div>
    </div>
  </LCustomControl>
</template>

<script setup lang="ts">
type LCustomControlLegend = {
  color: string;
  label: string;
};

const props = defineProps<{
  legends: LCustomControlLegend[],
}>();
</script>

<style scoped lang="scss">
.legends {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;

    &__color {
      height: 1rem;
      width: 1.2rem;
      opacity: 0.75;
    }
  }
}
</style>
