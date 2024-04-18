<template>
  <BIChart src="/api/demografi" type="geographic">
    <template #title>Demografi Riau</template>
  </BIChart>

  <BIChart src="/api/demografi" type="doughnut" :chartOpt="generateChartOption('percent')">
    <template #title>Jumlah Pasien berdasarkan Kabupaten/Kota</template>
  </BIChart>

  <BIChart src="/api/demografi" timeseries tipeData="timeseries" type="line" forecast>
    <template #title>Jumlah Pasien berdasarkan Kabupaten/Kota Seiring Waktu</template>
  </BIChart>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "data",
});
</script>
