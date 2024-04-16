<template>
    <div class="grid-container">
        <div class="grid-item-chart">
            <div class="grid-item-chart__item1">
                <Card>
                    <template #title>Perkembangan Jumlah Kunjungan Setiap Tahun</template>
                    <template #subtitle>Jumlah Kunjungan baru setiap tahun, hal ini berdasarkan waktu registrasi
                        pertama.</template>
                    <template #content>
                        <Chart type="bar" :data="kunjunganBarChartData" />
                    </template>
                </Card>
            </div>

            <div class="grid-item-chart__item2">
                <Card style="height: 100%;">
                    <template #title>Grafik Distribusi Kelompok Usia dan Pertumbuhan Kunjungan</template>
                    <template #content>
                        <Chart :type="chartType" :data="chartData" />
                    </template>
                </Card>
            </div>

            <div class="grid-item-chart__item3">
                <Card>
                    <template #title>Distribusi Jenis Penjamin</template>
                    <template #content>
                        <div style="width: 100%; display: flex; justify-content: center;">
                            <Chart type="doughnut" :data="penjaminBarChartData" />
                        </div>
                    </template>
                </Card>
            </div>

            <div class="grid-item-chart__item4">
                <Card style="height:100%">
                    <template #content>
                        <DataTable :value="products" @row-click="onRowClick">
                            <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
                                <!-- <template #body="scope">
                                    {{ scope.data[col.field] ? scope.data[col.field] : '-' }}
                                </template> -->

                                <template #body="scope">
                                    <div class="row-clickable" @click="onRowClick(scope.data)">
                                        {{ scope.data[col.field] ? scope.data[col.field] : '-' }}
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                    </template>
                </Card>
            </div>

            <div class="grid-item-chart__item5">
                <div class="card">
                    <Accordion expandIcon="pi pi-plus" collapseIcon="pi pi-minus">
                        <AccordionTab>
                            <template #header>
                                <span class="flex align-items-center gap-2 w-full">
                                    <Icon style="font-size: 2.5rem;" color="var(--surface-400)"
                                        name="material-symbols:e911-emergency-rounded" />
                                    <span class="font-bold white-space-nowrap">IGD</span>
                                    <Badge :value="igd_count" class="ml-auto mr-2" />
                                </span>
                            </template>
                            <Card>
                                <template #title>Top 10 Diagnosis di IGD</template>
                                <template #content>
                                    <div class="grid-igd-item">
                                        <DataTable :value="diagnosis" @row-click="onRowClick">
                                            <Column v-for="col of kolom" :key="col.field" :field="col.field"
                                                :header="col.header">
                                                <template #body="scope">
                                                    <div class="row-clickable" @click="onRowClick(scope.data)">
                                                        {{ scope.data[col.field] ? scope.data[col.field] : '-' }}
                                                    </div>
                                                </template>
                                            </Column>
                                        </DataTable>

                                        <div class="card flex justify-content-center">
                                            <Knob v-model="value" valueTemplate="{value}%" />
                                        </div>
                                    </div>
                                </template>
                            </Card>

                        </AccordionTab>

                        <AccordionTab>
                            <template #header>
                                <span class="flex align-items-center gap-2 w-full">
                                    <Icon style="font-size: 2.5rem;" color="var(--surface-400)"
                                        name="material-symbols:outpatient-rounded" />
                                    <span class="font-bold white-space-nowrap">Rawat Jalan</span>
                                    <Badge :value="jalan" class="ml-auto mr-2" />
                                </span>
                            </template>
                            <div class="grid-rajal-item">
                                <div class="grid-rajal-item__item1">
                                    <Card>
                                        <template #title>Distribusi Jenis Penjamin</template>
                                        <template #content>
                                            <Chart type="doughnut" :data="penjaminBarChartData" />
                                        </template>
                                    </Card>
                                </div>

                                <div class="grid-rajal-item__item2">
                                    <Card>
                                        <template #title>10 Penyakit Terbanyak</template>
                                        <template #content>
                                            <Chart type="bar" :options="{ indexAxis: 'y' }" :data="penyakitChartData" />
                                        </template>
                                    </Card>
                                </div>
                            </div>
                        </AccordionTab>

                        <AccordionTab>
                            <template #header>
                                <span class="flex align-items-center gap-2 w-full">
                                    <Icon style="font-size: 2.5rem;" color="var(--surface-400)"
                                        name="material-symbols:inpatient-rounded" />
                                    <span class="font-bold white-space-nowrap">Rawat Inap</span>
                                    <Badge :value="inap" class="ml-auto mr-2" />
                                </span>
                            </template>
                            <div class="grid-ranap-item">
                                <div class="grid-ranap-item__item1">
                                    <Card>
                                        <template #title>Distribusi Jenis Penjamin</template>
                                        <template #content>
                                            <Chart type="doughnut" :data="penjaminBarChartData" />
                                        </template>
                                    </Card>
                                </div>

                                <div class="grid-ranap-item__item2">
                                    <Card>
                                        <template #title>10 Penyakit Terbanyak</template>
                                        <template #content>
                                            <Chart type="bar" :options="{ indexAxis: 'y' }" :data="penyakitChartData" />
                                        </template>
                                    </Card>
                                </div>
                            </div>
                        </AccordionTab>
                    </Accordion>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>

