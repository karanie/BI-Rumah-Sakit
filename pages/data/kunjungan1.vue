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

            <div class="grid-item-chart__item3">
                <!-- <Card style="height: 100%;">
                    <template #title>Distribusi Kelompok Usia Pasien Setiap Tahun</template>
                    <template #content>
                        <Chart type="line" :data="lineChartData" />
                    </template>
                </Card> -->

                <Card>
                    <template #title>Distribusi Jenis Penjamin</template>
                    <template #content>
                        <div style="width: 100%; display: flex; justify-content: center;">
                            <Chart type="doughnut" :data="penjaminBarChartData" />
                        </div>
                    </template>
                </Card>


            </div>

            <div class="grid-item-chart__item2">
                <!-- <Card>
                    <template #title>Pertumbuhan Kunjungan Berdasarkan Jenis Registrasi</template>
                    <template #content>
                        <Skeleton height="8rem" v-if="jenisRegisDataIsPending" />
                        <Chart type="line" :data="jenisregisgrowthdata" v-if="!jenisRegisDataIsPending" />
                    </template>
                </Card> -->


                <Card style="height: 100%;">
                    <template #title>Grafik Distribusi Kelompok Usia dan Pertumbuhan Kunjungan</template>
                    <template #content>
                        <Chart :type="chartType" :data="chartData" />
                    </template>
                </Card>
            </div>

            <div class="grid-item-chart__item4">
                <Card style="height:100%">
                    <template #content>
                        <DataTable :value="products">
                            <Column field="code" header="Code"></Column>
                            <Column field="name" header="Name"></Column>
                            <Column field="category" header="Category"></Column>
                            <Column field="quantity" header="Quantity"></Column>
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
                                    <Badge value="3" class="ml-auto mr-2" />
                                </span>
                            </template>
                            <p class="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore
                                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                laboris nisi ut
                                aliquip ex ea commodo
                                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                                eu fugiat
                                nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                                officia deserunt
                                mollit anim id est laborum.
                            </p>
                        </AccordionTab>
                        <AccordionTab>
                            <template #header>
                                <span class="flex align-items-center gap-2 w-full">
                                    <Icon style="font-size: 2.5rem;" color="var(--surface-400)"
                                        name="material-symbols:outpatient-rounded" />
                                    <span class="font-bold white-space-nowrap">Rawat Jalan</span>
                                    <Badge value="4" class="ml-auto mr-2" />
                                </span>
                            </template>
                            <p class="m-0">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                                laudantium,
                                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
                                beatae vitae
                                dicta sunt explicabo. Nemo enim
                                ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                                magni
                                dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia
                                non numquam
                                eius modi.
                            </p>
                        </AccordionTab>
                        <AccordionTab>
                            <template #header>
                                <span class="flex align-items-center gap-2 w-full">
                                    <Icon style="font-size: 2.5rem;" color="var(--surface-400)"
                                        name="material-symbols:inpatient-rounded" />
                                    <span class="font-bold white-space-nowrap">Rawat Inap</span>
                                    <Badge value="2" class="ml-auto mr-2" />
                                </span>
                            </template>
                            <p class="m-0">
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
                                voluptatum
                                deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
                                cupiditate non
                                provident, similique sunt in culpa qui
                                officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum
                                facilis est
                                et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque
                                nihil impedit
                                quo minus.
                            </p>
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

const capitalizeEachLetter = (string) => {
    return string.replace(/\b\w/g, match => match.toUpperCase());
};

const {
    bulan,
    tahun,
    kabupaten,
    lastFilter,
} = storeToRefs(useDataFilter());

const kunjunganBarChartData = ref();
const lineChartData = ref();

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

const products = ref([
    { code: '001', name: 'Product A', category: 'Category 1', quantity: 10 },
    { code: '002', name: 'Product B', category: 'Category 2', quantity: 20 },
    { code: '003', name: 'Product C', category: 'Category 1', quantity: 15 },
    // Add more products here if needed
]);


</script>

<style scoped lang="scss">
.grid-item-chart {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 2fr;

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
</style>