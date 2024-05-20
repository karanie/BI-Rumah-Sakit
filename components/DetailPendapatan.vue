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
                            <Icon name="material-symbols:sort-rounded" size="24px" style="margin-right: 8px" />
                            <Dropdown v-model="selectedSort" :options="sortBy" style="width: fit-content" />

                            <div style="margin-top: 10px;">
                                <IconField iconPosition="left">
                                    <InputIcon>
                                        <i class="pi pi-search" />
                                    </InputIcon>
                                    <InputText v-model="filters['global'].value" placeholder="Cari"
                                        style="width:100%" />
                                </IconField>
                            </div>
                        </template>
                        <Column v-for="col of kolom" :key="col.field" :field="col.field"></Column>
                    </DataTable>
                </div>

                <div class="grid__item2">
                    <div v-if="detailStatus == 'pending' || prevStatus == 'pending'">
                        <Skeleton height="18rem" />
                    </div>

                    <div v-if="detailStatus == 'success' && prevStatus == 'success'" ref="dtContainer">
                        <p><b>{{ getTahun }} | Deskripsi</b></p>
                        <DataTable :value="compareDataTable">
                            <Column field="periode" header="Periode" />
                            <Column field="hpp" header="HPP">
                                <template #body="slotProps">
                                    <div>
                                        <span>{{ slotProps.data.hpp }}</span>
                                        <br>
                                        <span v-if="slotProps.index === 1 && valueHpp != null"
                                            :style="{ color: getColorHpp }">
                                            <Icon v-show="valueHpp > 0" name="material-symbols:arrow-drop-up"
                                                size="24px" />
                                            <Icon v-show="valueHpp < 0" name="material-symbols:arrow-drop-down"
                                                size="24px" />
                                            {{ valueHpp }}%
                                        </span>
                                    </div>
                                </template>
                            </Column>
                            <Column field="tagihan" header="Tagihan">
                                <template #body="slotProps">
                                    <div>
                                        <span>{{ slotProps.data.tagihan }}</span>
                                        <br>
                                        <span v-if="slotProps.index === 1 && valueTagihan != null"
                                            :style="{ color: getColorTagihan }">
                                            <Icon v-show="valueTagihan > 0" name="material-symbols:arrow-drop-up"
                                                size="24px" />
                                            <Icon v-show="valueTagihan < 0" name="material-symbols:arrow-drop-down"
                                                size="24px" />
                                            {{ valueTagihan }}%
                                        </span>
                                    </div>
                                </template>
                            </Column>
                        </DataTable>

                        <p><b>Total Tagihan pada Setiap Jenis Penjamin</b> </p>
                        <Chart type="bar" :data="chartData" />
                        <Divider />

                        <div v-if="props.jenisRegis == 'Rawat Jalan'">
                            <p><b>Top 5 Diagnosa Berdasarkan {{ selectedSort.charAt(0).toUpperCase() +
                selectedSort.slice(1) }}
                                    Tertinggi</b></p>
                            <Chart type="bar" :data="chartListData" :options="{ indexAxis: 'y' }" />
                        </div>

                        <div v-if="props.jenisRegis == 'Rawat Inap'">
                            <p><b>Distribusi Kelas</b></p>
                            <p>Rata-rata lama inap : {{ lamaInap }} hari</p>
                            <Chart type="bar" :data="chartListData" :options="{ indexAxis: 'y' }" />
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

const props = defineProps<{
    src: string,
    jenisRegis: string,
}>();

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const {
    tahun,
    bulan,
    kabupaten,
    lastFilter,
} = storeToRefs(useDataFilter());

const selectedSort = ref("pendapatan");
const sortBy = ref(["pendapatan", "pengeluaran"]);

const dataTable = ref();
const selectedRow = ref();

const compareDataTable = ref();
const valueHpp = ref();
const valueTagihan = ref();

const chartData = ref();
const chartListData = ref();

const lamaInap = ref();

const getTahun = ref();

const params = computed(() => {
    let p: any = {
        jenisregistrasi: props.jenisRegis,
        tahun: tahun.value,
        bulan: bulan.value,
        sort: selectedSort.value
    }
    p = props.jenisRegis == "Rawat Jalan" || props.jenisRegis == "OTC" ? { ...p, tipe_data: "poliklinik" } : { ...p, tipe_data: "diagnosa" };

    if (kabupaten.value !== null) {
        p.kabupaten = kabupaten.value;
    }
    return p;
});

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

watch(selectedSort, () => {
    refresh();
});

const paramsPrevData = computed(() => {
    let p: any = {
        jenisregistrasi: props.jenisRegis,
        sort: selectedSort.value
    }

    if (kabupaten.value !== null) {
        p.kabupaten = kabupaten.value;
    }

    p = tahun.value && bulan.value
        ? (bulan.value === 1 ?
            { ...p, tahun: tahun.value - 1, bulan: 12 } :
            { ...p, tahun: tahun.value, bulan: bulan.value - 1 })
        : (tahun.value ?
            { ...p, tahun: tahun.value - 1 } : { ...p, tahun: tahun.value }
        )

    p = props.jenisRegis == "Rawat Jalan" || props.jenisRegis == "OTC" ?
        { ...p, tipe_data: "poliklinik" } :
        { ...p, tipe_data: "diagnosa" }

    return p;
});

