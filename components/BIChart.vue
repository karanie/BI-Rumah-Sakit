<template>
  <Card class="bi-chart">
    <template #title>
      <div class="title">
        <span>
          <slot name="title" />
        </span>
        <template v-if="props.forecast">
          <Button v-if="tahun" :loading="forecastStatus == 'pending'" @click="forecast" label="Forecast"
            icon="pi pi-chart-line" disabled />
          <Button v-else :loading="forecastStatus == 'pending'" @click="forecast" label="Forecast"
            icon="pi pi-chart-line" />
        </template>
      </div>
    </template>
    <template #subtitle>
      <div class="subtitle">
        <span>
          <slot name="subtitle" />
        </span>
      </div>
    </template>
    <template #content>
      <Error v-if="status == 'error'">
        <template #details>
          <ErrorDetails refreshButton @refresh="() => refresh()">
            <template #details>
              <pre>{{ error }}</pre>
            </template>
          </ErrorDetails>
        </template>
      </Error>
      <Skeleton height="8rem" v-if="status == 'pending' && !chartData" />
      <template v-if="displayChart">
        <div class="content">
          <GeoChart v-if="type == 'geographic'" :style="{ width: props.chartWidth }" :data="chartData"
            :options="props.chartOpt" />
          <Chart v-if="type != 'geographic'" :style="{ width: props.chartWidth }" :type="props.type" :data="chartData"
            :options="props.chartOpt" />
        </div>
      </template>
      <template v-else-if="status == 'success' && !chartData">
        <div class="content">
          Data Tidak Ditemukan
        </div>
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
  chartWidth?: string,
  setChartData?: (data: any, forecastData?: any) => any,
  tipeData?: string,
  timeseries?: boolean,
  forecast?: boolean,
  listenUpdate?: boolean,
}>();

const chartData = ref();

const {
  tahun,
  bulan,
  kabupaten,
  lastFilter,
} = storeToRefs(useDataFilter());

const params = computed(() => {
  const p: any = {
    tahun: tahun.value,
    bulan: bulan.value,
    tipe_data: props.tipeData,
    timeseries: props.timeseries,
  }
  if (kabupaten.value !== null) {
    p.kabupaten = kabupaten.value;
  }
  return p;
});

const paramsForecast = computed(() => {
  const p: any = {
    tahun: tahun.value,
    bulan: bulan.value,
    tipe_data: props.tipeData,
    forecast: props.forecast
  }
  if (kabupaten.value !== null) {
    p.kabupaten = kabupaten.value;
  }
  return p;
});

const { data, status, refresh, error } = useFetch(props.src, {
  key: props.src + props.tipeData + props.type + String(props.timeseries),
  server: false,
  lazy: true,
  params: params,
});

const { data: forecastData, status: forecastStatus, execute: forecastExecute } = useFetch(props.src, {
  server: false,
  lazy: true,
  params: paramsForecast,
  watch: false,
  immediate: false,
});

const displayChart = computed(() => status.value == 'success' || (status.value != 'error' && chartData.value))

watch(data, () => {
  if (!data.value)
    return;
  chartData.value = setData(data.value, forecastData.value);
});

watch(forecastData, () => {
  if (!forecastData.value && !data.value)
    return;
  chartData.value = setData(data.value, forecastData.value);
});

watch(lastFilter, () => {
  forecastData.value = null;
});

const { update: newUpdate } = storeToRefs(useDataUpdate());
watch(newUpdate, () => {
  if (props.listenUpdate) {
    refresh();
  }
});

function forecast() {
  forecastExecute();
}

function setData(data: any, forecastData?: any) {
  if (props.setChartData)
    return props.setChartData(data, forecastData);

  if (!data.values || data.values.length == 0)
    return false

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

.bi-chart {
  // height: 400px;
}
</style>
