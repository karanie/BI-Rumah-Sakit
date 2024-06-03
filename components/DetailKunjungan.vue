<template>
    <Card>
        <template #title>
            <span>
                <slot name="title" />
            </span>
        </template>
        <template #content>
            <div v-if="status == 'pending'">
                <Skeleton height="18rem" />
            </div>

            <div class="grid" v-if="status == 'success'">
                <div class="grid__item1">
                    <DataTable v-model:filters="filters" :value="dataTable" selectionMode="single"
                        v-model:selection="selectedRow" @rowSelect="onRowSelect" @rowUnselect="onRowUnselect" scrollable
                        :scrollHeight="dataTableHeight" :virtualScrollerOptions="{ itemSize: 46 }">

                        <template #header>
                            <div class="flex justify-content-end">
                                <IconField iconPosition="left">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Cari" />
                                </IconField>
                            </div>
                        </template>

                        <Column v-for="col of kolom" :key="col.field" :field="col.field" />

                    </DataTable>
                </div>

                <div class="grid__item2">
                    <div v-if="detailStatus == 'pending'">
                        <Skeleton height="18rem" />
                    </div>

                    <div v-if="detailStatus == 'success'" ref="dtContainer">
                        <p>{{ getTahun }} | Deskripsi</p>

                        <div style="display: grid; grid-template-columns:repeat(2, 1fr)">
                            <h2>{{ valueData_selected }} <span style="font-size: 16px">kunjungan</span></h2>
                            <Knob v-model="percentageData_selected" valueTemplate="{value}%" :readonly="true" />
                        </div>

                        <div v-if="tahun" style="display: flex; align-items: center;">
                            <div style="display: flex; align-items: center;">
                                <Icon style="font-size: 1.5rem; margin-right: 5px" color="var(--green-400)"
                                    name="material-symbols:arrow-upward-rounded" v-if="status_comparePrev === 'Naik'" />
                                <Icon style="font-size: 1.5rem; margin-right: 5px" color="var(--red-400)"
                                    name="material-symbols:arrow-downward-rounded"
                                    v-else-if="status_comparePrev === 'Turun'" />
                                <p>{{ status_comparePrev }} {{ percentage_comparePrev }}% dari {{ getBulanOrTahun() }}
                                    lalu</p>
                            </div>
                        </div>

                        <div style="display: flex; align-items: center;">
                            <Icon style="font-size: 1.5rem; margin-right: 5px" color="var(--surface-400)"
                                name="material-symbols:info-rounded" />
                            <p>Didominasi kalangan {{ dominantAge_cat }} ({{ dominantAge_scale }} tahun)</p>
                        </div>

                        <div>
                            <div style="display: flex; align-items: center;">
                                <Icon style="font-size: 1.5rem; margin-right: 5px" color="var(--surface-400)"
                                    name="material-symbols:show-chart-rounded" />
                                <p>Pertumbuhan Kunjungan :</p>
                            </div>
                            <Chart type="line" :data="chartData" />
                        </div>

                        <div v-if="props.rawatJalan">
                            <div style="display: flex; align-items: center;">
                                <Icon style="font-size: 1.5rem; margin-right: 5px" color="var(--surface-400)"
                                    name="material-symbols:show-chart-rounded" />
                                <p>Top 5 Diagnosa :</p>
                            </div>
                            <Chart type="bar" :data="chartData_diagnosaRawatJalan" :options="{ indexAxis: 'y' }" />
                        </div>

                    </div>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">

import { FilterMatchMode } from 'primevue/api';
import Chart from 'primevue/chart';

const dataTable = ref()
const selectedRow = ref();

const chartData = ref();
const chartData_diagnosaRawatJalan = ref();

const props = defineProps<{
    src: string,
    rawatJalan?: boolean,
    jenisRegis: string,
    timeseries?: boolean,
    tipeData?: string,
}>();

const {
    tahun,
    bulan,
    kabupaten,
    lastFilter,
    selectedBulan
} = storeToRefs(useDataFilter());

const params = computed(() => {
    const p: any = {
        jenis_registrasi: props.jenisRegis,
        tahun: tahun.value,
        bulan: bulan.value,
        tipe_data: props.tipeData,
    }

    if (kabupaten.value !== null) {
        p.kabupaten = kabupaten.value;
    }
    return p;
});

function getBulanOrTahun() {
    if (!bulan.value) {
        return "tahun";
    } else {
        return "tahun"
        // return "bulan"
    }
}

const { data, status, refresh, error } = useFetch(props.src, {
    server: false,
    lazy: true,
    params: params,
    watch: false,
});

watch(data, () => {
    if (!data.value)
        return;
    dataTable.value = setDataTable(data.value);
});

watch(lastFilter, () => {
    refresh();
});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const paramsDetail = computed(() => {
    if (!selectedRow.value) return null;

    var p: any = {
        tahun: tahun.value,
        bulan: bulan.value,
        jenis_registrasi: props.jenisRegis,
        // diagnosa: selectedRow.value.index,
        timeseries: true,
        tipe_data: props.tipeData,
    }
    if (kabupaten.value !== null) {
        p.kabupaten = kabupaten.value;
    }

    // Menentukan params berdasarkan nilai rawatJalan
    p = props.rawatJalan ? { ...p, departemen: selectedRow.value.index } : { ...p, diagnosa: selectedRow.value.index };

    // console.log("param detail", p);
    return p;
});

const { data: detailData, status: detailStatus, execute: detailExecute, refresh: refreshData } = useFetch(props.src, {
    server: false,
    lazy: true,
    params: paramsDetail,
    watch: false,
    immediate: false,
});

