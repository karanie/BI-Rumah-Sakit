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

<script setup>
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

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const processChartData = (apiData) => {
  const documentStyle = getComputedStyle(document.body);
  // console.log('hasil', Object.keys(apiData));

  // Tentukan urutan yang diinginkan untuk label
  const desiredOrder = ["bayi & balita", "anak-anak", "remaja", "dewasa", "lansia"];

  // Buat array labels sesuai dengan urutan yang diinginkan
  const labels = desiredOrder.filter(category => apiData.kategori.hasOwnProperty(category)).map(category => capitalizeFirstLetter(category));

  return {
    labels: labels,
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

const setLineChartData = (apiData) => {
  const documentStyle = getComputedStyle(document.documentElement);

  const labels = Object.keys(apiData.bytahun);
  const datasets = [];

  const desiredOrder = ["bayi & balita", "anak-anak", "remaja", "dewasa", "lansia"];

  const categoryColors = {
    "bayi & balita": '--cyan-500',
    "anak-anak": '--orange-500',
    "remaja": '--gray-500',
    "dewasa": '--indigo-500',
    "lansia": '--teal-500',
  };

  // Loop melalui setiap kategori
  for (const kategori of desiredOrder) {
    const data = labels.map((tahun) => apiData.bytahun[tahun][kategori]);

    datasets.push({
      label: capitalizeFirstLetter(kategori),
      data,
      fill: false,
      borderColor: documentStyle.getPropertyValue(categoryColors[kategori]),
      backgroundColor: documentStyle.getPropertyValue(categoryColors[kategori]),
      tension: 0.4,
    });
  }

  return {
    labels,
    datasets,
  };
};

</script>

<style scoped lang="scss">
/* Styling sesuai kebutuhan */
</style>
