<template>
  <BiBase>
    <div class="no-data">
      <div class="no-data__message">
        <span style="font-size: 72px; color: var(--text-color);"><Icon name="material-symbols:bar-chart" /></span>
        <span style="font-size: 24px;">Mohon pilih data</span>
      </div>
    </div>
  </BiBase>
</template>

<style scoped lang="scss">
.no-data {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;

  &__message {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}
</style>
