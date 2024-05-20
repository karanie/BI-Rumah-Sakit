<template>
  <BIChart src="/api/kunjungan" tipeData="pertumbuhanPertahun" timeseries type="line" >
    <template #title>Pertumbuhan Kunjungan Per tahun</template>
  </BIChart>

  <BIChart src="/api/kunjungan" tipeData="pertumbuhanPertahun" timeseries type="bar" >
    <template #title>Pertumbuhan Kunjungan </template>
  </BIChart>

  <Card>
    <template #title>Distribusi Jenis Penjamin</template>
    <template #content>
      <div style="width: 100%; display: flex; justify-content: center;">
        <Chart type="doughnut" :data="penjaminBarChartData" />
      </div>
    </template>
  </Card>

  <BIChart src="/api/kunjungan" tipeData="poliklinik" :chartOpt="{ indexAxis: 'y' }" type="bar" :setChartData="setPoliklinikChartData">
    <template #title>10 Poliklinik Terfavorit untuk Pasien Rawat Jalan</template>
  </BIChart>

  <BIChart src="/api/kunjungan" tipeData="gejala" :chartOpt="{ indexAxis: 'y' }" :setChartData="setPenyakitData" type="bar">
    <template #title>10 Penyakit Terbanyak</template>
  </BIChart>

  <BIChart src="/api/kunjungan" tipeData="jenis_registrasi" timeseries type="line" :setChartData="setPendapatanName">
    <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Registrasi</template>
  </BIChart>

  <BIChart src="/api/kunjungan" tipeData="rujukan" timeseries type="line" :setChartData="setPendapatanName">
    <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Rujukan</template>
  </BIChart>

    <div class="grid-container">
        <div class="grid-item-chart">
            <div class="grid-item-chart__item1">
                <BIChart src="/api/dashboard" timeseries type="bar" :setChartData="setKunjunganBarChartData"
                    style="height: 100%;">
                    <template #title>Jumlah Kunjungan Setiap Tahun</template>
                </BIChart>
            </div>

            <div class="grid-item-chart__item2">
                <BIChart src="/api/usia" timeseries type="line" :setChartData="setUsiaLineChartData"
                    style="height: 100%;">
                    <template #title>Distribusi Kelompok Usia dan Pertumbuhan Kunjungan</template>
                </BIChart>
            </div>

            <div class="grid-item-chart__item3">
                <BIChart src="/api/penjamin" type="doughnut" style="height: 100%;">
                    <template #title>Distribusi Jenis Penjamin</template>
                </BIChart>
            </div>

            <div class="grid-item-chart__item4">
                <Card style="height:100%">
                    <template #content>
                        <DataTable :value="products">
                            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
                                <template #body="scope">
                                    {{ scope.data[col.field] ? scope.data[col.field] : '-' }}
                                </template>
                            </Column>
                        </DataTable>
                    </template>
                </Card>
            </div>

            <div class="grid-item-chart__item5">
                <div class="card">
                    <Accordion expandIcon="pi pi-plus" collapseIcon="pi pi-minus" :lazy="true">
                        <AccordionTab>
                            <template #header>
                                <span class="flex align-items-center gap-2 w-full">
                                    <Icon style="font-size: 2.5rem; margin-right: 10px" color="var(--surface-400)"
                                        name="material-symbols:e911-emergency-rounded" />
                                    <span class="font-bold white-space-nowrap" style="margin-right: 10px;">IGD</span>
                                    <Badge :value="igd_count" class="ml-auto mr-2" />
                                </span>
                            </template>
                            <DetailKunjungan src="/api/diagnosa" jenisRegis="IGD">
                                <template #title>Diagnosa Penyakit IGD</template>
                            </DetailKunjungan>

                        </AccordionTab>

                        <AccordionTab>
                            <template #header>
                                <span class="flex align-items-center gap-2 w-full">
                                    <Icon style="font-size: 2.5rem; margin-right: 10px;" color="var(--surface-400)"
                                        name="material-symbols:outpatient-rounded" />
                                    <span class="font-bold white-space-nowrap" style="margin-right: 10px;">Rawat
                                        Jalan</span>
                                    <Badge :value="jalan" class="ml-auto mr-2" />
                                </span>
                            </template>
                            <DetailKunjungan src="/api/departemen" jenisRegis="Rawat Jalan" rawatJalan>
                                <template #title>Poliklinik Rawat Jalan</template>
                            </DetailKunjungan>
                        </AccordionTab>

                        <AccordionTab>
                            <template #header>
                                <span class="flex align-items-center gap-2 w-full">
                                    <Icon style="font-size: 2.5rem; margin-right: 10px;" color="var(--surface-400)"
                                        name="material-symbols:inpatient-rounded" />
                                    <span class="font-bold white-space-nowrap" style="margin-right: 10px;">Rawat
                                        Inap</span>
                                    <Badge :value="inap" class="ml-auto mr-2" />
                                </span>
                            </template>

                            <DetailKunjungan src="/api/diagnosa" jenisRegis="Rawat Inap">
                                <template #title>Diagnosa Penyakit Rawat Inap</template>
                            </DetailKunjungan>

                        </AccordionTab>
                    </Accordion>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
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

