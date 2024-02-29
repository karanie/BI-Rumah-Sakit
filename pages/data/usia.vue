<template>
  <BiBase>
    <Message :closable="false">Data terakhir di-update pada <b>{{ lastUpdate }}</b></Message>

    <Card>
      <template #title>Distribusi Pasien by Kelompok Usia</template>
      <template #content>
        <Chart type="doughnut" :data="demografiChartData" />
      </template>
    </Card>

    <Card>
    <template #title>Line Chart</template>
    <template #content>
      <Chart type="line" :data="lineChartData" />
    </template>
    </Card>

  </BiBase>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart';
import axios from 'axios';

const demografiChartData = ref();
const lastUpdate = ref('');
const lineChartData = ref()

onMounted(async () => {
  try {
    const data = (await axios.get("http://localhost:5000/api/usia")).data

    // Proses data API untuk digunakan dalam pembuatan Pie Chart
    demografiChartData.value = processChartData(data);
    lineChartData.value = setLineChartData(data)

    // Set waktu terakhir data di-update (gantilah dengan data timestamp yang sesuai)
    lastUpdate.value = '20xx/xx/xx';
  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
});

const processChartData = (apiData: Record<string, number>) => {
  const documentStyle = getComputedStyle(document.body);
  // console.log('hasil', Object.keys(apiData));

  return {
    labels: Object.keys(apiData.kategori),
    datasets: [
      {
        data: Object.values(apiData.kategori),
        backgroundColor: [
          documentStyle.getPropertyValue('--cyan-500'),
          documentStyle.getPropertyValue('--orange-500'),
          documentStyle.getPropertyValue('--gray-500'),
          documentStyle.getPropertyValue('--indigo-500'),
          documentStyle.getPropertyValue('--teal-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--cyan-400'),
          documentStyle.getPropertyValue('--orange-400'),
          documentStyle.getPropertyValue('--gray-400'),
        ],
      },
    ],
  };
};

const setLineChartData = (apiData: Record<string, number>) => {
  const documentStyle = getComputedStyle(document.documentElement);
  
  const labels = Object.keys(apiData.bytahun);
  const datasets = [];

  // Loop melalui setiap kategori
  const kategori = Object.keys(apiData.bytahun[labels[0]]);
  kategori.forEach((kategori) => {
    const data = labels.map((tahun) => apiData.bytahun[tahun][kategori]);

    datasets.push({
      label: kategori,
      data,
      fill: false,
      borderColor: documentStyle.getPropertyValue(`--${kategori.toLowerCase()}-500`),
      tension: 0.4,
    });
  });

  return {
    labels,
    datasets,
  };
};

</script>

<style scoped lang="scss">
/* Styling sesuai kebutuhan */
</style>
