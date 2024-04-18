<template>
    <div class="grid-container">
        <div class="grid-item-chart">
            <div class="grid-item-chart__item1">
                <Card style="height:100%">
                    <template #title>Jumlah Kunjungan Setiap Tahun</template>
                    <template #content>
                        <Chart type="bar" :data="kunjunganBarChartData" />
                    </template>
                </Card>
            </div>

            <div class="grid-item-chart__item2">
                <Card style="height: 100%;">
                    <template #title>Distribusi Kelompok Usia dan Pertumbuhan Kunjungan</template>
                    <template #content>
                        <Chart  :data="lineChartData"/>
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
                                    <div class="grid-igd">
                                        <div class="grid-igd__item1">
                                            <DataTable :value="diagnosis" @row-select="onRowClick"
                                                selectionMode="single" :selection="selectedRow">
                                                <Column v-for="col of kolom" :key="col.field" :field="col.field"
                                                    >
                                                    <template #body="scope">
                                                        <div class="row-clickable">
                                                            {{ scope.data[col.field] ? scope.data[col.field] : '-' }}
                                                        </div>
                                                    </template>
                                                </Column>
                                            </DataTable>
                                        </div>

                                        <div class="grid-igd__item2">
                                            <p class="__1">2024 | Deskripsi</p>

                                            <h2 class="__2">{{ count_di_igd }} kasus</h2>

                                            <Knob class="__3" v-model="value" valueTemplate="{value}%" />

                                            <div class="__4">
                                                <template v-if="statusDis === 'naik'">
                                                    <div style="display: flex; align-items: center;">
                                                        <Icon style="font-size: 1.5rem; margin-right: 5px" color="var(--red-400)"
                                                            name="material-symbols:arrow-upward-rounded" />
                                                        <p>{{ statusDis }} {{ percentDis }} % dari tahun lalu</p>
                                                    </div>
                                                </template>
                                                <template v-else-if="statusDis === 'turun'">
                                                    <div style="display: flex; align-items: center;">
                                                        <Icon style="font-size: 1.5rem; margin-right: 5px" color="var(--green-400)"
                                                            name="material-symbols:arrow-downward-rounded" />
                                                        <p>{{ statusDis }} {{ percentDis }} % dari tahun lalu</p>
                                                    </div>
                                                </template>
                                            </div>

                                            <div class="__5">
                                                <div style="display: flex; align-items: center;">
                                                    <Icon style="font-size: 1.5rem; margin-right: 5px"
                                                        color="var(--surface-400)"
                                                        name="material-symbols:info-rounded" />
                                                    <p>Didominasi kalangan ... (... tahun)</p>
                                                </div>
                                            </div>

                                            <div class="__6">
                                                <div style="display: flex; align-items: center;">
                                                    <Icon style="font-size: 1.5rem; margin-right: 5px"
                                                        color="var(--surface-400)"
                                                        name="material-symbols:show-chart-rounded" />
                                                    <p>Pertumbuhan Diagnosa Ini Selama 5 Tahun Terakhir :</p>
                                                </div>
                                                <Chart type="line" :data="currentLast5years_barChartData" />
                                            </div>
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
                            <div class="grid-rajal">

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
                            <div class="grid-ranap">

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

const {
    bulan,
    tahun,
    kabupaten,
    lastFilter,
} = storeToRefs(useDataFilter());

const capitalizeEachLetter = (string) => {
    return string.replace(/\b\w/g, match => match.toUpperCase());
};

const kunjunganBarChartData = ref();
const lineChartData = ref();

// KUNJUNGAN TAHUNAN BY JENIS REGISTRASI
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

