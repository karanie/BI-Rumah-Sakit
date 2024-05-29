<template>
  <BIChart src="/api/kunjungan" tipeData="pertumbuhan" timeseries type="line" >
    <template #title>Pertumbuhan Kunjungan Per tahun</template>
  </BIChart>

  <BIChart src="/api/kunjungan" tipeData="poliklinik" :chartOpt="{ indexAxis: 'y' }" type="bar" :setChartData="setTop10Color">
    <template #title>10 Poliklinik Terfavorit untuk Pasien Rawat Jalan</template>
  </BIChart>

  <BIChart src="/api/kunjungan" tipeData="gejala" :chartOpt="{ indexAxis: 'y' }" :setChartData="setTop10Color" type="bar">
    <template #title>10 Penyakit Terbanyak</template>
  </BIChart>

  <BIChart src="/api/kunjungan" tipeData="jenis_registrasi" timeseries type="line" forecast :setChartData="setPendapatanName">
    <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Registrasi</template>
  </BIChart>

  <BIChart src="/api/kunjungan" tipeData="rujukan" timeseries type="line" :setChartData="setPendapatanName">
    <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Rujukan</template>
  </BIChart>

  <div class="grid-container">
      <div class="grid-item-chart">
          <div class="grid-item-chart__item1">
              <BIChart src="/api/kunjungan"
               timeseries tipeData="pertumbuhanPertahun" type="bar" :setChartData="setKunjunganBarChartData"
                  style="height: 100%;">
                  <template #title>Jumlah Kunjungan Setiap Tahun</template>
              </BIChart>
          </div>

          <div class="grid-item-chart__item2">
            <BIChart src="/api/kunjungan" tipeData="usia" timeseries  style="height: 100%" type="line" :setChartData="processChartData">
              <template #title>Distribusi Kelompok Usia dan Pertumbuhan Kunjungan</template>
            </BIChart>
          </div>

          <div class="grid-item-chart__item3">
              <BIChart src="/api/kunjungan" tipeData="penjamin" :chartOpt="generateChartOption('percent')" type="doughnut" style="height: 100%;">
                  <template #title>Distribusi Jenis Penjamin</template>
              </BIChart>
          </div>

          <div class="grid-item-chart__item4">
              <Card style="height:100%">
                <template #title>Jumlah Kunjungan Berdasarkan Jenis Registrasi dan Rujukan</template>
                  <template #content>
                    <Skeleton v-if='tableDataIsPending' height="8rem" />
                        <DataTable v-else :value="products">
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
                              <span class="accordion">
                                  <Icon style="font-size: 2.5rem; margin-right: 10px" color="var(--surface-400)"
                                      name="material-symbols:e911-emergency-rounded" />
                                  <span class="font-bold white-space-nowrap" style="margin-right: 10px;">IGD</span>
                                  <ProgressSpinner v-if="jenisRegisDataPending" style="width: 25px; height: 25px" strokeWidth="8" fill="var(--surface-ground)"
            animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                                  <Badge v-else :value="igd_count" class="ml-auto mr-2" />
                              </span>
                          </template>
                          <DetailKunjungan src="/api/kunjungan" tipeData="diagnosa" jenisRegis="IGD" >
                              <template #title>Diagnosa Penyakit IGD</template>
                          </DetailKunjungan>

                      </AccordionTab>

                      <AccordionTab>
                          <template #header>
                              <span class="accordion">
                                  <Icon style="font-size: 2.5rem; margin-right: 10px;" color="var(--surface-400)"
                                      name="material-symbols:outpatient-rounded" />
                                  <span class="font-bold white-space-nowrap" style="margin-right: 10px;">Rawat
                                      Jalan</span>
                                      <ProgressSpinner v-if="jenisRegisDataPending" style="width: 25px; height: 25px" strokeWidth="8" fill="var(--surface-ground)"
            animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                                  <Badge v-else :value="rawatJalan_count" class="ml-auto mr-2" />
                              </span>
                          </template>
                          <DetailKunjungan src="/api/departemen" tipeData="diagnosa" jenisRegis="Rawat Jalan" rawatJalan>
                              <template #title>Poliklinik Rawat Jalan</template>
                          </DetailKunjungan>
                      </AccordionTab>

                      <AccordionTab>
                          <template #header>
                              <span class="accordion">
                                  <Icon style="font-size: 2.5rem; margin-right: 10px;" color="var(--surface-400)"
                                      name="material-symbols:inpatient-rounded" />
                                  <span class="font-bold white-space-nowrap" style="margin-right: 10px;">Rawat
                                      Inap</span>
                                      <ProgressSpinner v-if="jenisRegisDataPending" style="width: 25px; height: 25px" strokeWidth="8" fill="var(--surface-ground)"
            animationDuration=".5s" aria-label="Custom ProgressSpinner" />
                                  <Badge v-else :value="inap_count" class="ml-auto mr-2" />
                              </span>
                          </template>

                          <DetailKunjungan src="/api/kunjungan" tipeData="diagnosa" jenisRegis="Rawat Inap" timeseries>
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
  tahun,
  bulan,
  lastFilter,
  kabupaten,
  selectedBulan
} = storeToRefs(useDataFilter())


