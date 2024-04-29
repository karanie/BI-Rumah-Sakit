<template>
  <BIChart src="/api/kunjungan" tipeData="pertumbuhanPertahun" timeseries type="line" >
    <template #title>Pertumbuhan Kunjungan Per tahun</template>
  </BIChart>

  <BIChart src="/api/kunjungan" tipeData="pertumbuhanPertahun" timeseries type="bar" >
    <template #title>Pertumbuhan Kunjungan </template>
  </BIChart>

  <Card>
    <template #title>Distribusi Jenis Penjamin</template>
    <template #content>
      <div style="width: 100%; display: flex; justify-content: center;">
        <Chart type="doughnut" :data="penjaminBarChartData" />
      </div>
    </template>
  </Card>

  <BIChart src="/api/kunjungan" tipeData="poliklinik" :chartOpt="{ indexAxis: 'y' }" type="bar" :setChartData="setPoliklinikChartData">
    <template #title>10 Poliklinik Terfavorit untuk Pasien Rawat Jalan</template>
  </BIChart>

  <BIChart src="/api/kunjungan" tipeData="gejala" :chartOpt="{ indexAxis: 'y' }" :setChartData="setPenyakitData" type="bar">
    <template #title>10 Penyakit Terbanyak</template>
  </BIChart>

  <BIChart src="/api/kunjungan" tipeData="jenis_registrasi" timeseries type="line" :setChartData="setPendapatanName">
    <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Registrasi</template>
  </BIChart>

  <BIChart src="/api/kunjungan" tipeData="rujukan" timeseries type="line" :setChartData="setPendapatanName">
    <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Rujukan</template>
  </BIChart>
</template>

<script setup>
import Chart from 'primevue/chart';
import axios from 'axios';

definePageMeta({
  layout: "data",
});

const {
  bulan,
  tahun,
  kabupaten,
  lastFilter,
} = storeToRefs(useDataFilter());

function setPenyakitData(data) {
  console.log(data.index)
  // Mencari index dari nilai tertinggi
  const maxIndex = data.values.indexOf(Math.max(...data.values));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(data.values.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  // Proses data untuk format grafik batang
  return {
    labels: data.index,
    datasets: [
      {
        label: 'Jumlah',
        data: data.values,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
}

function setPoliklinikChartData(data) {
  // Mencari index dari nilai tertinggi
  const maxIndex = data.values.indexOf(Math.max(...data.values));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(data.values.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  // Proses data untuk format grafik batang
  return {
    labels: data.index,
    datasets: [
      {
        label: 'Jumlah',
        data: data.values,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
}

const penjaminBarChartData = ref(null);
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
  penjaminBarChartData.value = {
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
    index: data.index.slice(0, 5),
    values: data.values.slice(0, 5)
  };

  const dataValues = limitedData.values;

  // Mencari index dari nilai tertinggi
  const maxIndex = dataValues.indexOf(Math.max(...dataValues));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  // Proses data untuk format grafik batang
  instansiChartData.value = {
    labels: limitedData.index,
    datasets: [
      {
        label: 'Jumlah',
        data: limitedData.values,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
});

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
    index: data.index.slice(0, 5),
    values: data.values.slice(0, 5)
  };

  const dataValues = limitedData.values;

  // Mencari index dari nilai tertinggi
  const maxIndex = dataValues.indexOf(Math.max(...dataValues));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  // Proses data untuk format grafik batang
  instansiChartData.value = {
    labels: limitedData.index,
    datasets: [
      {
        label: 'Jumlah',
        data: limitedData.values,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
})


</script>

<style scoped lang="scss">

.item-2 {
  gap: 8px;
  width: 100%;
}

.item-3 {
  grid-column: 2 / 3;
  grid-row: 2/3;
}

.item-4 {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
</style>