function setPenyakitData(data) {
  console.log(data.index)
  // Mencari index dari nilai tertinggi
  const maxIndex = data.values.indexOf(Math.max(...data.values));
}

const capitalizeEachLetter = (string) => {
    return string.replace(/\b\w/g, match => match.toUpperCase());
};

const setKunjunganBarChartData = (apiData) => {
    const documentStyle = getComputedStyle(document.body);
    const dataValues = Object.values(apiData.jumlahKunjunganTahunan);

    // Mencari index dari nilai tertinggi
    const maxIndex = dataValues.indexOf(Math.max(...dataValues));

    // Membuat array warna, defaultnya semua warna sama
    const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

    // Mengubah warna untuk bar dengan nilai tertinggi
    backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

    return {
        labels: Object.keys(apiData.jumlahKunjunganTahunan),
        datasets: [
            {
                label: "Jumlah Kunjungan",
                data: dataValues,
                backgroundColor: backgroundColors
            },
        ],
    };
}

const setUsiaLineChartData = (apiData) => {
    const documentStyle = getComputedStyle(document.documentElement);

    const labels = Object.keys(apiData.bytahun);
    const datasets = [];

    const desiredOrder = ["bayi & balita", "anak-anak", "remaja", "dewasa", "lansia"];

    const categoryColors = {
        "bayi & balita": '--cyan-500',
        "anak-anak": '--orange-500',
        "remaja": '--gray-500',
        "dewasa": '--indigo-500',
        "lansia": '--teal-500',
    };

    // Loop melalui setiap kategori
    for (const kategori of desiredOrder) {
        const data = labels.map((tahun) => apiData.bytahun[tahun][kategori]);

        datasets.push({
            label: capitalizeEachLetter(kategori),
            data,
            fill: false,
            borderColor: documentStyle.getPropertyValue(categoryColors[kategori]),
            backgroundColor: documentStyle.getPropertyValue(categoryColors[kategori]),
            tension: 0.4,
            type: "line"
        });
    }

    return {
        labels,
        datasets,
    };
}

function setPoliklinikChartData(data) {
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

const penjaminBarChartData = ref(null);
const instansiChartData = ref(null);
const jenisregisgrowthdata = ref()

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

onMounted(async () => {
  const response = await axios.get('http://localhost:5000/api/penjamin', {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  });
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

const igd_count = ref(0);
const inap = ref(0);
const jalan = ref(0);

onMounted(async () => {
    try {
        const jenisRegisData = (await axios.get("http://localhost:5000/api/jenis_registrasi")).data;

        // Misalkan jenisRegisData.values[0] adalah array yang ingin Anda hitung jumlahnya
        const array_values = jenisRegisData.values[0];

        // Menghitung jumlah dari semua angka dalam array menggunakan reduce
        igd_count.value = array_values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        inap.value = jenisRegisData.values[2].reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        jalan.value = jenisRegisData.values[3].reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        console.log("Jumlah total dari semua angka:", igd_count);

    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
});

const products = ref([]);
const columns = [
    { field: 'regis', header: '' },
    { field: 'Dalam RS', header: 'Dalam RS' },
    { field: 'Inisiatif Sendiri', header: 'Inisiatif Sendiri' },
    { field: 'Luar RS', header: 'Luar RS' }
];

onMounted(async () => {
    try {
        const data = (await axios.get("http://localhost:5000/api/regis-byRujukan")).data

        // Reformat data
        const reformattedData = [];
        for (const key in data) {
            const row = { regis: key };
            data[key].forEach(item => {
                row[item.rujukan] = item.kunjungan;
            });
            reformattedData.push(row);
        }

        products.value = reformattedData;
    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
});

onMounted(async () => {
  const response = await axios.get('http://localhost:5000/api/instansi', {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  });
  const data = response.data;

  const limitedData = {
    index: data.index.slice(0, 5),
    values: data.values.slice(0, 5)
  };

  const dataValues = limitedData.values;

  // Mencari index dari nilai tertinggi
  const maxIndex = dataValues.indexOf(Math.max(...dataValues));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  // Proses data untuk format grafik batang
  instansiChartData.value = {
    labels: limitedData.index,
    datasets: [
      {
        label: 'Jumlah',
        data: limitedData.values,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
});

watch(lastFilter, async () => {
  const response = await axios.get('http://localhost:5000/api/instansi', {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  });
  const data = response.data;

  const limitedData = {
    index: data.index.slice(0, 5),
    values: data.values.slice(0, 5)
  };

  const dataValues = limitedData.values;

  // Mencari index dari nilai tertinggi
  const maxIndex = dataValues.indexOf(Math.max(...dataValues));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  // Proses data untuk format grafik batang
  instansiChartData.value = {
    labels: limitedData.index,
    datasets: [
      {
        label: 'Jumlah',
        data: limitedData.values,
        borderWidth: 1, // Lebar garis batas
        backgroundColor: backgroundColors
      }
    ]
  };
})
</script>

<style scoped lang="scss">
.grid-item-chart {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 3fr;

    .item-2 {
      gap: 8px;
      width: 100%;
    }

    &__item3 {
        grid-row: 2/3;
    }

    &__item4 {
        grid-row: 2/3;
    }

    &__item5 {
        grid-row: 3/4;
        grid-column: 1/3;
    }
}
</style>
