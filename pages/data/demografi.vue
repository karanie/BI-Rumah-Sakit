<template>
  <BiBase @filter="filter">
    <Message :closable="false">Data terkahir di-update pada <b>20xx/xx/xx</b></Message>

    <Card>
    <template #title>Jumlah Pasien berdasarkan Kabupaten/Kota</template>
    <template #content>
      <Skeleton height="8rem" v-if="dataIsPending" />
      <Chart v-if="!dataIsPending" type="doughnut" :data="demografiChartData1" :options="demografiChartData1Opt" />
    </template>
    </Card>

    <Card>
    <template #title>Top 10 Kabupaten/Kota</template>
    <template #content>
      <Skeleton height="8rem" v-if="dataIsPending" />
      <Chart v-if="!dataIsPending" type="doughnut" :data="demografiChartData2" :options="demografiChartData2Opt" />
    </template>
    </Card>

    <Card>
    <template #title>Kabupaten/Kota Seiring Waktu</template>
    <template #content>
      <Skeleton height="8rem" v-if="timeSeriesDataIsPending" />
      <Chart v-if="!timeSeriesDataIsPending" id="asdf" type="line" :data="demografiChartData3" />
    </template>
    </Card>

  </BiBase>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart';
import { tooltipLabelCallback } from '@/tools/chartOptions';

const demografiChartData1 = ref();
const demografiChartData1Opt = ref();
const demografiChartData2 = ref();
const demografiChartData2Opt = ref();
const demografiChartData3 = ref();
const filterTahun = ref();
const filterBulan = ref();

const {
  data: data,
  pending: dataIsPending,
  refresh: refreshData,
  } = await useFetch("http://localhost:5000/api/demografi", {
  server: true,
  lazy: true,
  params: {
    tahun: filterTahun.value,
    bulan: filterBulan.value
  }
})
const {
  data: timeSeriesData,
  pending: timeSeriesDataIsPending,
  refresh: refreshTimeSeriesData,
  }: any = await useFetch("http://localhost:5000/api/demografi?tipe_data=timeseries", {
  server: true,
  lazy: true,
  params: {
    tipe_data: "timeseries",
    tahun: filterTahun.value,
    bulan: filterBulan.value
  },
});

watch(data, () => {
  if (!data.value) {
    return;
  }
  demografiChartData1.value = setDemografiChartData(reduceData(data.value, 10));
  demografiChartData1Opt.value = setDemografiChartDataOpt();
  demografiChartData2.value = setDemografiChartData(reduceData(data.value, 10, false));
  demografiChartData2Opt.value = setDemografiChartDataOpt();
});

watch(timeSeriesData, () => {
  if (!timeSeriesData.value) {
    return;
  }
  demografiChartData3.value = {
    labels: timeSeriesData.value.index,
    datasets: timeSeriesData.value.columns.map((val: string, i: number) => {
      return {
        label: val,
        data: timeSeriesData.value.values[i]
      }
    })
  };
});

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

const filter = async (selectedData: any) => {
  filterTahun.value = selectedData.tahun;
  filterBulan.value = selectedData.bulan;
  refreshData();
  refreshTimeSeriesData();
}
</script>
