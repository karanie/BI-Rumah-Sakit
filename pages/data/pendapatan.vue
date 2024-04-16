<template>
  <div class="item-1">
    <Card class="card">
      <template #title>Total Pendapatan</template>
      <template #subtitle>Jumlah total tagihan dari tahun 2020-2024.</template>
      <template #content>
        <b class="big-number" style="color: rgb(50,205,50);">Rp{{ getJumlahPendapatan }}</b>
      </template>
    </Card>
    <Card class="card">
      <template #title>Total Pengeluaran</template>
      <template #subtitle>Jumlah modal HPP dari tahun 2020-2024.</template>
      <template #content>
        <b class="big-number" style="color: rgb(255, 75, 70);">Rp{{ getJumlahPengeluaran }}</b>
      </template>
    </Card>
  </div>

  <BIChart src="/api/pendapatan" timeseries type="line" forecast :setChartData="setPendapatanName" :chartOpt="setPendapatanChartDataOpt()">
    <template #title>Jumlah Pendapatan Seiring Waktu</template>
  </BIChart>

  <BIChart src="/api/pendapatan" timeseries tipeData="jenisregis" type="line">
    <template #title>Jumlah Pendapatan Seiring Waktu Berdasarkan jenis_registrasi</template>
  </BIChart>


  <Card>
    <template #title>10 Pendapatan Tertinggi Berdasarkan Penyakit</template>
    <template #content>
      <Chart type="bar" :options="{ indexAxis: 'y' }" :data="penPenyakitChartData" />
    </template>
  </Card>
  <Card>
    <template #title>10 Pengeluaran Tertinggi Berdasarkan Penyakit</template>
    <template #content>
      <Chart type="bar" :options="{ indexAxis: 'y' }" :data="pengPenyakitChartData" />
    </template>
  </Card>

  <Card>
    <template #title>10 Pendapatan Tertinggi Berdasarkan Poliklinik</template>
    <template #content>
      <Chart type="bar" :options="{
          indexAxis: 'y', elements: {
            bar: {
              borderWidth: 2,
            }
          }, responsive: true,
          plugins: {
            legend: {
              position: 'right',
            }
          }
        }" :data="penPoliklinikChartData" />
    </template>
  </Card>
  <Card>
    <template #title>10 Pengeluaran Tertinggi Berdasarkan Poliklinik</template>
    <template #content>
      <Chart type="bar" :options="{
          indexAxis: 'y', elements: {
            bar: {
              borderWidth: 2,
            }
          }, responsive: true,
          plugins: {
            legend: {
              position: 'right',
            },
          }
        }" :data="pengPoliklinikChartData" />
    </template>
  </Card>
</template>

<script setup>
import Chart from 'primevue/chart';
import axios from 'axios';

const jenisRegisPendapatanData = ref();

const {
  bulan,
  tahun,
  kabupaten,
  lastFilter,
} = storeToRefs(useDataFilter());

definePageMeta({
  layout: "data"
})

const penPenyakitChartData = ref();
const pengPenyakitChartData = ref();

const penPoliklinikChartData = ref();
const pengPoliklinikChartData = ref();

const jumlahPendapatan = ref();
const jumlahPengeluaran = ref();
const getJumlahPendapatan = computed(() => new Intl.NumberFormat().format(jumlahPendapatan.value));
const getJumlahPengeluaran = computed(() => new Intl.NumberFormat().format(jumlahPengeluaran.value));

function setPendapatanName(data, forecastData) {
  const mapLabelName = {
    "total_tagihan": "Pengeluaran",
    "total_semua_hpp": "Pendapatan"
  }
  const out = {
    labels: data.index,
    datasets: data.columns.map((val, i) => {
      return {
        label: mapLabelName[val],
        data: data.values[i],
        pointStyle: false,
      }
    })
  }
  if (!forecastData) {
    return out;
  } else {
    console.log(forecastData);
    forecastData.forEach((el) => {
      out.datasets.push(
        {
          label: `${mapLabelName[el.columns[0]]} Forecast`,
          data: el.values[0].map((val, i) => {
            return { x: el.index[i], y: val }
          }),
          pointStyle: false,
        }
      );
    });
    return out;
  }
}

