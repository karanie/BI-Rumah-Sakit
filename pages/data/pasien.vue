<template>
  <div class="grid-container">
    <div class="grid-item-number">
      <Card>
        <template #title>
          <Skeleton v-if="pasienBaruLamaDataIsPending" height="4.5rem"></Skeleton>
          <template v-else>
            <div class="header_numberCard">
              <div class="title_numberCard">Pasien Baru</div>
              <Icon style="font-size: 3.5rem;" color="#7B99FA" name="material-symbols:patient-list-rounded" />
            </div>
          </template>
        </template>
        <template #content>
          <Skeleton v-if="pasienBaruLamaDataIsPending" height="3rem"></Skeleton>
          <template v-else>
            <div class="value_column">
              <div class="percentage_value">
                <b class="percentage_value__count">{{ getPasienBaruCount }}</b>
                <div class="bar-1">
                  <ProgressBar :value="getPasienBaruPercentage" :showValue="true" class="progressbar">{{
            getPasienBaruPercentage + "%" }}</ProgressBar>
                </div>
              </div>
            </div>
          </template>
        </template>
      </Card>

      <Card>
        <template #title>
          <Skeleton v-if="pasienBaruLamaDataIsPending" height="4.5rem"></Skeleton>
          <template v-else>
            <div class="header_numberCard">
              <div class="title_numberCard">Pasien Lama</div>
              <Icon style="font-size: 3.5rem;" color="#96EAB7" name="material-symbols:patient-list-rounded" />
            </div>
          </template>
        </template>
        <template #content>
          <Skeleton v-if="pasienBaruLamaDataIsPending" height="3rem"></Skeleton>
          <template v-else>
            <div class="value_column">
              <div class="percentage_value">
                <b class="percentage_value__count">{{ getPasienLamaCount }}</b>
                <div class="bar-2">
                  <ProgressBar :value="getPasienLamaPercentage" :showValue="true">{{ getPasienLamaPercentage + "%" }}
                  </ProgressBar>
                </div>
              </div>
            </div>
          </template>
        </template>
      </Card>

      <Card>
        <template #title>
          <Skeleton v-if="jumlahJenisKelaminDataPending" height="4.5rem"></Skeleton>
          <template v-else>
            <div class="header_numberCard">
              <div class="title_numberCard">Pasien Laki-Laki</div>
              <Icon style="font-size: 3.5rem;" color="#53CDD8" name="material-symbols:man-3-rounded" />
            </div>
          </template>
        </template>
        <template #content>
          <Skeleton v-if="jumlahJenisKelaminDataPending" height="3rem"></Skeleton>
          <template v-else>
            <div class="value_column">
              <div class="percentage_value">
                <b class="percentage_value__count">{{ getMaleCount }}</b>
                <div class="bar-3">
                  <ProgressBar :value="male" :showValue="true">{{ getMalePercentage }}</ProgressBar>
                </div>
              </div>
            </div>
          </template>
        </template>
      </Card>

      <Card>
        <template #title>
          <Skeleton v-if="jumlahJenisKelaminDataPending" height="4.5rem"></Skeleton>
          <template v-else>
            <div class="header_numberCard">
              <div class="title_numberCard">Pasien Perempuan</div>
              <Icon style="font-size: 3.5rem;" color="#E07F7F" name="material-symbols:woman-2-rounded" />
            </div>
          </template>
        </template>
        <template #content>
          <Skeleton v-if="jumlahJenisKelaminDataPending" height="3rem"></Skeleton>
          <template v-else>
            <div class="value_column">
              <div class="percentage_value">
                <b class="percentage_value__count">{{ getFemaleCount }}</b>
                <div class="bar-4">
                  <ProgressBar :value="female" :showValue="true">{{ getFemalePercentage }}</ProgressBar>
                </div>
              </div>
            </div>
          </template>
        </template>
      </Card>
    </div>

    <div class="grid-item-chart">
      <div class="grid-item-chart__item1">
        <BIChart src="/api/pasien" tipeData="jumlahPasienPertahun" type="bar" :setChartData="setTop10Color">
          <template #title>Perkembangan Pasien Pertahun</template>
        </BIChart>
      </div>

      <div class="grid-item-chart__item2">
        <BIChart src="/api/pasien" tipeData="usia" type="pie" :chartOpt="generateChartOption('percent')"
          :setChartData="processChartData">
          <template #title>Distribusi Usia</template>
        </BIChart>
      </div>

      <div class="grid-item-chart__item4">
        <BIChart src="/api/demografi" type="geographic">
          <template #title>Demografi Riau</template>
        </BIChart>
      </div>

      <BIChart src="/api/pasien" tipeData="pekerjaan" type="bar" :chartOpt="{ indexAxis: 'y' }"
        :setChartData="setTop10Color">
        <template #title>Top 10 Pekerjaan Pasien</template>
      </BIChart>

    </div>
  </div>
</template>

<script setup>
import axios from 'axios';

definePageMeta({
  layout: "data"
});

const {
  bulan,
  tahun,
  kabupaten,
  lastFilter,
} = storeToRefs(useDataFilter());

const maleCount = ref(0);
const femaleCount = ref(0);
const pasienLamaCount = ref(0);
const pasienBaruCount = ref(0)

