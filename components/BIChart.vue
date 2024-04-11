<template>
  <Card>
  <template #title>
    <div class="title">
      <span><slot name="title" /></span>
      <Button v-if="props.forecast" :loading="forecastStatus == 'pending'" @click="forecast" label="Forecast" icon="pi pi-chart-line" />
    </div>
  </template>
  <template #content>
    <Error v-if="status == 'error'">
      <template #details>
        <ErrorDetails refreshButton @refresh="() => refresh()">
          <template #details><pre>{{ error }}</pre></template>
        </ErrorDetails>
      </template>
    </Error>
    <Skeleton height="8rem" v-if="status == 'pending'" />
    <template v-if="status == 'success'">
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
  forecast?: boolean,
}>();

const chartData = ref();

const {
  tahun,
  bulan,
  lastFilter,
  } = storeToRefs(useDataFilter());

const { data, status, refresh, error } = useFetch(props.src, {
  server: false,
  lazy: true,
  params: {
    tahun: tahun,
    bulan: bulan,
    tipe_data: props.timeseries ? "timeseries" : undefined,
  },
  watch: false,
});

const { data: forecastData, status: forecastStatus, execute: forecastExecute } = useFetch(props.src, {
  server: false,
  lazy: true,
  params: {
    tahun: tahun,
    bulan: bulan,
    tipe_data: props.forecast ? "forecast" : undefined,
  },
  watch: false,
  immediate: false,
});

watch(data, () => {
  if (!data.value)
    return;
  chartData.value = setData(data.value);
  console.log(chartData.value);
});

watch(forecastData, () => {
  if (!forecastData.value && !data.value)
    return;
  chartData.value = setData(data.value, forecastData.value);
  console.log(chartData.value);
});

watch(lastFilter, () => {
  refresh();
});

function forecast() {
  forecastExecute();
}

function setData(data: any, forecastData?: any) {
  if (props.timeseries) {
    const out = {
      labels: data.index,
      datasets: data.columns.map((val: string, i: number) => {
        return {
          label: val,
          data: data.values[i],
          pointStyle: false,
        }
      })
    }
    if (!forecastData) {
      return out;
    } else {
      console.log(forecastData);
      forecastData.forEach((el: any) => {
        out.datasets.push(
          {
            label: `${el.columns[0]} Forecast`,
            data: el.values[0].map((val: number, i: number) => {
              return { x: el.index[i], y: val }
            }),
            pointStyle: false,
          }
        );
      });
      return out;
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

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
