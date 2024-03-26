<template>
    <div class="item-1">
        <Card class="card">
            <template #title>Total Pendapatan</template>
            <template #subtitle>Jumlah total tagihan dari tahun 2020-2024.</template>
            <template #content>
                <b class="big-number" style="color: rgb(70, 238, 70);">Rp{{ getJumlahPendapatan }}</b>
            </template>
        </Card>
        <Card class="card">
            <template #title>Total Pengeluaran</template>
            <template #subtitle>Jumlah modal HPP dari tahun 2020-2024.</template>
            <template #content>
                <b class="big-number" style="color: rgb(255, 75, 70);">Rp{{ getJumlahPengeluaran }}</b>
            </template>
        </Card>
    </div>
    <Card>
        <template #title>10 Pendapatan Tertinggi Berdasarkan Penyakit</template>
        <template #content>
            <Chart type="bar" :options="{ indexAxis: 'y' }" :data="penPenyakitChartData" />
        </template>
    </Card>
    <Card>
        <template #title>10 Pengeluaran Tertinggi Berdasarkan Penyakit</template>
        <template #content>
            <Chart type="bar" :options="{ indexAxis: 'y' }" :data="pengPenyakitChartData" />
        </template>
    </Card>

    <Card>
        <template #title>10 Pendapatan Tertinggi Berdasarkan Poliklinik</template>
        <template #content>
            <Chart type="bar" :options="{ indexAxis: 'y' }" :data="penPoliklinikChartData" />
        </template>
    </Card>
    <Card>
        <template #title>10 Pengeluaran Tertinggi Berdasarkan Poliklinik</template>
        <template #content>
            <Chart type="bar" :options="{ indexAxis: 'y' }" :data="pengPoliklinikChartData" />
        </template>
    </Card>
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

const penPenyakitChartData = ref();
const pengPenyakitChartData = ref();

const penPoliklinikChartData = ref();
const pengPoliklinikChartData = ref();

const jumlahPendapatan = ref();
const jumlahPengeluaran = ref();
const getJumlahPendapatan = computed(() => new Intl.NumberFormat().format(jumlahPendapatan.value));
const getJumlahPengeluaran = computed(() => new Intl.NumberFormat().format(jumlahPengeluaran.value));


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
        index: data.index1.slice(0, 10),
        index2: data.index2.slice(0, 10),
        valuesIn: data.pendapatan.slice(0, 10),
        valuesOut: data.pengeluaran.slice(0, 10),

    };

    // Misalkan limitedData.values berisi nilai-nilai data Anda
    const dataValues = limitedData.valuesIn;

    // Mencari index dari nilai tertinggi
    const maxIndex = dataValues.indexOf(Math.max(...dataValues));

    // Membuat array warna, defaultnya semua warna sama
    const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

    // Mengubah warna untuk bar dengan nilai tertinggi
    backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

    // Proses data untuk format grafik batang

    penPenyakitChartData.value = {
        labels: limitedData.index,
        datasets: [
            {
                label: 'Jumlah',
                data: limitedData.valuesIn,
                borderWidth: 1, // Lebar garis batas
                backgroundColor: backgroundColors
            }
        ]
    };
    pengPenyakitChartData.value = {
        labels: limitedData.index2,
        datasets: [
            {
                label: 'Jumlah',
                data: limitedData.valuesOut,
                borderWidth: 1, // Lebar garis batas
                backgroundColor: backgroundColors
            }
        ]
    };
});

watch(lastFilter, async () => {
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
        index2: data.index2.slice(0, 10),
        valuesIn: data.pendapatan.slice(0, 10),
        valuesOut: data.pengeluaran.slice(0, 10),

    };

    // Misalkan limitedData.values berisi nilai-nilai data Anda
    const dataValues = limitedData.valuesIn;

    // Mencari index dari nilai tertinggi
    const maxIndex = dataValues.indexOf(Math.max(...dataValues));

    // Membuat array warna, defaultnya semua warna sama
    const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

    // Mengubah warna untuk bar dengan nilai tertinggi
    backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

    // Proses data untuk format grafik batang

    penPenyakitChartData.value = {
        labels: limitedData.index,
        datasets: [
            {
                label: 'Jumlah',
                data: limitedData.valuesIn,
                borderWidth: 1, // Lebar garis batas
                backgroundColor: backgroundColors
            }
        ]
    };
    pengPenyakitChartData.value = {
        labels: limitedData.index2,
        datasets: [
            {
                label: 'Jumlah',
                data: limitedData.valuesOut,
                borderWidth: 1, // Lebar garis batas
                backgroundColor: backgroundColors
            }
        ]
    };
})