const getTahun = ref();
const setTahun = () => {
    if (tahun.value) {
        let date = tahun.value && bulan.value ? `${selectedBulan.value.name} ${tahun.value}` : tahun.value;
        return date;
    }

    if (!detailData.value)
        return "";
    const tahunAwal = (new Date((detailData.value as any).index[0])).getFullYear();
    const tahunAkhir = (new Date((detailData.value as any).index[(detailData.value as any).index.length - 1])).getFullYear();
    return `${tahunAwal}-${tahunAkhir}`;
};

watch(detailData, () => {
    if (!detailData.value)
        return;

    setDetailData(detailData.value);
    chartData.value = setData_chart(detailData.value);

    getTahun.value = setTahun();
});

const paramsPrevData = computed(() => {
    if (!selectedRow.value) return null;
    var p: any = {
        tahun: tahun.value - 1,
        bulan: bulan.value,
        jenis_registrasi: props.jenisRegis,
        tipe_data: props.tipeData,
        // diagnosa: selectedRow.value.index,
    }
    if (kabupaten.value !== null) {
        p.kabupaten = kabupaten.value;
    }
    p = props.rawatJalan ? { ...p, departemen: selectedRow.value.index } : { ...p, diagnosa: selectedRow.value.index };

    // console.log("param prev data", p);
    return p;
});

const { data: prevData, status: prevDataStatus, execute: prevDataExecute } = useFetch(props.src, {
    server: false,
    lazy: true,
    params: paramsPrevData,
    watch: false,
    immediate: false,
});

watch(prevData, () => {
    if (!prevData.value)
        return;
    setPrevData(prevData.value);
});

const paramsDiagnosaRawatJalan = computed(() => {
    if (!selectedRow.value) return null;
    const p: any = {
        tahun: tahun.value,
        bulan: bulan.value,
        jenis_registrasi: props.jenisRegis,
        departemen: selectedRow.value.index,
    }
    if (kabupaten.value !== null) {
        p.kabupaten = kabupaten.value;
    }
    return p;
});

const { data: diagnosaData, status: diagnosaDataStatus, execute: diagnosaDataExecute } = useFetch(props.src, {
    server: false,
    lazy: true,
    params: paramsDiagnosaRawatJalan,
    watch: false,
    immediate: false,
});

watch(diagnosaData, () => {
    if (!diagnosaData.value)
        return;
    chartData_diagnosaRawatJalan.value = setDataDiagnosa_RawatJalan_chart(diagnosaData.value);
});

const kolom = [
    { field: 'index', header: '' }
];

const total = ref(0);

function setDataTable(data: any) {
    const reformattedData = [];
    // const data_filter = data.index.slice(0, 20);

    for (const key in data.index) {
        const row = { index: data.index[key] };
        reformattedData.push(row);
    }
    dataTable.value = reformattedData;

    selectedRow.value = dataTable.value[0];
    const initRow = {
        originalEvent: null,
        data: dataTable.value[0],
        index: 0,
        type: 'row'
    };
    onRowSelect(initRow);

    //komputasi total data kunjungan (belum termasuk data null diagnosa/poliklinik)
    total.value = data.values.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);

    return dataTable.value
};

const onRowSelect = (dataSelected: any) => {
    detailExecute();
};

const onRowUnselect = (row: any) => {
    selectedRow.value = row.data;
};

const valueData_selected = ref(0);
const percentageData_selected = ref(0);
const dominantAge_cat = ref("");
const dominantAge_scale = ref("");

function setDetailData(detailDataSelected: any) {
    if (!selectedRow.value) return;

    valueData_selected.value = detailDataSelected.values.reduce((accumulator: number, currentValue: number) => accumulator + currentValue, 0);
    percentageData_selected.value = Math.round(valueData_selected.value / total.value * 100);

    // console.log("detail data selected", detailDataSelected)

    dominantAge_cat.value = detailDataSelected.dominant_age_category_summary;
    dominantAge_scale.value = ageScale(dominantAge_cat.value);

    prevDataExecute()

    if (props.rawatJalan) {
        diagnosaDataExecute();
    }
};

function ageScale(category: string) {
    const categoryMap: any = {
        "bayi & balita": "< 5",
        "anak-anak": "5-9",
        "remaja": "10-18",
        "dewasa": "19-59",
        "lansia": "> 60",
    }
    return categoryMap[category] || "";
};

// Compare with previous data (masih compare per tahun)
const status_comparePrev = ref("");
const percentage_comparePrev = ref(0);

function setPrevData(prevData: any) {
    // console.log("data tahun lalu", prevData)

    percentage_comparePrev.value = Math.round((valueData_selected.value - prevData.values) / prevData.values * 100);
    if (percentage_comparePrev.value < 0) {
        status_comparePrev.value = 'Turun';
        percentage_comparePrev.value = Math.abs(percentage_comparePrev.value)
    } else {
        status_comparePrev.value = 'Naik';
        percentage_comparePrev.value = Math.abs(percentage_comparePrev.value)
    }
};

//Chart
function setData_chart(data: any) {
    // console.log(data)
    return {
        labels: data.index,
        datasets: [
            {
                label: data.columns,
                data: data.values,
            }
        ]
    };
};

function setDataDiagnosa_RawatJalan_chart(data: any) {
    // console.log(data)
    return {
        labels: data.indexDiagnosa.slice(0, 5),
        datasets: [
            {
                label: data.columns,
                data: data.valuesDiagnosa,
            }
        ]
    };
};

//dynamic scroll height for datatable
const dtContainer = ref();
const dataTableHeight = computed(() => {
    if (dtContainer.value) {
        const containerHeight = dtContainer.value.clientHeight;
        return `${containerHeight}px`;
    }
    return "420px"
})

</script>

<style scoped lang="scss">
.grid {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 2fr 3fr;

    &__item1:deep() th {
        padding: 0;
    }
}
</style>
