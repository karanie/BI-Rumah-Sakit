<template>
  <BiBase>
    <Message :closable="false">Data terkahir di-update pada <b>20xx/xx/xx</b></Message>

    <Card>
    <template #title>Jumlah Pasien berdasarkan Kabupaten/Kota</template>
    <template #content>
      <Chart type="doughnut" :data="demografiChartData1" :options="demografiChartData1Opt" />
    </template>
    </Card>

    <Card>
    <template #title>Top 10 Kabupaten/Kota</template>
    <template #content>
      <Chart type="doughnut" :data="demografiChartData2" :options="demografiChartData2Opt" />
    </template>
    </Card>

    <Card>
    <template #title>Kabupaten/Kota Seiring Waktu</template>
    <template #content>
      <Chart id="asdf" type="line" :data="demografiChartData3" />
    </template>
    </Card>

  </BiBase>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart';
import axios from 'axios';
import { tooltipLabelCallback } from '@/tools/chartOptions';

const demografiChartData1 = ref();
const demografiChartData1Opt = ref();
const demografiChartData2 = ref();
const demografiChartData2Opt = ref();
const demografiChartData3 = ref();

function reduceData(data: any, threshold=10, lainnya=true) {
  data.index = data.index.slice(0, data.index.length > threshold ? -(data.index.length - threshold) : 0);
  const totalLainnya = data.values.slice(0, data.index.length).reduce((total: number, i: number) => total + i);
  data.values = data.values.slice(0, data.index.length);
  if (lainnya) {
    data.index.push("Lainnya");
    data.values.push(totalLainnya);
  }
  return data
}

onMounted(async () => {
  const data = (await axios.get("http://localhost:5000/api/demografi")).data;
  demografiChartData1.value = setDemografiChartData(reduceData(data, 10));
  demografiChartData1Opt.value = setDemografiChartDataOpt();
  console.log(demografiChartData1Opt.value);
  demografiChartData2.value = setDemografiChartData(reduceData(data, 10, false));
  demografiChartData2Opt.value = setDemografiChartDataOpt();

  const timeSeriesData = (await axios.get("http://localhost:5000/api/demografi?tipe_data=timeseries")).data;
  demografiChartData3.value = {
    labels: timeSeriesData.index,
    datasets: timeSeriesData.columns.map((val: string, i: number) => {
      return {
        label: val,
        data: timeSeriesData.values[i]
      }
    })
  };
})

const setDemografiChartData = (data: any) => {
  return {
    labels: data.index,
    datasets: [
      {
        data: data.values,
      }
    ]
  };
}

const setDemografiChartDataOpt = () => {
  return {
    plugins: {
      legend: {
        align: "end",
      },
      tooltip: {
        callbacks: {
          label: tooltipLabelCallback,
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.peningkatan-penurunan {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;

  &__peningkatan {
    color: var(--primary-color);
  }

  &__peningkatan {
    color: var(--red-400);
  }
}
</style>