const getMaleCount = computed(() => new Intl.NumberFormat().format(maleCount.value));
const getMalePercentage = computed(() => Math.round(maleCount.value / (maleCount.value + femaleCount.value) * 100) + "%");
const male = computed(() => maleCount.value / (maleCount.value + femaleCount.value) * 100);
const female = computed(() => femaleCount.value / (maleCount.value + femaleCount.value) * 100);
const getFemaleCount = computed(() => new Intl.NumberFormat().format(femaleCount.value));
const getFemalePercentage = computed(() => Math.round(femaleCount.value / (maleCount.value + femaleCount.value) * 100) + "%");
const getPasienLamaCount = computed(() => new Intl.NumberFormat().format(pasienLamaCount.value));
const getPasienBaruCount = computed(() => new Intl.NumberFormat().format(pasienBaruCount.value));
const getPasienBaruPercentage = computed(() => Math.round(pasienBaruCount.value / (pasienLamaCount.value + pasienBaruCount.value) * 100));
const getPasienLamaPercentage = computed(() => Math.round(pasienLamaCount.value / (pasienLamaCount.value + pasienBaruCount.value) * 100));

const BarChartData = ref();
const kelompokUsiaChartData = ref();

// Data Jumlah Pasien Baru/Lama
const {
  pending: pasienBaruLamaDataIsPending,
} = await useFetch("http://localhost:5000/api/pasien", {
  server: false,
  lazy: true,
  params: {
    tipe_data: "pasienLamaBaru",
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  onResponse({ response }) {
    console.log(response)
    pasienLamaCount.value = response._data.jumlahPasienLama
    pasienBaruCount.value = response._data.jumlahPasienBaru
  }
})

const {
  pending: jumlahJenisKelaminDataPending,
} = await useFetch("http://localhost:5000/api/pasien", {
  server: false,
  lazy: true,
  params: {
    tipe_data: "jumlahJenisKelamin",
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  onResponse({ response }) {
    console.log(response)
    maleCount.value = response._data.values[0]
    femaleCount.value = response._data.values[1]
  }
})

onMounted(async () => {
  const data = (await axios.get("http://localhost:5000/api/pasien", {
    params: {
      tipe_data: "usia"
    }
  })).data

  kelompokUsiaChartData.value = processChartData(data);
  BarChartData.value = setBarChartData(data)
});

const processChartData = data => {
  const documentStyle = getComputedStyle(document.body);

  const mapLabelName = {
    "bayi & balita": "Bayi & Balita",
    "anak-anak": "Anak-Anak",
    "remaja": "Remaja",
    "dewasa": "Dewasa",
    "lansia": "Lansia",
    "unknown": "Tidak Diketahui"
  }

  const out = {
    labels: data.index.map(i => mapLabelName[i]),
    datasets: [
      {
        data: data.values,
        backgroundColor: [documentStyle.getPropertyValue('--cyan-500'),
        documentStyle.getPropertyValue('--orange-500'),
        documentStyle.getPropertyValue('--gray-500'),
        documentStyle.getPropertyValue('--indigo-500'),
        documentStyle.getPropertyValue('--teal-500')],
        hoverBackgroundColor: [documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--pink-400')]
      }
    ]
  }
  return out
};


const setBarChartData = (apiData) => {
  const documentStyle = getComputedStyle(document.body);

  const dataValues = Object.values(apiData.jumlah_pasien_tahunan);

  // Mencari index dari nilai tertinggi
  const maxIndex = dataValues.indexOf(Math.max(...dataValues));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  return {
    labels: Object.keys(apiData.jumlah_pasien_tahunan),
    datasets: [
      {
        label: "Jumlah Pasien",
        data: dataValues,
        backgroundColor: backgroundColors
      },
    ],
  };
}

function setTop10Color(data) {
  console.log(data.index)
  // Mencari index dari nilai tertinggi
  const maxIndex = data.values.indexOf(Math.max(...data.values));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(data.values.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  // Proses data untuk format grafik batang
  return {
    labels: data.index,
    datasets: [
      {
        label: 'Jumlah',
        data: data.values,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
}

</script>

<style scoped lang="scss">
.grid-item-number {
  display: grid;
  margin: 0;
  padding: 0;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2%;
  margin-top: 10px;
  margin-bottom: 20px;
}

.grid-item-chart {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 2fr 1fr;

  &__item1 {
    grid-row: 1 / 2;
    grid-column: 1/2;
  }

  &__item2 {
    grid-row: 1 / 2;
    grid-column: 2 / 3;
  }

  &__item3 {
    grid-row: 2/3;
    grid-column: 1/3;
  }

  &__item4 {
    grid-row: 3/4;
    grid-column: 1/3;
  }
}

.title_numberCard {
  font-size: medium;
}

.header_numberCard {
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: center;
}

.percentage_value {
  display: grid;
  gap: 10px;

  &__count {
    font-size: x-large;
  }
}

.bar-1:deep() .p-progressbar .p-progressbar-value {
  background: #7B99FA;
}

.bar-2:deep() .p-progressbar .p-progressbar-value {
  background: #96EAB7;
}

.bar-3:deep() .p-progressbar .p-progressbar-value {
  background: #53CDD8;
}

.bar-4:deep() .p-progressbar .p-progressbar-value {
  background: #E07F7F;
}
</style>
