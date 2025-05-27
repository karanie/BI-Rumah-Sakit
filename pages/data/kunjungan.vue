<template>
  <div class="kunjungan">
    <div class="kunjungan-row">
      <BIChart
        style="width: 100%; flex: 1"
        chartWidth="400px"
        src="/api/kunjungan"
        timeseries
        tipeData="pertumbuhanPertahun"
        type="bar"
        :setChartData="setKunjunganBarChartData"
        :chartOpt="generateChartOption()"
        listenUpdate>
        <template #title>Jumlah Kunjungan Pasien Setiap Tahun</template>
      </BIChart>

      <BIChart
        style="width: 100%; flex: 2"
        src="/api/kunjungan"
        tipeData="pertumbuhan"
        timeseries
        type="line"
        :chartOpt="generateChartOption()"
        listenUpdate>
        <template #title>Pertumbuhan Kunjungan Seiring Waktu</template>
      </BIChart>
    </div>

    <div class="kunjungan-row">
      <BIChart
        style="width: 100%; flex: 1"
        src="/api/kunjungan"
        tipeData="penjamin"
        :chartOpt="generateChartOption('percent')"
        type="doughnut"
        listenUpdate>
        <template #title>Distribusi Kunjungan Berdasarkan Jenis Penjamin</template>
        <template #subtitle>
          <div style="display: flex; align-items: center;">
            <Icon style="font-size: 1.5rem;" color="var(--surface-400)" name="material-symbols:filter-alt-outline" />
            {{ getBulanOrTahun() }}
          </div>
        </template>
      </BIChart>

      <BIChart
        style="width: 100%; flex: 2"
        src="/api/kunjungan"
        tipeData="usia"
        timeseries
        type="line"
        :setChartData="processChartData"
        :chartOpt="generateChartOption()"
        listenUpdate>
        <template #title>Distribusi Kunjungan Berdasarkan Kelompok Usia</template>
      </BIChart>
    </div>

    <BIChart
      src="/api/kunjungan"
      tipeData="jenis_registrasi"
      timeseries
      type="line"
      forecast
      :chartOpt="generateChartOption()"
      listenUpdate>
      <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Registrasi</template>
    </BIChart>

    <Card style="height:100%">
      <template #title>Jumlah Kunjungan Berdasarkan Jenis Registrasi dan Rujukan</template>
      <template #subtitle>
        <div style="display: flex; align-items: center;">
          <Icon style="font-size: 1.5rem;" color="var(--surface-400)" name="material-symbols:filter-alt-outline" />
          {{ getBulanOrTahun() }}
        </div>
      </template>
      <template #content>
        <Skeleton v-if='tableDataIsPending && !products' height="8rem" />
        <DataTable v-else :value="products">
          <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
            <template #body="scope">
              {{ scope.data[col.field] ? scope.data[col.field] : '-' }}
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <div class="card">
      <Accordion expandIcon="pi pi-plus" collapseIcon="pi pi-minus" :lazy="true">
        <AccordionTab>
          <template #header>
            <span class="accordion">
              <Icon style="font-size: 2.5rem; margin-right: 10px" color="var(--surface-400)"
                name="material-symbols:e911-emergency-rounded" />
              <span class="font-bold white-space-nowrap" style="margin-right: 10px;">IGD</span>
              <ProgressSpinner v-if="jenisRegisDataPending && !igd_count" style="width: 25px; height: 25px" strokeWidth="8"
                fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
              <Badge v-else :value="igd_count" class="ml-auto mr-2" />
            </span>
          </template>
          <DetailKunjungan src="/api/kunjungan" tipeData="diagnosa" jenisRegis="IGD">
            <template #title>Diagnosa Penyakit di IGD</template>
          </DetailKunjungan>

        </AccordionTab>

        <AccordionTab>
          <template #header>
            <span class="accordion">
              <Icon style="font-size: 2.5rem; margin-right: 10px;" color="var(--surface-400)"
                name="material-symbols:outpatient-rounded" />
              <span class="font-bold white-space-nowrap" style="margin-right: 10px;">Rawat
                Jalan</span>
              <ProgressSpinner v-if="jenisRegisDataPending && !rawatJalan_count" style="width: 25px; height: 25px" strokeWidth="8"
                fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
              <Badge v-else :value="rawatJalan_count" class="ml-auto mr-2" />
            </span>
          </template>
          <DetailKunjungan src="/api/kunjungan" tipeData="departemen" jenisRegis="Rawat Jalan" rawatJalan>
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
              <ProgressSpinner v-if="jenisRegisDataPending && !inap_count" style="width: 25px; height: 25px" strokeWidth="8"
                fill="var(--surface-ground)" animationDuration=".5s" aria-label="Custom ProgressSpinner" />
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
  refresh: jenisRegisDataRefresh,
} = await useFetch("/api/kunjungan", {
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
  refresh: tableDataRefresh,
} = await useFetch("/api/kunjungan", {
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
  const response = await axios.get('/api/instansi', {
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

function getBulanOrTahun() {
  if (!tahun.value) {
    return "Semua Periode"
  } else {
    if (!bulan.value) {
      return tahun.value;
    }
    else {
      return selectedBulan.value.name + " " + tahun.value
    }
  }
}

const { update } = storeToRefs(useDataUpdate());
watch(update, () => {
  tableDataRefresh();
  jenisRegisDataRefresh();
});
</script>

<style scoped lang="scss">
.kunjungan {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &-row {
    display: flex;
    flex-direction: row;
    gap: 16px;
    width: 100%;
  }
}

.accordion {
  display: flex;
  align-items: center;
}
</style>
