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
      <skeleton height="8rem" v-if="genderDataIsPending"></skeleton>
      <p class="m-0">
        <Chart type="doughnut" :data="genderchartdata" :options="genderChartDataOpt" v-if="!genderDataIsPending" />
      </p>
    </template>
  </Card>

    <Card>
    <template #title>Distribusi Jenis Kelamin Per Tahun</template>
    <template #content>
      <skeleton height="8rem" v-if="genderTimeSeriesDataIsPending"></skeleton>
      <Chart type="line" :data="genderchartdata2" v-if="!genderTimeSeriesDataIsPending" />
    </template>
  </Card>

  <h1>Data Kunjungan (Placeholder)</h1>

  <Card>
    <template #title>Pertumbuhan Kunjungan</template>
    <template #content>
      <skeleton height="8rem" v-if="kunjunganDataIsPending"></skeleton>
      <Chart type="line" :data="kunjungangrowthdata" v-if="!kunjunganDataIsPending"/>
    </template>
  </Card>

  <Card>
    <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Registrasi</template>
    <template #content>
    <skeleton height="8rem" v-if="jenisRegisDataIsPending"></skeleton>
      <Chart type="line" :data="jenisregisgrowthdata" v-if="!jenisRegisDataIsPending" />
    </template>
  </Card>

  <Card>
    <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Rujukan</template>
    <template #content>
    <skeleton height="8rem" v-if="RujukanDataIsPending"></skeleton>
      <Chart type="line" :data="rujukangrowthdata" v-if="!RujukanDataIsPending" />
    </template>
  </Card>

</template>

<script setup>

import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Skeleton from 'primevue/skeleton';


definePageMeta({
  layout: "data",
});

// Data Kunjungan (Numpang Letak Xixi)
const kunjungangrowthdata = ref()
const jenisregisgrowthdata = ref()
const rujukangrowthdata = ref()

// Data Gender
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

// Data Pie Chart & Count Gender Pasien
const {
  data: genderData,
  pending: genderDataIsPending,
  refresh: genderDataRefresh,
} = await useFetch("http://localhost:5000/api/jeniskelamin",{
  server: false,
  lazy: true,
  params: {
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  watch: false
})

// Data Timeseries (Line Chart) Gender
const {
  data: genderTimeSeriesData,
  pending: genderTimeSeriesDataIsPending,
  refresh: genderTimeSeriesDataRefresh,
} = await useFetch("http://localhost:5000/api/jeniskelamin", {
  server: false,
  lazy: true,
  params: {
    tipe_data: "timeseries",
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  watch: false
})

// Data Pertumbuhan Kunjungan
const {
  data: kunjunganData,
  pending: kunjunganDataIsPending,
  refresh: kunjunganDataRefresh,
} = await useFetch("http://localhost:5000/api/kunjungan", {
  server: false,
  lazy: true,
  params: {
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  watch: false
})

// Data Pertumbuhan Kunjungan Berdasarkan Jenis Regis
const {
  data: jenisRegisData,
  pending: jenisRegisDataIsPending,
  refresh: jenisRegisDataRefresh,
} = await useFetch("http://localhost:5000/api/jenis_registrasi", {
  server: false,
  lazy: true,
  params: {
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  watch: false
})

//  Data Pertumbuhan Kunjungan Berdasarkan Rujukan
const {
  data: RujukanData,
  pending: RujukanDataIsPending,
  refresh: RujukanDataRefresh,
} = await useFetch("http://localhost:5000/api/rujukan", {
  server: false,
  lazy: true,
  params: {
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  watch: false
})

watch(genderData, () => {
if (!genderData.value) {
  return;
}
genderchartdata.value = setPieChartData(genderData.value);
countdata_female.value = genderData.value.values[1]
countdata_male.value = genderData.value.values[0]
genderChartDataOpt.value = setGenderChartDataOpt()
});

watch(genderTimeSeriesData, () => {
  if (!genderTimeSeriesData.value) {
    return;
  }
  genderchartdata2.value = {
    labels: genderTimeSeriesData.value.index,
    datasets: genderTimeSeriesData.value.columns.map((val, i) => {
      return {
        label: val,
        data: genderTimeSeriesData.value.values[i]
      }
    })
  };
});

watch(kunjunganData, () => {
  if (!kunjunganData.value) {
    return;
  }
  kunjungangrowthdata.value = {
    labels: kunjunganData.value.index,
    datasets: kunjunganData.value.columns.map((val, i) => {
      return {
        label: val,
        data: kunjunganData.value.values[i]
      }
    })
  };
});

watch(jenisRegisData, () => {
  if (!jenisRegisData.value) {
    return;
  }
  jenisregisgrowthdata.value = {
    labels: jenisRegisData.value.index,
    datasets: jenisRegisData.value.columns.map((val, i) => {
      return {
        label: val,
        data: jenisRegisData.value.values[i]
      }
    })
  };
});

watch(RujukanData, () => {
  if (!RujukanData.value) {
    return;
  }
  rujukangrowthdata.value = {
    labels: RujukanData.value.index,
    datasets: RujukanData.value.columns.map((val, i) => {
      return {
        label: val,
        data: RujukanData.value.values[i]
      }
    })
  };
});

watch(lastFilter, () => {
  genderDataRefresh();
  genderTimeSeriesDataRefresh();
  jenisRegisDataRefresh();
  kunjunganDataRefresh();
  RujukanDataRefresh();
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