// Data Forecast Pertumbuhan Pendapatan
const {
  data: pendapatanData,
  pending: pendapatanDataPending,
  refresh: pendapatanDataRefresh,
} = await useFetch("http://localhost:5000/api/pendapatan", {
  server: false,
  lazy: true,
  params: {
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  watch: false
})

// Data Pertumbuhan Pendapatan berdasarkan jenis_regis
const {
  data: pendapatanJenisRegisData,
  pending: pendapatanJenisRegisDataIsPending,
  refresh: pendapatanJenisRegisDataRefresh,
} = await useFetch("http://localhost:5000/api/pendapatan", {
  server: false,
  lazy: true,
  params: {
    tipe_data: "jenisregis",
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  watch: false
})

watch(pendapatanJenisRegisData, () => {
  if (!pendapatanJenisRegisData.value) {
    return;
  }
  jenisRegisPendapatanData.value = {
    labels: pendapatanJenisRegisData.value.index,
    datasets: pendapatanJenisRegisData.value.columns.map((val, i) => {
      return {
        label: val,
        data: pendapatanJenisRegisData.value.values[i]
      }
    })
  };
});

watch(lastFilter, () => {
  pendapatanJenisRegisDataRefresh()
  pendapatanDataRefresh()
});

// Chart Options

const setPendapatanChartDataOpt = () => {
  return {
    plugins: {
      tooltip: {
        callbacks: {
          label: tooltipLabelCallbackCurrency({ style: 'currency', currency: 'IDR' }),
        }
      }
    }
  }
}

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
    index: data.index1.slice(0, 10),
    index2: data.index2.slice(0, 10),
    valuesIn: data.pendapatan.slice(0, 10),
    valuesOut: data.pengeluaran.slice(0, 10),

  };

  // Misalkan limitedData.values berisi nilai-nilai data Anda
  const dataValues = limitedData.valuesIn;

  // Mencari index dari nilai tertinggi
  const maxIndex = dataValues.indexOf(Math.max(...dataValues));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  // Proses data untuk format grafik batang

  penPenyakitChartData.value = {
    labels: limitedData.index,
    datasets: [
      {
        label: 'Jumlah',
        data: limitedData.valuesIn,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
  pengPenyakitChartData.value = {
    labels: limitedData.index2,
    datasets: [
      {
        label: 'Jumlah',
        data: limitedData.valuesOut,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
});

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
    index2: data.index2.slice(0, 10),
    valuesIn: data.pendapatan.slice(0, 10),
    valuesOut: data.pengeluaran.slice(0, 10),

  };

  // Misalkan limitedData.values berisi nilai-nilai data Anda
  const dataValues = limitedData.valuesIn;

  // Mencari index dari nilai tertinggi
  const maxIndex = dataValues.indexOf(Math.max(...dataValues));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  // Proses data untuk format grafik batang

  penPenyakitChartData.value = {
    labels: limitedData.index,
    datasets: [
      {
        label: 'Jumlah',
        data: limitedData.valuesIn,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
  pengPenyakitChartData.value = {
    labels: limitedData.index2,
    datasets: [
      {
        label: 'Jumlah',
        data: limitedData.valuesOut,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
})

onMounted(async () => {
  const response = await axios.get('http://localhost:5000/api/poliklinik', {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  });
  const data = response.data;

  const limitedData = {
    index: data.index.slice(0, 10),
    index2: data.index2.slice(0, 10),
    valuesIn: data.pendapatan.slice(0, 10),
    valuesOut: data.pengeluaran.slice(0, 10),
    valuesIn2: data.pendapatan2.slice(0, 10),
    valuesOut2: data.pengeluaran2.slice(0, 10),

  };

  // Proses data untuk format grafik batang

  penPoliklinikChartData.value = {
    labels: limitedData.index,
    datasets: [
      {
        label: 'Pendapatan',
        data: limitedData.valuesIn,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: 'rgba(95, 255, 132, 0.5)'
      },
      {
        label: 'Pengeluaran',
        data: limitedData.valuesOut,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: 'rgba(255, 10, 7, 0.5)'
      }
    ]
  };
  pengPoliklinikChartData.value = {
    labels: limitedData.index2,
    datasets: [
      {
        label: 'Pendapatan',
        data: limitedData.valuesIn2,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: 'rgba(95, 255, 132, 0.5)'
      },
      {
        label: 'Pengeluaran',
        data: limitedData.valuesOut2,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: 'rgba(255, 10, 7, 0.5)'
      }
    ]
  };
});

watch(lastFilter, async () => {
  const response = await axios.get('http://localhost:5000/api/poliklinik', {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  });
  const data = response.data;

  const limitedData = {
    index: data.index.slice(0, 10),
    index2: data.index2.slice(0, 10),
    valuesIn: data.pendapatan.slice(0, 10),
    valuesOut: data.pengeluaran.slice(0, 10),
    valuesIn2: data.pendapatan2.slice(0, 10),
    valuesOut2: data.pengeluaran2.slice(0, 10),

  };

  // Proses data untuk format grafik batang

  penPoliklinikChartData.value = {
    labels: limitedData.index,
    datasets: [
      {
        label: 'Pendapatan',
        data: limitedData.valuesIn,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: 'rgba(95, 255, 132, 0.5)'
      },
      {
        label: 'Pengeluaran',
        data: limitedData.valuesOut,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: 'rgba(255, 10, 7, 0.5)'
      }
    ]
  };
  pengPoliklinikChartData.value = {
    labels: limitedData.index2,
    datasets: [
      {
        label: 'Pengeluaran',
        data: limitedData.valuesIn2,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: 'rgba(255, 10, 7, 0.5)'
      },
      {
        label: 'Pendapatan',
        data: limitedData.valuesOut2,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: 'rgba(95, 255, 132, 0.5)'
      }
    ]
  };
})

onMounted(async () => {
  const data = (await axios.get("http://localhost:5000/api/dashboard", {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  })).data
  jumlahPendapatan.value = data.pendapatan;
  jumlahPengeluaran.value = data.pengeluaran;
});

watch(lastFilter, async () => {
  const data = (await axios.get("http://localhost:5000/api/dashboard", {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  })).data
  jumlahPendapatan.value = data.pendapatan;
  jumlahPengeluaran.value = data.pengeluaran;
  console.log("amogus")
})
</script>

<style>
.item-1 {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, 1fr);

  &__card {
    width: 100%;
    text-decoration: none;
  }
}

.big-number {
  font-weight: bold;
  font-size: 30px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
