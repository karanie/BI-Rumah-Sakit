<template>
  <Card class="card">
    <template #title>Total Pasien</template>
    <template #subtitle>Jumlah pasien dari tahun 2016-2021.</template>
    <template #content>
      <b>{{ new Intl.NumberFormat().format(jumlah_pasien) }}</b>
    </template>
  </Card>

  <Card class="card">
    <template #title>Perkembangan Jumlah Pasien Setiap Tahun</template>
    <template #subtitle>Jumlah pasien baru setiap tahun, hal ini berdasarkan waktu registrasi pertama.</template>
    <template #content>
      <Chart type="bar" :data="BarChartData" />
    </template>
  </Card>


  <Card>
    <template #title>Distribusi Pasien by Kelompok Usia</template>

    <template #content>
      <Chart type="polarArea" :options="{
        responsive: true,
        scales: {
          r: {
            pointLabels: {
              display: true,
              centerPointLabels: true,
              font: {
                size: 18
              }
            }
          }}}" :data="kelompokUsiaChartData" />
    </template>
  </Card>

  <Card>

    <template #title>Distribusi Kelompok Usia Pasien Setiap Tahun</template>
    <template #subtitle>sepertinya lebih cocok untuk kunjungan ???</template>
    <template #content>
      <Chart type="line" :data="lineChartData" />
    </template>
  </Card>
</template>

<script setup>
import Chart from 'primevue/chart';
import axios from 'axios';

definePageMeta({
  layout: "data",
});

const kelompokUsiaChartData = ref();
const lineChartData = ref();
const BarChartData = ref();
const jumlah_pasien = ref();

onMounted(async () => {
  try {
    const data = (await axios.get("http://localhost:5000/api/usia")).data

    // Proses data API untuk digunakan dalam pembuatan Pie Chart
    kelompokUsiaChartData.value = processChartData(data);
    lineChartData.value = setLineChartData(data)
    jumlah_pasien.value = data.jumlah_pasien
    BarChartData.value = setBarChartData(data)
    // console.log("hasil : ",data.jumlah_pasien)
  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
});

const capitalizeEachLetter = (string) => {
  return string.replace(/\b\w/g, match => match.toUpperCase());
};

// const capitalizeFirstLetter = (string) => {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// };

const setBarChartData = (apiData) => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: Object.keys(apiData.jumlah_pasien_tahunan),
    datasets: [
      {
        label: "Jumlah Pasien",
        data: Object.values(apiData.jumlah_pasien_tahunan),
      },
    ],
  };
}

const processChartData = (apiData) => {
  const documentStyle = getComputedStyle(document.body);
  // console.log('hasil', Object.keys(apiData));

  // Tentukan urutan yang diinginkan untuk label
  const desiredOrder = ["bayi & balita", "anak-anak", "remaja", "dewasa", "lansia"];

  // Buat array labels sesuai dengan urutan yang diinginkan
  // const labels = desiredOrder.filter(category => apiData.kategori.hasOwnProperty(category)).map(category => capitalizeEachLetter(category));

  const labels = desiredOrder.map(category => capitalizeEachLetter(category));
const values = desiredOrder.map(category => apiData.kategori[category]);

  return {
    labels: labels,
    datasets: [
      {
        // data: Object.values(apiData.kategori),
        data : values,
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
        tooltip: {
          callbacks: {
            label: tooltipLabelCallback,
          }
        }
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
      label: capitalizeEachLetter(kategori),
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
// .card-container {
//   display: flex;
//   justify-content: space-between;  /* Untuk memberi ruang antara dua card */
// }</style>
