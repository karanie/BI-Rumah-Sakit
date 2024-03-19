<template>
  <div class="numeric-data">
    <Nuxt-link to="/data/pasien" class="no-underline">
      <Card class="numeric-data__card">
        <template #title>Total Pasien</template>
        <template #subtitle>Jumlah pasien</template>
        <template #content>
          <div class="big-number">{{ getJumlahPasien }}</div>
        </template>
      </Card>
    </Nuxt-link>

    <Nuxt-link to="/data/pasien" class="no-underline">
      <Card class="numeric-data__card">
        <template #title>Total Kunjungan</template>
        <template #subtitle>Jumlah Kunjungan</template>
        <template #content>
          <div class="big-number">{{ getJumlahKunjungan }}</div>
        </template>
      </Card>
    </Nuxt-link>

    <Nuxt-link to="/data/pasien" class="no-underline">
      <Card class="numeric-data__card">
        <template #title>Total Pendapatan</template>
        <template #subtitle>Jumlah Pendapatan</template>
        <template #content>
          <div class="big-number">{{ getJumlahPendapatan }}</div>
        </template>
      </Card>
    </Nuxt-link>
  </div>
  

  <div class="perseberangender">
    <Card class="perseberangender__card">
      <template #title>Pasien Laki-Laki</template>
      <template #content>
        <div class="value_column">
          <Icon style="font-size: 3.5rem;" color="var(--blue-400)" name="material-symbols:man-3-rounded" />
          <div class="percentage_value">
            <b class="percentage_value__count percentage_value__count--male">{{ getMaleCount }}</b>
            <b class="percentage_value__percent">{{ getMalePercentage }}</b>
          </div>
        </div>
      </template>
    </Card>

    <Card class="perseberangender__card">
      <template #title>Pasien Perempuan</template>
      <template #content>
        <div class="value_column">
          <Icon style="font-size: 3.5rem;" color="var(--red-400)" name="material-symbols:woman-2-rounded" />
          <div class="percentage_value">
            <b class="percentage_value__count percentage_value__count--female">{{ getFemaleCount }}</b>
            <b class="percentage_value__percent">{{ getFemalePercentage }}</b>
          </div>
        </div>
      </template>
    </Card>
  </div>

  <div class="data-pasien">
    <Card class="card">
      <template #title>Perkembangan Jumlah Pasien Setiap Tahun</template>
      <template #subtitle>Jumlah pasien baru setiap tahun, hal ini berdasarkan waktu registrasi pertama.</template>
      <template #content>
        <Chart type="bar" :data="perkembanganData" />
      </template>
    </Card>

    <Card>
      <template #title>Distribusi Pasien by Kelompok Usia</template>
      <template #content>
        <Chart type="polarArea" :options="{
            responsive: true,
            scales: {
              r: {
                pointLabels: {
                  display: true,
                  centerPointLabels: true,
                  font: {
                    size: 18
                  }
                }
              }
            }
          }" :data="kelompokUsiaChartData" />
      </template>
    </Card>
  </div>
</template>

<script setup>
import Chart from 'primevue/chart';
import axios from 'axios';

definePageMeta({
  layout: "data",
});

const {
  bulan,
  tahun,
  kabupaten,
  lastFilter,
} = storeToRefs(useDataFilter());

const jumlahPasien = ref();
const jumlahKunjungan = ref();
const jumlahPendapatan = ref();

const maleCount = ref(0);
const femaleCount = ref(0);

const kelompokUsiaChartData = ref();
const lineChartData = ref();
const perkembanganData = ref();

const getJumlahPasien = computed(() => new Intl.NumberFormat().format(jumlahPasien.value));
const getJumlahKunjungan = computed(() => new Intl.NumberFormat().format(jumlahKunjungan.value));
const getJumlahPendapatan = computed(() => new Intl.NumberFormat().format(jumlahPendapatan.value));
const getMaleCount = computed(() => new Intl.NumberFormat().format(maleCount.value));
const getMalePercentage = computed(() => Math.round(maleCount.value / (maleCount.value + femaleCount.value) * 100) + "%");
const getFemaleCount = computed(() => new Intl.NumberFormat().format(femaleCount.value));
const getFemalePercentage = computed(() => Math.round(femaleCount.value / (maleCount.value + femaleCount.value) * 100) + "%");

