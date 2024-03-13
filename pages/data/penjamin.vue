<template>
  <Card>
    <template #title>Distribusi Jenis Penjamin</template>
    <template #content>
      <div style="width: 100%; display: flex; justify-content: center;">
        <Chart type="doughnut" :options="{ showAllTooltips: true }" :data="barChartData" />
      </div>
    </template>
  </Card>

  <Card>
    <template #title>10 Instansi Terfavorit</template>
    <template #content>
      <Chart type="bar" :options="{indexAxis: 'y'}" :data="instansiChartData" />
    </template>
  </Card>
</template>

<script setup>
import axios from 'axios';
import Chart from 'primevue/chart';

definePageMeta({
  layout: "data",
});

const {
  bulan,
  tahun,
  kabupaten,
  lastFilter,
} = storeToRefs(useDataFilter())

const barChartData = ref(null);
const instansiChartData = ref(null);

onMounted(async () => {
  const response = await axios.get('http://localhost:5000/api/penjamin', {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  });
  const data = response.data;

  // Proses data untuk format grafik batang
  barChartData.value = {
    labels: data.index,
    datasets: [
      {
        label: 'Jumlah',
        data: data.values,
        borderWidth: 1 // Lebar garis batas
      }
    ]
  };
});

onMounted(async () => {
  const response = await axios.get('http://localhost:5000/api/instansi', {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  });
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
        borderWidth: 1 // Lebar garis batas
      }
    ]
  };
});

watch(lastFilter, async () => {
  const response = await axios.get('http://localhost:5000/api/penjamin', {
    params: {
      tahun: tahun.value,
    }
  });
  const data = response.data;

  // Proses data untuk format grafik batang
  barChartData.value = {
    labels: data.index,
    datasets: [
      {
        label: 'Jumlah',
        data: data.values,
        borderWidth: 1 // Lebar garis batas
      }
    ]
  };
})

watch(lastFilter, async () => {
  const response = await axios.get('http://localhost:5000/api/instansi', {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  });
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
        borderWidth: 1 // Lebar garis batas
      }
    ]
  };
})
</script>
