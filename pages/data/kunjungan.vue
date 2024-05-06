<template>
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
                        <DataTable :value="data_kunjungan_byRegisRujukan">
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

const capitalizeEachLetter = (string) => {
    return string.replace(/\b\w/g, match => match.toUpperCase());
};

const igd_count = ref(0);
const inap = ref(0);
const jalan = ref(0);

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

const data_kunjungan_byRegisRujukan = ref([]);
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

        data_kunjungan_byRegisRujukan.value = reformattedData;
    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
});
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