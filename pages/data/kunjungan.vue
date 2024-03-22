<template>
  <div class="grid">
    <div class="item-1">
      <Card class="card">
        <template #title>Total Kunjungan</template>
        <template #subtitle>Jumlah Kunjungan dari tahun 2016-2021.</template>
        <template #content>
          <b>{{ new Intl.NumberFormat().format(jumlahKunjungan) }}</b>
        </template>
      </Card>
    </div>

    <div class="item-2">
      <Card class="card">
        <template #title>Perkembangan Jumlah Pasien Setiap Tahun</template>
        <template #subtitle>Jumlah pasien baru setiap tahun, hal ini berdasarkan waktu registrasi
          pertama.</template>
        <template #content>
          <Chart type="bar" :data="kunjunganBarChartData" />
        </template>
      </Card>

      <Card>
        <template #title>10 Penyakit Terbanyak</template>
        <template #content>
          <Chart type="bar" :options="{ indexAxis: 'y' }" :data="penyakitChartData" />
        </template>
      </Card>

      <Card>
    <template #title>Pertumbuhan Kunjungan</template>
    <template #content>
      <skeleton height="8rem" v-if="kunjunganDataIsPending"></skeleton>
      <Chart type="line" :data="kunjungangrowthdata" v-if="!kunjunganDataIsPending"/>
    </template>
  </Card>

  <Card>
    <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Registrasi</template>
    <template #content>
    <skeleton height="8rem" v-if="jenisRegisDataIsPending"></skeleton>
      <Chart type="line" :data="jenisregisgrowthdata" v-if="!jenisRegisDataIsPending" />
    </template>
  </Card>

  <Card>
    <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Rujukan</template>
    <template #content>
    <skeleton height="8rem" v-if="RujukanDataIsPending"></skeleton>
      <Chart type="line" :data="rujukangrowthdata" v-if="!RujukanDataIsPending" />
    </template>
  </Card>

    </div>



    <div class="item-3">


    </div>

    <div class="item-4">


    </div>
  </div>
</template>

<script setup>
import Chart from 'primevue/chart';
import axios from 'axios';

definePageMeta({
  layout: "data",
});

const jumlahKunjungan = ref();

const kunjunganBarChartData = ref();

const getJumlahKunjungan = computed(() => new Intl.NumberFormat().format(jumlahKunjungan.value));

const kunjungangrowthdata = ref()
const jenisregisgrowthdata = ref()
const rujukangrowthdata = ref()
const {
  bulan,
  tahun,
  kabupaten,
  lastFilter,
} = storeToRefs(useDataFilter());

// Data Pertumbuhan Kunjungan
const {
  data: kunjunganData,
  pending: kunjunganDataIsPending,
  refresh: kunjunganDataRefresh,
} = await useFetch("http://localhost:5000/api/kunjungan", {
  server: false,
  lazy: true,
  params: {
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  watch: false
})

// Data Pertumbuhan Kunjungan Berdasarkan Jenis Regis
const {
  data: jenisRegisData,
  pending: jenisRegisDataIsPending,
  refresh: jenisRegisDataRefresh,
} = await useFetch("http://localhost:5000/api/jenis_registrasi", {
  server: false,
  lazy: true,
  params: {
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  watch: false
})

//  Data Pertumbuhan Kunjungan Berdasarkan Rujukan
const {
  data: RujukanData,
  pending: RujukanDataIsPending,
  refresh: RujukanDataRefresh,
} = await useFetch("http://localhost:5000/api/rujukan", {
  server: false,
  lazy: true,
  params: {
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  watch: false
})

watch(kunjunganData, () => {
  if (!kunjunganData.value) {
    return;
  }
  kunjungangrowthdata.value = {
    labels: kunjunganData.value.index,
    datasets: kunjunganData.value.columns.map((val, i) => {
      return {
        label: val,
        data: kunjunganData.value.values[i]
      }
    })
  };
});

watch(jenisRegisData, () => {
  if (!jenisRegisData.value) {
    return;
  }
  jenisregisgrowthdata.value = {
    labels: jenisRegisData.value.index,
    datasets: jenisRegisData.value.columns.map((val, i) => {
      return {
        label: val,
        data: jenisRegisData.value.values[i]
      }
    })
  };
});

watch(RujukanData, () => {
  if (!RujukanData.value) {
    return;
  }
  rujukangrowthdata.value = {
    labels: RujukanData.value.index,
    datasets: RujukanData.value.columns.map((val, i) => {
      return {
        label: val,
        data: RujukanData.value.values[i]
      }
    })
  };
});

watch(lastFilter, () => {
  jenisRegisDataRefresh();
  kunjunganDataRefresh();
  RujukanDataRefresh();
});

onMounted(async () => {
  const data = (await axios.get("http://localhost:5000/api/dashboard", {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  })).data
  jumlahKunjungan.value = data.jumlahKunjungan;
  kunjunganBarChartData.value = setKunjunganBarChartData(data)
});

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

onMounted(async () => {
  const data = (await axios.get("http://localhost:5000/api/jeniskelamin", {
    params: {
      kabupaten: kabupaten.value,
      tahun: tahun.value,
      bulan: bulan.value
    }
  })).data
  maleCount.value = data.values[0];
  femaleCount.value = data.values[1];
});

onMounted(async () => {
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
    values: data.values.slice(0, 10)
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
});

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

</script>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  gap: 20px;
}

.item-1 {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.item-2 {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

.item-3 {
  grid-column: 2 / 3;
  grid-row: 2/3;
}

.item-4 {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}

.perseberangender {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;

  &__card {
    width: 100%;
  }

  &__female {
    color: var(--pink-400);
    margin: 40px;
    font-size: larger;
  }

  &__value {
    display: flex;
    background-color: red;
  }
}

.percentage_value {
  display: flex;
  flex-direction: column;

  &__count {
    font-size: larger;

    &--male {
      color: var(--blue-400);
    }

    &--female {
      color: var(--red-400);
    }
  }

  &__percent {
    color: var(--cyan-700);
    font-size: larger;
    background-color: var(--teal-100);
    border-radius: var(--border-radius);
    flex: 0;
  }
}
</style>
