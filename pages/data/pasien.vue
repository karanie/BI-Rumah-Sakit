<template>
  <div class="grid-container">
    <div class="grid-item-number">
      <Card>
        <template #title>
          <div class="header_numberCard">
            <div class="title_numberCard">Pasien Baru</div>
            <Icon style="font-size: 3.5rem;" color="#7B99FA" name="material-symbols:patient-list-rounded" />
          </div>
        </template>
        <template #content>
          <div class="value_column">
            <div class="percentage_value">
              <b class="percentage_value__count">500</b>
              <div class="bar-1">
                <ProgressBar :value="50" :showValue="true" class="progressbar">50</ProgressBar>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #title>
          <div class="header_numberCard">
            <div class="title_numberCard">Pasien Lama</div>
            <Icon style="font-size: 3.5rem;" color="#96EAB7" name="material-symbols:patient-list-rounded" />
          </div>
        </template>
        <template #content>
          <div class="value_column">
            <div class="percentage_value">
              <b class="percentage_value__count">500</b>
              <div class="bar-2">
                <ProgressBar :value="80" :showValue="true">50</ProgressBar>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #title>
          <div class="header_numberCard">
            <div class="title_numberCard">Pasien Laki-Laki</div>
            <Icon style="font-size: 3.5rem;" color="#53CDD8" name="material-symbols:man-3-rounded" />
          </div>
        </template>
        <template #content>
          <div class="value_column">
            <div class="percentage_value">
              <b class="percentage_value__count">{{ getMaleCount }}</b>
              <div class="bar-3">
                <ProgressBar :value="male" :showValue="true">{{ getMalePercentage }}</ProgressBar>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #title>
          <div class="header_numberCard">
            <div class="title_numberCard">Pasien Perempuan</div>
            <Icon style="font-size: 3.5rem;" color="#E07F7F" name="material-symbols:woman-2-rounded" />
          </div>
        </template>
        <template #content>
          <div class="value_column">
            <div class="percentage_value">
              <b class="percentage_value__count">{{ getFemaleCount }}</b>
              <div class="bar-4">
                <ProgressBar :value="female" :showValue="true">{{ getFemalePercentage }}</ProgressBar>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div class="grid-item-chart">
      <div class="grid-item-chart__item1">
        <Card style="height:100%">
          <template #title>Perkembangan Jumlah Pasien Setiap Tahun</template>
          <template #subtitle>berdasarkan waktu registrasi pertama</template>
          <template #content>
            <Chart type="bar" :data="BarChartData" />
          </template>
        </Card>
      </div>

      <div class="grid-item-chart__item2">
        <Card>
          <template #title>
            Distribusi Pasien Berdasarkan Kelompok Usia
          </template>
          <template #content>
            <Chart type="pie" style="width: 100%; display:flex;" :data="kelompokUsiaChartData" />
          </template>
        </Card>
      </div>

      <div class="grid-item-chart__item3">
        <Card>
          <template #title>Top 10 Pekerjaan Pasien</template>
          <template #content>
            <Chart type="bar" :options="{ indexAxis: 'y' }" :data="pekerjaanChartData" />
          </template>
        </Card>
      </div>

      <div class="grid-item-chart__item4">
        <Card>
          <template #title>Distribusi Jumlah Pasien Berdasarkan Wilayah</template>
          <template #content>
            <div class="value_column">
              <Icon style="font-size: 3.5rem;" color="var(--blue-400)"
                name="material-symbols:man-3-rounded" />
              <div class="percentage_value">
                <b class="percentage_value__count">500</b>
                <ProgressBar :value="50" :showValue="true">50</ProgressBar>
              </div>
            </div>
          </template>
        </Card>
      </div>

    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import Chart from 'primevue/chart';

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

const getMaleCount = computed(() => new Intl.NumberFormat().format(maleCount.value));
const getMalePercentage = computed(() => Math.round(maleCount.value / (maleCount.value + femaleCount.value) * 100) + "%");
const male = computed(() => maleCount.value / (maleCount.value + femaleCount.value) * 100);
const female = computed(() => femaleCount.value / (maleCount.value + femaleCount.value) * 100);
const getFemaleCount = computed(() => new Intl.NumberFormat().format(femaleCount.value));
const getFemalePercentage = computed(() => Math.round(femaleCount.value / (maleCount.value + femaleCount.value) * 100) + "%");

const BarChartData = ref();
const kelompokUsiaChartData = ref();
const pekerjaanChartData = ref();

const capitalizeEachLetter = (string) => {
  return string.replace(/\b\w/g, match => match.toUpperCase());
};

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
  try {
    const data = (await axios.get("http://localhost:5000/api/usia")).data

    kelompokUsiaChartData.value = processChartData(data);
    BarChartData.value = setBarChartData(data)
  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
});

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

const processChartData = (apiData) => {
  const documentStyle = getComputedStyle(document.body);
  // console.log('hasil', Object.keys(apiData));

  // Tentukan urutan yang diinginkan untuk label
  const desiredOrder = ["bayi & balita", "anak-anak", "remaja", "dewasa", "lansia"];

  const labels = desiredOrder.map(category => capitalizeEachLetter(category));
  const values = desiredOrder.map(category => apiData.kategori[category]);

  return {
    labels: labels,
    datasets: [
      {
        // data: Object.values(apiData.kategori),
        data: values,
        backgroundColor: [
          documentStyle.getPropertyValue('--cyan-500'),
          documentStyle.getPropertyValue('--orange-500'),
          documentStyle.getPropertyValue('--gray-500'),
          documentStyle.getPropertyValue('--indigo-500'),
          documentStyle.getPropertyValue('--teal-500'),
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

onMounted(async () => {
  const response = await axios.get('http://localhost:5000/api/pekerjaan', {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  });
  const data = response.data;

  const limitedData = {
    index: data.index.slice(0, 10),
    values: data.values.slice(0, 10)
  };

  const dataValues = limitedData.values;

  // Mencari index dari nilai tertinggi
  const maxIndex = dataValues.indexOf(Math.max(...dataValues));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  // Proses data untuk format grafik batang
  pekerjaanChartData.value = {
    labels: limitedData.index,
    datasets: [
      {
        label: 'Jumlah',
        data: dataValues,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
});

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
