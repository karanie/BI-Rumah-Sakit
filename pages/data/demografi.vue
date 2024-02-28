<template>
  <BiBase>
    <Message :closable="false">Data terkahir di-update pada <b>20xx/xx/xx</b></Message>

    <Card>
    <template #title>Pie Chart</template>
    <template #content>
      <Chart type="doughnut" :data="demografiChartData" />
    </template>
    </Card>
  </BiBase>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart';

const demografiChartData = ref()

onMounted(() => {
  demografiChartData.value = setDemografiChartData();
})

const setDemografiChartData = () => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: ['A', 'B', 'C'],
    datasets: [
      {
        data: [540, 325, 702],
        backgroundColor: [documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--gray-500')],
        hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--gray-400')]
      }
    ]
  };
}
</script>

<style scoped lang="scss">
.bi {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 16px;
  padding: 8px;
  flex-direction: row;

  &__sidemenu {
    position: sticky;
    top: 0;
    max-width: 256px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
}

.peningkatan-penurunan {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;

  &__peningkatan {
    color: var(--primary-color);
  }

  &__peningkatan {
    color: var(--red-400);
  }
}
</style>
