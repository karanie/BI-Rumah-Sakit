<template>

  <Card>
    <template #title>Pertumbuhan Pendapatan Berdasarkan Jenis Registrasi</template>
    <template #content>
      <skeleton height="8rem" v-if="pendapatanJenisRegisDataIsPending"></skeleton>
      <Chart type="line" :data="jenisRegisPendapatanData" v-if="!pendapatanJenisRegisDataIsPending" :options="setPendapatanChartDataOpt()" />
    </template>
  </Card>

</template>

<script setup>

import Chart from 'primevue/chart';

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

// Data Pertumbuhan Kunjungan
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
});

// Chart Options

const setPendapatanChartDataOpt = () => {
  return {
    plugins: {
      tooltip: {
        callbacks: {
          label: tooltipLabelCallbackCurrency({ style: 'currency', currency: 'IDR'}),
        }
      }
    }
  }
}
</script>

<style></style>
