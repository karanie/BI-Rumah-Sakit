<template>
  <BiBase>
    <Message :closable="false">Data terkahir di-update pada <b>20xx/xx/xx</b></Message>

    <Card>
    <template #title>Jumlah Pasien berdasarkan Kabupaten/Kota</template>
    <template #content>
      <Chart type="doughnut" :data="demografiChartData1" />
    </template>
    </Card>

    <Card>
    <template #title>Top 10 Kabupaten/Kota</template>
    <template #content>
      <Chart type="doughnut" :data="demografiChartData2" />
    </template>
    </Card>

  </BiBase>
</template>

<script setup lang="ts">
import Chart from 'primevue/chart';
import axios from 'axios';

const demografiChartData1 = ref();
const demografiChartData2 = ref();

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
  demografiChartData2.value = setDemografiChartData(reduceData(data, 10, false));
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
</script>

<style scoped lang="scss">
.bi {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 16px;
  padding: 8px;
  flex-direction: row;

  &__sidemenu {
    position: sticky;
    top: 0;
    max-width: 256px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
}

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