function setTop10Color(data) {

  // Mencari index dari nilai tertinggi
  const maxIndex = data.values.indexOf(Math.max(...data.values));

  // Membuat array warna, defaultnya semua warna sama
  const backgroundColors = new Array(data.values.length).fill('rgba(54, 162, 235, 0.5)');

  // Mengubah warna untuk bar dengan nilai tertinggi
  backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

  return {
      labels: data.index,
      datasets: [
          {
              label: "Jumlah Kunjungan",
              data: data.values,
              backgroundColor: backgroundColors
          },
      ],
  };
}

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
  const mapLabelColor = [
    documentStyle.getPropertyValue('--cyan-500'),
    documentStyle.getPropertyValue('--orange-500'),
    documentStyle.getPropertyValue('--gray-500'),
    documentStyle.getPropertyValue('--indigo-500'),
    documentStyle.getPropertyValue('--teal-500')
  ];

  const out = {
    labels: data.index,
    datasets: data.columns.map((col, idx) => {
      return {
        label: mapLabelName[col],
        data: data.values[idx],
        backgroundColor: mapLabelColor[idx],
        borderColor: mapLabelColor[idx],
        hoverBackgroundColor: [documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--pink-400')],
        fill: false,
        tension: 0.4,
        type: "line"
      }
    })
  }
  return out
};


const setKunjunganBarChartData = (data) => {
    // Mencari index dari nilai tertinggi
    const maxIndex = data.values.indexOf(Math.max(...data.values));

    // Membuat array warna, defaultnya semua warna sama
    const backgroundColors = new Array(data.values.length).fill('rgba(54, 162, 235, 0.5)');

    // Mengubah warna untuk bar dengan nilai tertinggi
    backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

    return {
        labels: data.index,
        datasets: [
            {
                label: "Jumlah Kunjungan",
                data: data.values,
                backgroundColor: backgroundColors
            },
        ],
    };
}

const igd_count = ref();
const inap_count = ref();
const rawatJalan_count = ref();

const {
  pending: jenisRegisDataPending,
} = await useFetch("http://localhost:5000/api/kunjungan", {
  server: false,
  lazy: true,
  params: {
    tipe_data: "jumlahJenis_registrasi",
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  onResponse({ response }) {
    igd_count.value = response._data.values[0]
    inap_count.value = response._data.values[2]
    rawatJalan_count.value = response._data.values[3]
    }
})


const products = ref([]);
const columns = [
    { field: 'regis', header: '' },
    { field: 'Dalam RS', header: 'Dalam RS' },
    { field: 'Inisiatif Sendiri', header: 'Inisiatif Sendiri' },
    { field: 'Luar RS', header: 'Luar RS' }
];

const {
  pending: tableDataIsPending,
} = await useFetch("http://localhost:5000/api/kunjungan", {
  server: false,
  lazy: true,
  params: {
    tipe_data: "regis-byRujukan",
    kabupaten: kabupaten,
    tahun: tahun,
    bulan: bulan
  },
  onResponse({ response }) {
        // Reformat data
        const reformattedData = [];
        for (const key in response._data) {
            const row = { regis: key };
            response._data[key].forEach(item => {
                row[item.rujukan] = item.kunjungan;
            });
            reformattedData.push(row);
        }

        products.value = reformattedData;
    }
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

.accordion{
  display: flex;
  align-items: center;
}
</style>
