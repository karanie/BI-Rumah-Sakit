<template>
  <div class="peningkatan-penurunan">
    <Card>
      <template #title>Peningkatan</template>
      <template #content>
        <b class="peningkatan-penurunan__peningkatan">+80 Item</b>
      </template>
    </Card>

    <Card>
      <template #title>Penurunan</template>
      <template #content>
        <b class="peningkatan-penurunan__penurunan">-15 Item</b>
      </template>
    </Card>
  </div>


  <Card>
    <template #title>Bar Chart</template>
    <template #content>
      <Chart type="bubble" :data="barChartData" :options="{
        scales: {
          x: {
            display: false // Menyembunyikan sumbu x
          },
          y: {
            display: false // Menyembunyikan sumbu y
          }
        }
      }" />
    </template>
  </Card>

  <Card>
    <template #title>Pie Chart</template>
    <template #content>
      <Chart type="doughnut" :data="pieChartData" />
    </template>
  </Card>

  <Card>
    <template #title>Line Chart</template>
    <template #content>
      <Chart type="line" :data="lineChartData" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart';

definePageMeta({
  layout: "data",
});

const barChartData = ref()
const pieChartData = ref()
const lineChartData = ref()

onMounted(() => {
  barChartData.value = setBarChartData();
  pieChartData.value = setPieChartData();
  lineChartData.value = setLineChartData();
})

const setBarChartData = () => {
  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  return {
    labels: data.map(row => row.year),
    datasets: [
      {
        label: 'foobar',
        data: data.map(row => ({
          x: row.year,
          y: row.count,
          r: row.count * 2 // Menetapkan radius dengan mengalikan jumlah data dengan faktor tertentu untuk visualisasi yang lebih baik
        }))
      }
    ]
  }
}

const setPieChartData = () => {
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

const setLineChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: documentStyle.getPropertyValue('--cyan-500'),
        tension: 0.4
      },
      {
        label: 'Second Dataset',
        data: [28, 48, 40, 19, 86, 27, 90],
        fill: false,
        borderColor: documentStyle.getPropertyValue('--gray-500'),
        tension: 0.4
      }
    ]
  };
}
</script>

<style scoped lang="scss">
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
