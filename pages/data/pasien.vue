<template>
    <div class="grid">
        <div class="item-1">
            <Card class="card">
                <template #title>Total Pasien</template>
                <template #subtitle>Jumlah pasien dari tahun 2016-2021.</template>
                <template #content>
                    <b>{{ new Intl.NumberFormat().format(jumlah_pasien) }}</b>
                </template>
            </Card>
            <div class="perseberangender">
                <Card class="perseberangender__card">
                    <template #title>Pasien Laki-Laki</template>
                    <template #content>
                        <div class="value_column">
                            <Icon style="font-size: 3.5rem;" color="var(--blue-400)"
                                name="material-symbols:man-3-rounded" />
                            <div class="percentage_value">
                                <b class="percentage_value__count percentage_value__count--male">{{ getMaleCount }}</b>
                                <b class="percentage_value__percent">{{ getMalePercentage }}</b>
                            </div>
                        </div>
                    </template>
                </Card>

                <Card class="perseberangender__card">
                    <template #title>Pasien Perempuan</template>
                    <template #content>
                        <div class="value_column">
                            <Icon style="font-size: 3.5rem;" color="var(--red-400)"
                                name="material-symbols:woman-2-rounded" />
                            <div class="percentage_value">
                                <b class="percentage_value__count percentage_value__count--female">{{ getFemaleCount }}</b>
                                <b class="percentage_value__percent">{{ getFemalePercentage }}</b>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>



        </div>

        <div class="item-2">
            <Card class="card">
                <template #title>Perkembangan Jumlah Pasien Setiap Tahun</template>
                <template #subtitle>Jumlah pasien baru setiap tahun, hal ini berdasarkan waktu registrasi
                    pertama.</template>
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
                            }
                        }
                    }" :data="kelompokUsiaChartData" />
                </template>
            </Card>
            <Card>
                <template #title>10 Pekerjaan Terbanyak</template>
                <template #content>
                    <Chart type="bar" :options="{ indexAxis: 'y' }" :data="pekerjaanChartData" />
                </template>
            </Card>
        </div>

        <div class="item-4">
            <Card>
                <template #title>Distribusi Kelompok Usia Pasien Setiap Tahun</template>
                <template #subtitle>sepertinya lebih cocok untuk kunjungan ???</template>
                <template #content>
                    <Chart type="line" :data="lineChartData" />
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import Chart from 'primevue/chart';
import axios from 'axios';

const kelompokUsiaChartData = ref();
const lineChartData = ref();
const BarChartData = ref();
const jumlah_pasien = ref();
const pekerjaanChartData = ref();

const maleCount = ref(0);
const femaleCount = ref(0);

const getMaleCount = computed(() => new Intl.NumberFormat().format(maleCount.value));
const getMalePercentage = computed(() => Math.round(maleCount.value / (maleCount.value + femaleCount.value) * 100) + "%");
const getFemaleCount = computed(() => new Intl.NumberFormat().format(femaleCount.value));
const getFemalePercentage = computed(() => Math.round(femaleCount.value / (maleCount.value + femaleCount.value) * 100) + "%");

const {
    bulan,
    tahun,
    kabupaten,
    lastFilter,
} = storeToRefs(useDataFilter());

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

    // Proses data untuk format grafik batang
    pekerjaanChartData.value = {
        labels: limitedData.index,
        datasets: [
            {
                label: 'Jumlah',
                data: limitedData.values,
                borderWidth: 1, // Lebar garis batas
                backgroundColor: [
                    'rgba(95, 255, 132, 0.5)', // Warna untuk data pertama
                    'rgba(54, 162, 235, 0.5)', // Warna untuk data kedua dan seterusnya
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                ]
            }
        ]
    };
});

definePageMeta({
  layout: "data",
});

definePageMeta({
  layout: "data",
});

onMounted(async () => {
    try {
        const data = (await axios.get("http://localhost:5000/api/usia")).data

        // Proses data API untuk digunakan dalam pembuatan Pie Chart
        kelompokUsiaChartData.value = processChartData(data);
        lineChartData.value = setLineChartData(data)
        jumlah_pasien.value = data.jumlah_pasien
        BarChartData.value = setBarChartData(data)
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
        });
    }

    return {
        labels,
        datasets,
    };
};

</script>

<style scoped lang="scss">
.grid {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    gap: 20px;
}

.item-1 {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
}

.item-2 {
    grid-column: 2 / 3;
    grid-row: 1 / 3;
}

.item-3 {
    grid-column: 2 / 3;
    // grid-row: 2/3;
}

.item-4 {
    grid-column: 1 / 2;
    grid-row: 2 / 4;
}

.card{
    margin-bottom: 10px;
}

.perseberangender {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;

    &__card {
        width: 100%;
    }

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
