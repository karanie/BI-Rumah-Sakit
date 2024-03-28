<template>
  <Card>
  <template #title>Demografi Riau</template>
  <template #content>
    <Skeleton height="8rem" v-if="dataIsPending" />
    <GeoChart :data="demografiChartData1" />
  </template>
  </Card>

  <Card>
  <template #title>Jumlah Pasien berdasarkan Kabupaten/Kota</template>
  <template #content>
    <Skeleton height="8rem" v-if="dataIsPending" />
    <Chart v-if="!dataIsPending" type="doughnut" :data="demografiChartData1" :options="demografiChartData1Opt" />
  </template>
  </Card>

  <Card>
  <template #title>Kabupaten/Kota Seiring Waktu</template>
  <template #content>
    <Skeleton height="8rem" v-if="timeSeriesDataIsPending" />
    <Chart v-if="!timeSeriesDataIsPending" id="asdf" type="line" :data="demografiChartData2" />
  </template>
  </Card>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart';

definePageMeta({
  layout: "data",
});

const demografiChartData1 = ref();
const demografiChartData1Opt = ref();
const demografiChartData2 = ref();
const {
  tahun,
  bulan,
  lastFilter,
  } = storeToRefs(useDataFilter());

const {
  data: data,
  pending: dataIsPending,
  refresh: refreshData,
  } = await useFetch("http://localhost:5000/api/demografi", {
  server: false,
  lazy: true,
  params: {
    tahun: tahun,
    bulan: bulan
  },
  watch: false,
})
const {
  data: timeSeriesData,
  pending: timeSeriesDataIsPending,
  refresh: refreshTimeSeriesData,
  }: any = await useFetch("http://localhost:5000/api/demografi", {
  server: false,
  lazy: true,
  params: {
    tipe_data: "timeseries",
    tahun: tahun,
    bulan: bulan
  },
  watch: false,
});

watch(data, () => {
  if (!data.value) {
    return;
  }
  demografiChartData1.value = setDemografiChartData(data.value);
  demografiChartData1Opt.value = setDemografiChartDataOpt();
});

watch(timeSeriesData, () => {
  if (!timeSeriesData.value) {
    return;
  }
  demografiChartData2.value = {
    labels: timeSeriesData.value.index,
    datasets: timeSeriesData.value.columns.map((val: string, i: number) => {
      return {
        label: val,
        data: timeSeriesData.value.values[i]
      }
    })
  };
});

watch(lastFilter, () => {
  refreshData();
  refreshTimeSeriesData();
});

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