// KUNJUNGAN BY KELOMPOK USIA
onMounted(async () => {
    try {
        const data = (await axios.get("http://localhost:5000/api/usia")).data

        lineChartData.value = setLineChartData(data)

    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
});

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


// TAB KUNJUNGAN DETAIL BERDASARKAN JENIS REGIS
const diagnosis = ref([]);

var count_di_igd = ref(0);
var count_di1_igd = ref(0);

const condition = ref(null);

const kolom = [
    { field: 'id', header: '' }
];

// Data dari respons API
let responseData = [];
let resposenDataBefore = ref([]);
var selectedRow = ref(null);

const total = ref(0);
let totalCalculated = false;

const selected_dis = ref();

// const value = ref(60);
const value = computed(() => Math.round(count_di_igd.value / total.value * 100));

const percentDis_selected = computed(() => Math.round((count_di_igd.value - count_di1_igd) / count_di1_igd * 100))
const statusDis = ref(null);
const percentDis = ref(0);

const currentLast5years_barChartData = ref();

const onRowClick = async (rowData) => {
    // Set nilai selected_dis berdasarkan baris yang diklik
    selected_dis.value = rowData.data.id;

    // Pastikan selected_dis tidak null atau undefined
    if (selected_dis.value) {
        try {
            // Lakukan permintaan API dengan nilai selected_dis sebagai parameter
            const response = await axios.get('http://localhost:5000/api/diagnosis', {
                params: {
                    tahun: 2024,
                    jenisregistrasi: 'IGD',
                    diagnosa: selected_dis.value
                }
            });

            // Proses respons API
            resposenDataBefore.value = response.data;

            currentLast5years_barChartData.value = last5y_BarChartData(response.data)

            selectedRow = rowData.data

            // Lakukan tindakan lain berdasarkan data yang diterima
            console.log('Data yang dipilih:', responseData.values[rowData.index]);
            console.log('select row id', rowData.data.id);
            count_di_igd.value = responseData.values[rowData.index];
            count_di1_igd = resposenDataBefore.value.count_disease_prev_year

            // SSS

            // Lakukan tindakan lain yang diperlukan
            console.log('hasil hitung diagnosa terpilih', count_di1_igd);
            console.log('hasil mutlak', Math.abs(percentDis_selected.value))
            // if <0 pakai abs, dan keterangan turun
            if (percentDis_selected.value < 0) {
                statusDis.value = 'turun';
                percentDis.value = Math.abs(percentDis_selected.value)
            } else {
                statusDis.value = 'naik';
                percentDis.value = Math.abs(percentDis_selected.value)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    } else {
        console.warn('Selected diagnosis is not available.');
    }
};

// DATA KUNJUNGAN IGD



onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/diagnosis', {
            params: {
                tahun: 2024,
                bulan: bulan.value,
                jenisregistrasi: 'IGD',
            }
        });
        // const data = response.data;
        responseData = response.data;

        count_di_igd.value = responseData.values[0];

        if (!totalCalculated) {
            // Jika belum dihitung, hitung total
            for (const item of responseData.values) {
                total.value += item;
            }
            // Set totalCalculated menjadi true agar tidak menghitung lagi
            totalCalculated = true;
        }

        // Reformat data
        const reformattedData = [];
        const data_filter = responseData.id.slice(0, 10);
        console.log("hasil", data_filter);
        for (const key in data_filter) {
            const row = { id: data_filter[key] };
            reformattedData.push(row);
        }

        diagnosis.value = reformattedData;

        selectedRow = diagnosis.value[0]; // Atur baris pertama sebagai baris terpilih secara default

    } catch (error) {
        console.error('Error fetching data from API:', error);
    }
});


const last5y_BarChartData = (apiData) => {
    const documentStyle = getComputedStyle(document.body);
    const dataValues = Object.values(apiData.last5years);

    return {
        labels: Object.keys(apiData.last5years),
        datasets: [
            {
                label: "Jumlah Kunjungan",
                data: dataValues,
            },
        ],
    };
}



</script>

<style scoped lang="scss">
.grid-item-chart {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 3fr;

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

.grid-igd {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 2fr 3fr;

    &__item1 {
        grid-row: 1/2;
        grid-column: 1/2;
    }

    &__item2 {
        // grid-row: 1/2;
        // grid-column: 2/3;

        // .count {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        align-items: center;
        height: fit-content;
        // }

        .__1 {
            grid-row: 1/2;
            margin: 0;
        }

        .__2 {
            grid-row: 2/3;
        }

        .__3 {
            grid-row: 2/3;
        }

        .__4 {
            grid-row: 4/5;
            grid-column: 1/3;
        }

        .__5 {
            grid-row: 5/6;
            grid-column: 1/3;
        }

        .__6 {
            grid-row: 6/7;
            grid-column: 1/3;
        }
    }
}

.grid-rajal {
    display: grid;
    grid-gap: 20px;
    // grid-template-columns: 1fr 2fr;

    &__item1 {
        grid-row: 1/2;
        grid-column: 1/2;
    }

    &__item2 {
        grid-row: 1/2;
        grid-column: 1/3;
    }

    &__item3 {
        grid-row: 1/2;
        grid-column: 3/4
    }
}

.grid-ranap {
    display: grid;
    grid-gap: 20px;
    // grid-template-columns: 1fr 2fr;

    &__item1 {
        grid-row: 1/2;
        grid-column: 1/2;
    }

    &__item2 {
        grid-row: 1/3;
        grid-column: 1/3;
    }

    &__item3 {
        grid-row: 1/3;
        grid-column: 3/4
    }
}
</style>