import Chart from 'primevue/chart';
import axios from 'axios';

definePageMeta({
    layout: "data",
});

const value = ref(60);

const capitalizeEachLetter = (string) => {
    return string.replace(/\b\w/g, match => match.toUpperCase());
};

// const onRowClick = (event) => {
//     // Mendapatkan data yang diklik
//     const rowData = event.data;
//     console.log("Data yang diklik:", rowData);

//     // Menentukan indeks baris yang diklik
//     const rowIndex = products.value.indexOf(rowData);
//     console.log("Index baris yang diklik:", rowIndex);
// };

// Fungsi untuk menangani klik pada baris
const onRowClick = (rowData) => {
    // Lakukan sesuatu saat baris diklik
    console.log('Baris yang diklik:', rowData);
};

const {
    bulan,
    tahun,
    kabupaten,
    lastFilter,
} = storeToRefs(useDataFilter());

const kunjunganBarChartData = ref();
const lineChartData = ref();
const penyakitChartData = ref();

onMounted(async () => {
    try {
        const data = (await axios.get("http://localhost:5000/api/usia")).data

        // Proses data API untuk digunakan dalam pembuatan Pie Chart
        lineChartData.value = setLineChartData(data)
        // console.log("hasil : ",data.jumlah_pasien)
    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
});

onMounted(async () => {
    const data = (await axios.get("http://localhost:5000/api/dashboard", {
        params: {
            tahun: tahun.value,
            bulan: bulan.value,
            kabupaten: kabupaten.value,
        }
    })).data
    //   jumlahKunjungan.value = data.jumlahKunjungan;
    kunjunganBarChartData.value = setKunjunganBarChartData(data)
});

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

const setLineChartData = (apiData) => {
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

const chartType = 'bar'; // Tipe chart default untuk jenis registrasi
const chartData = ref(); // Data untuk chart


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

onMounted(async () => {
    try {
        const usiaData = (await axios.get("http://localhost:5000/api/usia")).data;
        const jenisRegisData = (await axios.get("http://localhost:5000/api/jenis_registrasi")).data;

        const lineChartData = setLineChartData(usiaData); // Data untuk line chart

        const barChartData = {
            labels: jenisRegisData.index,
            datasets: jenisRegisData.columns.map((val, i) => {
                return {
                    label: val,
                    data: jenisRegisData.values[i],
                };
            })
        };

        chartData.value = {
            labels: lineChartData.labels,
            datasets: [
                ...lineChartData.datasets, // Dataset untuk line chart
                ...barChartData.datasets // Dataset untuk bar chart
            ]
        };
    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
});

const penjaminBarChartData = ref(null);

onMounted(async () => {
    const response = await axios.get('http://localhost:5000/api/penjamin', {
        params: {
            tahun: tahun.value,
            bulan: bulan.value,
            kabupaten: kabupaten.value,
        }
    });
    const data = response.data;

    // Proses data untuk format grafik batang
    penjaminBarChartData.value = {
        labels: data.index,
        datasets: [
            {
                label: 'Jumlah',
                data: data.values,
                borderWidth: 1 // Lebar garis batas
            }
        ]
    };
});

watch(lastFilter, async () => {
    const response = await axios.get('http://localhost:5000/api/penjamin', {
        params: {
            tahun: tahun.value,
        }
    });
    const data = response.data;

    // Proses data untuk format grafik batang
    penjaminBarChartData.value = {
        labels: data.index,
        datasets: [
            {
                label: 'Jumlah',
                data: data.values,
                borderWidth: 1 // Lebar garis batas
            }
        ]
    };
})

// const products = ref([
//     { code: '001', name: 'Product A', category: 'Category 1', quantity: 10 },
//     { code: '002', name: 'Product B', category: 'Category 2', quantity: 20 },
//     { code: '003', name: 'Product C', category: 'Category 1', quantity: 15 },
//     // Add more products here if needed
// ]);

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

const diagnosis = ref([]);
const kolom = [
    { field: 'index', header: '' }
];

onMounted(async () => {
    try {
        const data = (await axios.get("http://localhost:5000/api/gejala")).data

        // Reformat data
        const reformattedData = [];
        const data_filter = data.index.slice(0,10);
        console.log("hasil", data_filter);
        for (const key in data_filter) {
            const row = { index : data_filter[key] };
            reformattedData.push(row);
        }

        diagnosis.value = reformattedData;
    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
});

onMounted(async () => {
    const response = await axios.get('http://localhost:5000/api/gejala', {
        params: {
            tahun: tahun.value,
            bulan: bulan.value,
            kabupaten: kabupaten.value,
        }
    });
    const data = response.data;

    const limitedData = {
        index: data.index.slice(0, 10),
        values: data.values.slice(0, 10),
    };

    // Misalkan limitedData.values berisi nilai-nilai data Anda
    const dataValues = limitedData.values;

    // Mencari index dari nilai tertinggi
    const maxIndex = dataValues.indexOf(Math.max(...dataValues));

    // Membuat array warna, defaultnya semua warna sama
    const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

    // Mengubah warna untuk bar dengan nilai tertinggi
    backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

    // Proses data untuk format grafik batang
    penyakitChartData.value = {
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
.grid-item-chart {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 3fr;

    &__item3 {
        grid-row: 2/3;
        // grid-column: 1/3;
    }

    &__item4 {
        grid-row: 2/3;
    }

    &__item5 {
        grid-row: 3/4;
        grid-column: 1/3;
    }
}

.grid-igd-item {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr 1fr;

    &__item1 {
        grid-row: 1/2;
        grid-column: 1/2;
    }

    &__item2 {
        grid-row: 2/3;
        grid-column: 1/3;
    }
}

.grid-rajal-item {
    display: grid;
    grid-gap: 20px;
    // grid-template-columns: 1fr 2fr;

    &__item1 {
        grid-row: 1/2;
        grid-column: 1/2;
    }

    &__item2 {
        grid-row: 2/3;
        grid-column: 1/3;
    }
}

.grid-ranap-item {
    display: grid;
    grid-gap: 20px;
    // grid-template-columns: 1fr 2fr;

    &__item1 {
        grid-row: 1/2;
        grid-column: 1/2;
    }

    &__item2 {
        grid-row: 2/3;
        grid-column: 1/3;
    }
}

.row-clickable {
    cursor: pointer;
}

.row-clickable:active {
    /* Efek yang ingin diterapkan saat baris diklik */
    background-color: gray;
}
</style>