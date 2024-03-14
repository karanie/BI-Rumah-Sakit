<template>
  <div class="no-data">
    <!-- <div class="no-data__message">
      <span style="font-size: 72px; color: var(--text-color);">
        <Icon name="material-symbols:bar-chart" />
      </span>
      <span style="font-size: 24px;">Mohon pilih data</span>
    </div> -->

    <Card class="card">
      <template #title>Total Pasien</template>
      <template #subtitle>Jumlah pasien</template>
      <template #content>
        <b>{{ new Intl.NumberFormat().format(jumlah_pasien) }}</b>
      </template>
    </Card>

    <Card class="card">
      <template #title>Total Kunjungan</template>
      <template #subtitle>Jumlah Kunjungan</template>
      <template #content>
        <b>{{ new Intl.NumberFormat().format(jumlah_kunjungan) }}</b>
      </template>
    </Card>

    <Card class="card">
      <template #title>Total Pendapatan</template>
      <template #subtitle>Jumlah Pendapatan</template>
      <template #content>
        <b>{{ new Intl.NumberFormat().format(0) }}</b>
      </template>
    </Card>
  </div>

  <div class="perseberangender">
    <Card style="width: 100%;">
      <template #title>Pasien Laki-Laki</template>

      <template #content>
        <div class="value_column">
          <Icon style="font-size: 3.5rem;" color="var(--blue-400)" name="material-symbols:man-3-rounded" />
          <div class="percentage_value">
            <b class="percentage_value__count percentage_value__count--male">{{ new Intl.NumberFormat().format(countdata_male) }}</b>
            <b class="percentage_value__percent">{{ Math.round(countdata_male / (countdata_male + countdata_female)*100) }}%</b>
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
            <b class="percentage_value__count percentage_value__count--female">{{ new Intl.NumberFormat().format(countdata_female) }}</b>
            <b class="percentage_value__percent"> {{ Math.round(countdata_female / (countdata_male + countdata_female)*100) }}% </b>
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
      <Chart type="bar" :data="BarChartData" />
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
          }}}" :data="kelompokUsiaChartData" />
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
} = storeToRefs(useDataFilter())

const jumlah_pasien = ref();
const jumlah_kunjungan = ref();

onMounted(async () => {
  try {
    const data = (await axios.get("http://localhost:5000/api/dashboard", {
      params: {
        tahun: tahun.value,
        bulan: bulan.value,
        kabupaten: kabupaten.value,
      }
    })).data

    // Proses data API untuk digunakan dalam pembuatan Pie Chart
    jumlah_pasien.value = data.jumlah_pasien
    jumlah_kunjungan.value = data.jumlah_kunjungan

    // console.log("hasil : ",data.jumlah_pasien)
  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
});


const genderchartdata = ref()
const genderchartdata2 = ref()
const countdata_male = ref(0)
const countdata_female = ref(0)
const genderChartDataOpt = ref()

onMounted(async () => {
  let data = (await axios.get("http://localhost:5000/api/jeniskelamin", {
    params: {
      kabupaten: kabupaten.value,
      tahun: tahun.value,
      bulan: bulan.value
    }
  })).data
  // data.index = data.index.slice(1, 3)
  // data.values = data.values.slice(1, 3)

  countdata_female.value = data.values[1]
  countdata_male.value = data.values[0]
});

watch(lastFilter, async () => {
  const data = (await axios.get("http://localhost:5000/api/dashboard", {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  })).data

  // Proses data API untuk digunakan dalam pembuatan Pie Chart
  jumlah_pasien.value = data.jumlah_pasien
  jumlah_kunjungan.value = data.jumlah_kunjungan
})

watch(lastFilter, async () => {
  let data = (await axios.get("http://localhost:5000/api/jeniskelamin", {
    params: {
      kabupaten: kabupaten.value,
      tahun: tahun.value,
      bulan: bulan.value
    }
  })).data
  // data.index = data.index.slice(1, 3)
  // data.values = data.values.slice(1, 3)

  countdata_female.value = data.values[1]
  countdata_male.value = data.values[0]
})

const kelompokUsiaChartData = ref();
const lineChartData = ref();
const BarChartData = ref();

onMounted(async () => {
  try {
    const data = (await axios.get("http://localhost:5000/api/usia")).data

    // Proses data API untuk digunakan dalam pembuatan Pie Chart
    kelompokUsiaChartData.value = processChartData(data);
    jumlah_pasien.value = data.jumlah_pasien
    BarChartData.value = setBarChartData(data)
    // console.log("hasil : ",data.jumlah_pasien)
  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
});

const capitalizeEachLetter = (string) => {
  return string.replace(/\b\w/g, match => match.toUpperCase());
};

const setBarChartData = (apiData) => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: Object.keys(apiData.jumlah_pasien_tahunan),
    datasets: [
      {
        label: "Jumlah Pasien",
        data: Object.values(apiData.jumlah_pasien_tahunan),
      },
    ],
  };
}

const processChartData = (apiData) => {
  const documentStyle = getComputedStyle(document.body);
  // console.log('hasil', Object.keys(apiData));

  // Tentukan urutan yang diinginkan untuk label
  const desiredOrder = ["bayi & balita", "anak-anak", "remaja", "dewasa", "lansia"];

  // Buat array labels sesuai dengan urutan yang diinginkan
  // const labels = desiredOrder.filter(category => apiData.kategori.hasOwnProperty(category)).map(category => capitalizeEachLetter(category));

  const labels = desiredOrder.map(category => capitalizeEachLetter(category));
  const values = desiredOrder.map(category => apiData.kategori[category]);

  return {
    labels: labels,
    datasets: [
      {
        // data: Object.values(apiData.kategori),
        data : values,
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
.no-data {
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;

  &__message {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
}

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
</style>
