<template>
  <Card>
    <template #title>Distribusi Jenis Penjamin</template>
    <template #content>
      <Chart type="bar" :data="barChartData" />
    </template>
  </Card>

  <Card>
    <template #title>10 Instansi Terfavorit</template>
    <template #content>
      <Chart type="bar" :data="instansiChartData" />
    </template>
  </Card>
</template>

<script setup>
import axios from 'axios';
import Chart from 'primevue/chart';

definePageMeta({
  layout: "data",
});

const barChartData = ref(null);
const instansiChartData = ref(null);

onMounted(async () => {
  const response = await axios.get('http://localhost:5000/api/penjamin');
  const data = response.data;

  // Proses data untuk format grafik batang
  barChartData.value = {
    labels: data.index,
    datasets: [
      {
        label: 'Jumlah',
        data: data.values,
        backgroundColor: '#007bff', // Warna latar belakang batang
        borderColor: '#007bff', // Warna garis batas batang
        borderWidth: 1 // Lebar garis batas
      }
    ]
  };
});

onMounted(async () => {
  const response = await axios.get('http://localhost:5000/api/instansi');
  const data = response.data;

  const limitedData = {
    index: data.index.slice(0, 10),
    values: data.values.slice(0, 10)
  };

  // Proses data untuk format grafik batang
  instansiChartData.value = {
    labels: limitedData.index,
    datasets: [
      {
        label: 'Jumlah',
        data: limitedData.values,
        backgroundColor: '#007bff', // Warna latar belakang batang
        borderColor: '#007bff', // Warna garis batas batang
        borderWidth: 1 // Lebar garis batas
      }
    ]
  };
});
</script>