onMounted(async () => {
  const data = (await axios.get("http://localhost:5000/api/dashboard", {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  })).data
  console.log(data);
  jumlahPasien.value = data.jumlahPasien;
  jumlahKunjungan.value = data.jumlahKunjungan;
  perkembanganData.value = setBarChartData(data);
});

onMounted(async () => {
  const data = (await axios.get("http://localhost:5000/api/jeniskelamin", {
    params: {
      kabupaten: kabupaten.value,
      tahun: tahun.value,
      bulan: bulan.value
    }
  })).data
  maleCount.value = data.values[0];
  femaleCount.value = data.values[1];
});

onMounted(async () => {
  const data = (await axios.get("http://localhost:5000/api/usia", {
    params: {
      kabupaten: kabupaten.value,
      tahun: tahun.value,
      bulan: bulan.value
    }
  })).data
  kelompokUsiaChartData.value = processUsiaChartData(data);
});

watch(lastFilter, async () => {
  const data = (await axios.get("http://localhost:5000/api/dashboard", {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  })).data
  jumlahPasien.value = data.jumlahPasien;
  jumlahKunjungan.value = data.jumlahKunjungan;
});

watch(lastFilter, async () => {
  const data = (await axios.get("http://localhost:5000/api/jeniskelamin", {
    params: {
      kabupaten: kabupaten.value,
      tahun: tahun.value,
      bulan: bulan.value
    }
  })).data
  femaleCount.value = data.values[1];
  maleCount.value = data.values[0];
});

watch(lastFilter, async () => {
  const data = (await axios.get("http://localhost:5000/api/usia"), {
    params: {
      kabupaten: kabupaten.value,
      tahun: tahun.value,
      bulan: bulan.value
    }
  }).data
  kelompokUsiaChartData.value = processUsiaChartData(data);
  jumlahPasien.value = data.jumlahPasien;
  BarChartData.value = setBarChartData(data);
});

const capitalizeEachLetter = (string) => {
  return string.replace(/\b\w/g, match => match.toUpperCase());
};

const setBarChartData = (apiData) => {
  return {
    labels: Object.keys(apiData.jumlahPasienTahunan),
    datasets: [
      {
        label: "Jumlah Pasien",
        data: Object.values(apiData.jumlahPasienTahunan),
      },
    ],
  };
};

const processUsiaChartData = (apiData) => {
  const documentStyle = getComputedStyle(document.body);
  const desiredOrder = ["bayi & balita", "anak-anak", "remaja", "dewasa", "lansia"];

  const labels = desiredOrder.map(category => capitalizeEachLetter(category));
  const values = desiredOrder.map(category => apiData.kategori[category]);

  return {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          documentStyle.getPropertyValue('--cyan-500'),
          documentStyle.getPropertyValue('--orange-500'),
          documentStyle.getPropertyValue('--gray-500'),
          documentStyle.getPropertyValue('--indigo-500'),
          documentStyle.getPropertyValue('--teal-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--cyan-400'),
          documentStyle.getPropertyValue('--orange-400'),
          documentStyle.getPropertyValue('--gray-400'),
        ],
        tooltip: {
          callbacks: {
            label: tooltipLabelCallback,
          }
        }
      },
    ],
  };
};

</script>

<style scoped lang="scss">
.numeric-data {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);

  &__card {
    width: 100%;
    text-decoration: none;
  }

  &__card:hover {
    transform: scale(1.05);
    background-color: var(--cyan-50);
  }

  .big-number {
    font-weight: bold;
  }
}

.no-underline {
  text-decoration: none;
}

.perseberangender {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;

  &__card {
    width: 100%;
  }

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
</style>