const { data: prevData, status: prevStatus, execute: prevDataExecute } = useFetch(props.src, {
    server: false,
    lazy: true,
    params: paramsPrevData,
    watch: false,
    immediate: false,
});

watch(prevData, () => {
    if (!prevData.value)
        return;
    // compareDataTable.value = setCompareDataTable(data.value, prevData.value);
});

const paramsDetail = computed(() => {
    if (!selectedRow.value) return null;

    let p: any = {
        jenisregistrasi: props.jenisRegis,
        tahun: tahun.value,
        bulan: bulan.value,
        sort: selectedSort.value
    }

    if (kabupaten.value !== null) {
        p.kabupaten = kabupaten.value;
    }

    p = props.jenisRegis == "Rawat Jalan" || props.jenisRegis == "OTC" ?
        { ...p, tipe_data: "poliklinik", poli: selectedRow.value.index } :
        { ...p, tipe_data: "diagnosa", diagnosa: selectedRow.value.index }

    return p;
});

const { data: dataDetail, status: detailStatus, execute: detailExecute } = useFetch(props.src, {
    server: false,
    lazy: true,
    params: paramsDetail,
    watch: false,
    immediate: false,
});

watch(dataDetail, () => {
    if (!dataDetail.value)
        return;
    compareDataTable.value = setCompareDataTable(data.value, prevData.value);
    chartData.value = setData_chart(dataDetail.value);
    chartListData.value = setListData_chart(dataDetail.value);

    getTahun.value = setTahun();
});

const kolom = [
    { field: 'index', header: '' }
];

function setDataTable(data: any) {
    const reformattedData = [];

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

    return dataTable.value
};

const onRowUnselect = (row: any) => {
    selectedRow.value = row.data;
};

const onRowSelect = (dataSelected: any) => {
    detailExecute();
    prevDataExecute();
};

function setCompareDataTable(data: any, prevData: any) {
    const reformattedData = [];

    let index = data.index.findIndex((i: any) => i === selectedRow.value.index);
    let prevIndex = prevData.index.findIndex((i: any) => i === selectedRow.value.index);

    let hitungOut = (data.pengeluaran[index] - prevData.pengeluaran[prevIndex]) / prevData.pengeluaran[prevIndex] * 100;
    let hitungIn = (data.pendapatan[index] - prevData.pendapatan[prevIndex]) / prevData.pendapatan[prevIndex] * 100;

    valueHpp.value = Number.isNaN(hitungOut) || !Number.isFinite(hitungOut) ? null : hitungOut.toFixed(1);
    valueTagihan.value = Number.isNaN(hitungIn) || !Number.isFinite(hitungIn) ? null : hitungIn.toFixed(1);

    const row2 = {
        periode: tahun.value && bulan.value
            ? `${new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(new Date(2000, bulan.value - 1, 1))} ${tahun.value}`
            : (tahun.value ? tahun.value : `All`),
        hpp: `Rp ${new Intl.NumberFormat().format(data.pengeluaran[index].toFixed(0))}`,
        tagihan: `Rp ${new Intl.NumberFormat().format(data.pendapatan[index].toFixed(0))}`
    };

    const row1 = {
        periode: tahun.value && bulan.value
            ? "Bulan lalu"
            : (tahun.value ? "Tahun lalu" : `All`),
        hpp: prevIndex === -1 ? "Rp 0" : `Rp ${new Intl.NumberFormat().format(prevData.pengeluaran[prevIndex].toFixed(0))}`,
        tagihan: prevIndex === -1 ? "Rp 0" : `Rp ${new Intl.NumberFormat().format(prevData.pendapatan[prevIndex].toFixed(0))}`
    };

    reformattedData.push(row1, row2);
    compareDataTable.value = reformattedData;

    return compareDataTable.value;
};

//Chart untuk jenis penjamin
function setData_chart(data: any) {
    return {
        labels: data.jenis_penjamin,
        datasets: [
            {
                label: 'Pendapatan (Rp)',
                data: data.pendapatan,
            }
        ],
    };
};

// Untuk rawat jalan & rawat inap
function setListData_chart(data: any) {
    lamaInap.value = props.jenisRegis == 'Rawat Inap' ? data.avgLosRawatan : 0;
    return {
        labels: props.jenisRegis == 'Rawat Jalan' ? data.diagnosa.slice(0, 5) : data.kelas_hak,
        datasets: [
            {
                label: 'Pendapatan (Rp)',
                data: props.jenisRegis == 'Rawat Jalan' ? data.pendapatanDiagnosa : data.pendapatanKelas
            },
            {
                label: 'Pengeluaran (Rp)',
                data: props.jenisRegis == 'Rawat Jalan' ? data.pengeluaranDiagnosa : data.pengeluaranKelas
            }
        ],
    };
};

function setTahun(){
    let date = tahun.value && bulan.value
            ? `${new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(new Date(2000, bulan.value - 1, 1))} ${tahun.value}`
            : (tahun.value ? tahun.value : `All`)
    return date;
}

const getColorHpp = computed(() => {
    let color = valueHpp.value < 0 ? "var(--red-400)" : "var(--green-400)";
    return color;
});

const getColorTagihan = computed(() => {
    let color = valueTagihan.value < 0 ? "var(--red-400)" : "var(--green-400)";
    return color;
});

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

:deep() div.p-datatable-header {
    padding: 0;
    padding-bottom: 10px;
}
</style>