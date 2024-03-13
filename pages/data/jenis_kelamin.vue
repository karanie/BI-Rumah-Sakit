<template>
  <div class="perseberangender">
    <Card style="width: 100%;">
      <template #title>Pasien Laki-Laki</template>

      <template #content>
        <div class="value_column">
          <Icon style="font-size: 3.5rem;" color="var(--blue-400)" name="material-symbols:man-3-rounded" />
          <div class="percentage_value">
            <b class="percentage_value__count percentage_value__count--male">{{ new
    Intl.NumberFormat().format(countdata_male) }}</b>
            <b class="percentage_value__percent">{{ Math.round(countdata_male / (countdata_male + countdata_female)
    *
    100) }}%</b>
          </div>
        </div>
      </template>
    </Card>

    <Card style="width: 100%;">

      <template #title>Pasien Perempuan</template>

      <template #content>
        <div class="value_column">
          <Icon style="font-size: 3.5rem;" color="var(--red-400)" name="material-symbols:woman-2-rounded" />
          <div class="percentage_value">
            <b class="percentage_value__count percentage_value__count--female">{{ new
    Intl.NumberFormat().format(countdata_female) }}</b>
            <b class="percentage_value__percent"> {{ Math.round(countdata_female / (countdata_male +
    countdata_female)
    *
    100) }}% </b>
          </div>
        </div>
      </template>
    </Card>
  </div>

  <Card>

    <template #title>Distribusi Jenis Kelamin</template>

    <template #content>
      <p class="m-0">
        <Chart type="doughnut" :data="genderchartdata" :options="genderChartDataOpt" />
      </p>

    </template>
  </Card>

  <Card>

    <template #title>Distribusi Jenis Kelamin Per Tahun</template>

    <template #content>
      <Chart type="line" :data="genderchartdata2" />
    </template>
  </Card>
</template>

<script setup>

import Card from 'primevue/card';
import Chart from 'primevue/chart';
import axios from 'axios';

definePageMeta({
  layout: "data",
});

const genderchartdata = ref()
const genderchartdata2 = ref()
const countdata_male = ref(0)
const countdata_female = ref(0)
const genderChartDataOpt = ref()
const {
  tahun,
  bulan,
  lastFilter,
  kabupaten,
} = storeToRefs(useDataFilter())




onMounted(async () => {
  let data = (await axios.get("/api/jeniskelamin", {
    params: {
      kabupaten: kabupaten.value,
      tahun: tahun.value,
      bulan: bulan.value
    }
  })).data
  // data.index = data.index.slice(1, 3)
  // data.values = data.values.slice(1, 3)
  genderchartdata.value = setPieChartData(data);
  countdata_female.value = data.values[1]
  countdata_male.value = data.values[0]

  genderChartDataOpt.value = setGenderChartDataOpt()

  let dataTimeseries = (await axios.get("/api/jeniskelamin", {
    params: {
      tipe_data: "timeseries",
      kabupaten: kabupaten.value,
      tahun: tahun.value,
      bulan: bulan.value
    }
  })).data
  // dataTimeseries.values = dataTimeseries.values.slice(1, 3)
  // dataTimeseries.columns = dataTimeseries.columns.slice(1, 3)
  genderchartdata2.value = {
    labels: dataTimeseries.index,
    datasets: dataTimeseries.columns.map((val, i) => {
      return {
        label: val,
        data: dataTimeseries.values[i]
      }
    })
  }
});

watch(lastFilter,async () => {
  let data = (await axios.get("/api/jeniskelamin", {
    params: {
      kabupaten: kabupaten.value,
      tahun: tahun.value,
      bulan: bulan.value
    }
  })).data
  console.log(data)

  // data.index = data.index.slice(1, 3)
  // data.values = data.values.slice(1, 3)
  genderchartdata.value = setPieChartData(data);
  countdata_female.value = data.values[1]
  countdata_male.value = data.values[0]

  genderChartDataOpt.value = setGenderChartDataOpt()

  let dataTimeseries = (await axios.get("/api/jeniskelamin", {
    params: {
      tipe_data: "timeseries",
      kabupaten: kabupaten.value,
      tahun: tahun.value,
      bulan: bulan.value
    }
  })).data
  // dataTimeseries.values = dataTimeseries.values.slice(1, 3)
  // dataTimeseries.columns = dataTimeseries.columns.slice(1, 3)
  genderchartdata2.value = {
    labels: dataTimeseries.index,
    datasets: dataTimeseries.columns.map((val, i) => {
      return {
        label: val,
        data: dataTimeseries.values[i]
      }
    })
  }
});

const setPieChartData = data => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: data.index,
    datasets: [
      {
        data: data.values,

        backgroundColor: [documentStyle.getPropertyValue('--cyan-500'), documentStyle.getPropertyValue('--pink-500')],
        hoverBackgroundColor: [documentStyle.getPropertyValue('--cyan-400'), documentStyle.getPropertyValue('--pink-400')]
      }
    ]
  };
}

const setGenderChartDataOpt = () => {
  return {
    plugins: {
      legend: {
        align: "start",
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

<style lang="scss" scoped>
.perseberangender {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
  justify-content: center;



  &__female {
    color: var(--pink-400);
    margin: 40px;
    font-size: larger;
  }

  &__value {
    display: flex;
    background-color: red;
  }


}

.percentage_value {
  display: flex;
  flex-direction: column;


  &__count {

    font-size: larger;

    &--male {
      color: var(--blue-400);
    }

    &--female {
      color: var(--red-400);
    }
  }

  &__percent {
    color: var(--cyan-700);
    font-size: larger;
    background-color: var(--teal-100);
    border-radius: var(--border-radius);
    flex: 0;
  }
}

.value_column {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}
</style>
