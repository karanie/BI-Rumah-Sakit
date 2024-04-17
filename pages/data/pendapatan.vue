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

  <BIChart src="/api/pendapatan" timeseries type="line" forecast :setChartData="setPendapatanName"
    :chartOpt="setPendapatanChartDataOpt()">
    <template #title>Jumlah Pendapatan Seiring Waktu</template>
  </BIChart>

  <BIChart src="/api/pendapatan" timeseries tipeData="jenisregis" :chartOpt="setPendapatanChartDataOpt()" type="line">
    <template #title>Jumlah Pendapatan Seiring Waktu Berdasarkan jenis_registrasi</template>
  </BIChart>

  <BIChart src="/api/gejala" :chartOpt="{ indexAxis: 'y' }" :setChartData="setPenyakitChartData1" type="bar">
    <template #title>10 Pendapatan Tertinggi Berdasarkan Penyakit</template>
  </BIChart>

  <BIChart src="/api/gejala" :chartOpt="{ indexAxis: 'y' }" :setChartData="setPenyakitChartData2" type="bar">
    <template #title>10 Pengeluaran Tertinggi Berdasarkan Penyakit</template>
  </BIChart>


  <BIChart src="/api/poliklinik" type="bar" :setChartData="setPoliklinikChartData1" :chartOpt="{
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
        }">
    <template #title>10 Pendapatan Tertinggi Berdasarkan Poliklinik</template>
  </BIChart>

  <BIChart src="/api/poliklinik" type="bar" :setChartData="setPoliklinikChartData2" :chartOpt="{
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
        }">
    <template #title>10 Pengeluaran Tertinggi Berdasarkan Poliklinik</template>
  </BIChart>

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

function setPenyakitChartData1(data){
  // Mencari index dari nilai tertinggi
  const maxIndex = data.pendapatan.indexOf(Math.max(...data.pendapatan));
  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(data.pendapatan.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  return {
    labels: data.index1,
    datasets: [
      {
        label: 'Jumlah',
        data: data.pendapatan,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };

}

function setPenyakitChartData2(data){
  // Mencari index dari nilai tertinggi
  const maxIndex = data.pengeluaran.indexOf(Math.max(...data.pengeluaran));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(data.pengeluaran.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  return  {
    labels: data.index2,
    datasets: [
      {
        label: 'Jumlah',
        data: data.pengeluaran,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
}



function setPoliklinikChartData1(data) {
  console.log(data);
  return {
    labels: data.index,
    datasets: [
      {
        label: 'Pendapatan',
        data: data.pendapatan,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: 'rgba(95, 255, 132, 0.5)'
      },
      {
        label: 'Pengeluaran',
        data: data.pengeluaran,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: 'rgba(255, 10, 7, 0.5)'
      }
    ]
  };
}

function setPoliklinikChartData2(data) {
  return {
    labels: data.index2,
    datasets: [
      {
        label: 'Pendapatan',
        data: data.pendapatan2,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: 'rgba(95, 255, 132, 0.5)'
      },
      {
        label: 'Pengeluaran',
        data: data.pengeluaran2,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: 'rgba(255, 10, 7, 0.5)'
      }
    ]
  }
}

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
