<template>
  <div class="grid">

    <BIChart src="/api/dashboard" timeseries type="bar" :setChartData="setKunjunganBarChartData">
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

    <BIChart src="/api/poliklinik" :chartOpt="{ indexAxis: 'y' }" :setChartData="setPoliklinikChartData" type="bar">
      <template #title>10 Poliklinik Terfavorit untuk Pasien Rawat Jalan</template>
    </BIChart>

    <BIChart src="/api/gejala" :chartOpt="{ indexAxis: 'y' }" :setChartData="setPenyakitData" type="bar">
      <template #title>10 Penyakit Terbanyak</template>
    </BIChart>

    <BIChart src="/api/kunjungan" timeseries type="line" :setChartData="setPendapatanName">
      <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Registrasi</template>
    </BIChart>

    <BIChart src="/api/jenis_registrasi" timeseries type="line" :setChartData="setPendapatanName">
      <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Registrasi</template>
    </BIChart>

    <BIChart src="/api/rujukan" timeseries type="line" :setChartData="setPendapatanName">
      <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Rujukan</template>
    </BIChart>
  </div>
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


const setKunjunganBarChartData = (apiData) => {
  const documentStyle = getComputedStyle(document.body);
  const dataValues = Object.values(apiData.jumlahKunjunganTahunan);

  // Mencari index dari nilai tertinggi
  const maxIndex = dataValues.indexOf(Math.max(...dataValues));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  return {
    labels: Object.keys(apiData.jumlahKunjunganTahunan),
    datasets: [
      {
        label: "Jumlah Kunjungan",
        data: dataValues,
        backgroundColor: backgroundColors
      },
    ],
  };
}

const kelompokUsiaChartData = ref();
const lineChartData = ref();
const BarChartData = ref();
const jumlah_pasien = ref();
const penyakitChartData = ref();
const poliklinikChartData = ref();

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
  const maxIndex = data.valuesPoliklinik.indexOf(Math.max(...data.valuesPoliklinik));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(data.valuesPoliklinik.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  // Proses data untuk format grafik batang
  return {
    labels: data.indexPoliklinik,
    datasets: [
      {
        label: 'Jumlah',
        data: data.valuesPoliklinik,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
}


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
//   return string.charAt(0).toUpperCase() + string.slice(1);5/ };

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
        data: values,
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

watch(lastFilter, async () => {
  const response = await axios.get('http://localhost:5000/api/gejala', {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  });
  const data = response.data;

  const limitedData = {
    index: data.index.slice(0, 10),
    values: data.values.slice(0, 10),

  };

  // Misalkan limitedData.values berisi nilai-nilai data Anda
  const dataValues = limitedData.values;

  // Mencari index dari nilai tertinggi
  const maxIndex = dataValues.indexOf(Math.max(...dataValues));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  // Proses data untuk format grafik batang
  penyakitChartData.value = {
    labels: limitedData.index,
    datasets: [
      {
        label: 'Jumlah',
        data: dataValues,
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
