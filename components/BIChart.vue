<template>
  <Card>
  <template #title><slot name="title" /></template>
  <template #content>
    <Skeleton height="8rem" v-if="pending" />
    <template v-if="!pending">
      <GeoChart v-if="type == 'geographic'" :data="chartData" />
      <Chart v-if="type != 'geographic'" :type="props.type" :data="chartData" :options="props.chartOpt" />
    </template>
  </template>
  </Card>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart';

const props = defineProps<{
  src: string,
  type: string,
  chartOpt?: any,
  timeseries?: boolean,
}>();

const chartData = ref();

const {
  tahun,
  bulan,
  lastFilter,
  } = storeToRefs(useDataFilter());

const { data, pending, refresh } = useFetch(props.src, {
  server: false,
  lazy: true,
  params: {
    tahun: tahun,
    bulan: bulan,
    tipe_data: props.timeseries ? "timeseries" : undefined,
  },
  watch: false,
});

watch(data, () => {
  if (!data.value)
    return;
  chartData.value = setData(data.value);
  console.log(chartData.value);
});

watch(lastFilter, () => {
  refresh();
});

function setData(data: any) {
  if (props.timeseries) {
    return {
      labels: data.index,
      datasets: data.columns.map((val: string, i: number) => {
        return {
          label: val,
          data: data.values[i]
        }
      })
    }
  }
  return {
    labels: data.index,
    datasets: [
      {
        data: data.values,
      }
    ]
  };
}
</script>
