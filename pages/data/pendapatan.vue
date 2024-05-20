<template>
  <div class="item-1">
    <BICard src="/api/pendapatan" tipeData="totalPendapatanBulanIni" color="green">
      <template #title>
        Total Pendapatan
      </template>
      <template #subtitle>
        Jumlah total tagihan pada
      </template>
    </BICard>
    <BICard src="/api/pendapatan" tipeData="totalPengeluaranBulanIni"  color ="red">
      <template #title>
        Total Pengeluaran
      </template>
      <template #subtitle>
        Jumlah total semua hpp pada
      </template>
    </BICard>
  </div>

  <BIChart src="/api/pendapatan" timeseries forecast type="line" :setChartData="setPendapatanName"
    :chartOpt="setPendapatanCurrencyChartDataOpt()">
    <template #title>Jumlah Pendapatan Seiring Waktu</template>
  </BIChart>

  <BIChart src="/api/pendapatan" timeseries forecast tipeData="jenis_registrasi"type="line">
    <template #title>Jumlah Pendapatan Seiring Waktu Berdasarkan jenis_registrasi</template>
  </BIChart>

  <BIChart src="/api/pendapatan" tipeData="pendapatanGejala" :chartOpt="{ indexAxis: 'y' }" :setChartData="setPenyakitChartData" type="bar">
    <template #title>10 Pendapatan Tertinggi Berdasarkan Penyakit</template>
  </BIChart>

  <BIChart src="/api/pendapatan" tipeData="pengeluaranGejala" :chartOpt="{ indexAxis: 'y' }" :setChartData="setPenyakitChartData" type="bar">
    <template #title>10 Pengeluaran Tertinggi Berdasarkan Penyakit</template>
  </BIChart>

  <BIChart src="/api/pendapatan" tipeData="poliklinikSortByPendapatan" type="bar" :setChartData="setDoubleBarChartData" :chartOpt="setDoubleBarChartDataOpt()">
    <template #title>10 Pendapatan Tertinggi Berdasarkan Poliklinik</template>
  </BIChart>

  <BIChart src="/api/pendapatan" tipeData="poliklinikSortByPengeluaran" type="bar" :setChartData="setDoubleBarChartData" :chartOpt="setDoubleBarChartDataOpt()">
    <template #title>10 Pengeluaran Tertinggi Berdasarkan Poliklinik</template>
  </BIChart>

  <BIChart src="/api/pendapatan" tipeData="penjamin" type="bar" :setChartData="setDoubleBarChartData">
    <template #title>Distribusi Pendapatan Pengeluaran Berdasarkan Penjamin</template>
  </BIChart>


</template>

<script setup>

definePageMeta({
  layout: "data"
})
  function setPendapatanName(data, forecastData) {
    const mapLabelName = {
      "total_tagihan": "Pendapatan",
      "total_semua_hpp": "Pengeluaran"
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

// Set chart data gejala
function setPenyakitChartData(data) {
  // Mencari index dari nilai tertinggi
  const maxIndex = data.values.indexOf(Math.max(...data.values));
  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(data.values.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

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

// set chart data poliklinik

function setDoubleBarChartData(data) {
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

// Chart Options
const setPendapatanCurrencyChartDataOpt = () => {
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

const setDoubleBarChartDataOpt = () => {
  return {
    indexAxis: 'y', elements: {
      bar: {
        borderWidth: 2,
      }
    },
     responsive: true,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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

.container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  height: 20%;

  &__chart{
    width: 100%;
  }
}
</style>