onMounted(async () => {
    const response = await axios.get('http://localhost:5000/api/poliklinik', {
        params: {
            tahun: tahun.value,
            bulan: bulan.value,
            kabupaten: kabupaten.value,
        }
    });
    const data = response.data;

    const limitedData = {
        index: data.index.slice(0, 10),
        index2: data.index2.slice(0, 10),
        valuesIn: data.pendapatan.slice(0, 10),
        valuesOut: data.pengeluaran.slice(0, 10),

    };

    // Misalkan limitedData.values berisi nilai-nilai data Anda
    const dataValues = limitedData.valuesIn;

    // Mencari index dari nilai tertinggi
    const maxIndex = dataValues.indexOf(Math.max(...dataValues));

    // Membuat array warna, defaultnya semua warna sama
    const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

    // Mengubah warna untuk bar dengan nilai tertinggi
    backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

    // Proses data untuk format grafik batang

    penPoliklinikChartData.value = {
        labels: limitedData.index,
        datasets: [
            {
                label: 'Jumlah',
                data: limitedData.valuesIn,
                borderWidth: 1, // Lebar garis batas
                backgroundColor: backgroundColors
            }
        ]
    };
    pengPoliklinikChartData.value = {
        labels: limitedData.index2,
        datasets: [
            {
                label: 'Jumlah',
                data: limitedData.valuesOut,
                borderWidth: 1, // Lebar garis batas
                backgroundColor: backgroundColors
            }
        ]
    };
});

watch(lastFilter, async () => {
    const response = await axios.get('http://localhost:5000/api/poliklinik', {
        params: {
            tahun: tahun.value,
            bulan: bulan.value,
            kabupaten: kabupaten.value,
        }
    });
    const data = response.data;

    const limitedData = {
        index: data.index.slice(0, 10),
        index2: data.index2.slice(0, 10),
        valuesIn: data.pendapatan.slice(0, 10),
        valuesOut: data.pengeluaran.slice(0, 10),

    };

    // Misalkan limitedData.values berisi nilai-nilai data Anda
    const dataValues = limitedData.valuesIn;

    // Mencari index dari nilai tertinggi
    const maxIndex = dataValues.indexOf(Math.max(...dataValues));

    // Membuat array warna, defaultnya semua warna sama
    const backgroundColors = new Array(dataValues.length).fill('rgba(54, 162, 235, 0.5)');

    // Mengubah warna untuk bar dengan nilai tertinggi
    backgroundColors[maxIndex] = 'rgba(95, 255, 132, 0.5)'; // Warna merah untuk menyoroti

    // Proses data untuk format grafik batang

    penPoliklinikChartData.value = {
        labels: limitedData.index,
        datasets: [
            {
                label: 'Jumlah',
                data: limitedData.valuesIn,
                borderWidth: 1, // Lebar garis batas
                backgroundColor: backgroundColors
            }
        ]
    };
    pengPoliklinikChartData.value = {
        labels: limitedData.index2,
        datasets: [
            {
                label: 'Jumlah',
                data: limitedData.valuesOut,
                borderWidth: 1, // Lebar garis batas
                backgroundColor: backgroundColors
            }
        ]
    };
})

onMounted(async () => {
    const data = (await axios.get("http://localhost:5000/api/dashboard", {
        params: {
            tahun: tahun.value,
            bulan: bulan.value,
            kabupaten: kabupaten.value,
        }
    })).data
    console.log(data);
    jumlahPendapatan.value = data.pendapatan;
    jumlahPengeluaran.value = data.pengeluaran;
});

watch(lastFilter, async () => {
    const data = (await axios.get("http://localhost:5000/api/dashboard", {
        params: {
            tahun: tahun.value,
            bulan: bulan.value,
            kabupaten: kabupaten.value,
        }
    })).data
    console.log(data);
    jumlahPendapatan.value = data.pendapatan;
    jumlahPengeluaran.value = data.pengeluaran;
})

</script>

<style scoped lang="scss">
.item-1 {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(2, 1fr);

    &__card {
        width: 100%;
        text-decoration: none;
    }
}

.big-number {
    font-weight: bold;
    font-size: 30px;
}
</style>