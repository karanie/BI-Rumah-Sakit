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
                        scrollHeight="420px" :virtualScrollerOptions="{ itemSize: 46 }">

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
                        <Column v-for="col of kolom" :key="col.field" :field="col.field"></Column>
                    </DataTable>
                </div>

                <div class="grid__item2">
                    <DataTable :value="inoutCome" scrollable scrollHeight="420px">
                        <Column v-for="col of kolomDetail" :key="col.field" :field="col.field" :header="col.header">
                        </Column>
                    </DataTable>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { FilterMatchMode } from 'primevue/api';

const dataTable = ref()
const selectedRow = ref();

const inoutCome = ref()

const props = defineProps<{
    src: string,
    jenisRegis: string,
    rawatJalan?: boolean,
    otc?: boolean //did it needed?
}>();

const {
    tahun,
    bulan,
    kabupaten,
    lastFilter,
} = storeToRefs(useDataFilter());

const params = computed(() => {
    const p: any = {
        jenisregistrasi: props.jenisRegis,
        tahun: tahun.value,
        bulan: bulan.value,
        tipe_data: "pengeluaranGejala"
    }

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

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const kolom = [
    { field: 'index', header: '' }
];

const kolomDetail = [
    { field: 'periode', header: 'Periode' },
    { field: 'hpp', header: 'HPP' },
    { field: 'tagihan', header: 'Tagihan' },
]

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

const paramsOutcome = computed(() => {
    if (!selectedRow.value) return null;

    var p: any = {
        tahun: tahun.value,
        bulan: bulan.value,
        jenisregistrasi: props.jenisRegis,
        tipe_data: "pengeluaranGejala"
    }

    return p;
});

const { data: outcomeData, status: outcomeStatus, execute: outComeExecute } = useFetch(props.src, {
    server: false,
    lazy: true,
    params: paramsOutcome,
    watch: false,
    immediate: false,
});

watch(outcomeData, () => {
    if (!outcomeData.value)
        return;

    //add code
});


const paramsPrev = computed(() => {
    if (!selectedRow.value) return null;
    let p: any = {
        jenisregistrasi: props.jenisRegis,
        tipe_data: "pendapatanGejala",
    }

    p = bulan.value? { ...p, tahun: tahun.value, bulan: bulan.value-1 } : { ...p, tahun : tahun.value - 1};

    return p;
});

const { data: prevData, status: prevStatus, execute: prevExecute } = useFetch(props.src, {
    server: false,
    lazy: true,
    params: paramsPrev,
    watch: false,
    immediate: false,
});

watch(prevData, () => {
    if (!prevData.value)
        return;
});

const paramsPrev_out = computed(() => {
    if (!selectedRow.value) return null;
    let p: any = {
        jenisregistrasi: props.jenisRegis,
        tipe_data: "pengeluaranGejala",
    }

    p = bulan.value? { ...p, tahun: tahun.value, bulan: bulan.value-1 } : { ...p, tahun : tahun.value - 1};

    return p;
});

const { data: prevData_out, status: prevStatus_out, execute: prevExecute_out } = useFetch(props.src, {
    server: false,
    lazy: true,
    params: paramsPrev_out,
    watch: false,
    immediate: false,
});

watch(prevData_out, () => {
    if (!prevData_out.value)
        return;
});

const onRowSelect = (dataSelected: any) => {
    incomeExecute();
    outComeExecute();
    prevExecute();
    prevExecute_out();
};

function setInOutCome(income: any, outcome: any, prevdata: any, prevDataOut: any) {
    if (!outcome.value && !prevdata.value && !prevDataOut.value) {
        return;
    }
    const reformattedData = [];

    let indexIn = (income.value as any).index.findIndex((i: any) => i === selectedRow.value.index);
    let indexOut = (outcome.value as any).index.findIndex((i: any) => i === selectedRow.value.index);
    const row1 = { periode: tahun.value, hpp: (outcome.value as any).values[indexOut], tagihan: (income.value as any).values[indexIn] };
    reformattedData.push(row1);

    let indexPrev = (prevdata.value as any).index.findIndex((i: any) => i === selectedRow.value.index);
    let indexPrev_out = (prevDataOut.value as any).index.findIndex((i: any) => i === selectedRow.value.index)
    const row2 = { periode: "last of the Filter", hpp: (prevDataOut.value as any).values[indexPrev_out], tagihan: (prevdata.value as any).values[indexPrev] };
    reformattedData.push(row2);

    inoutCome.value = reformattedData;

    return inoutCome.value;
};

const paramsIncome = computed(() => {
    if (!selectedRow.value) return null;
    const p: any = {
        tahun: tahun.value,
        bulan: bulan.value,
        jenisregistrasi: props.jenisRegis,
        tipe_data: "pendapatanGejala",
    }
    return p;
});

const { data: incomeData, status: incomeStatus, execute: incomeExecute } = useFetch(props.src, {
    server: false,
    lazy: true,
    params: paramsIncome,
    watch: false,
    immediate: false,
});

watch(incomeData, () => {
    if (!incomeData.value && !outcomeData.value && !prevData.value && !prevData_out.value)
        return;

    inoutCome.value = setInOutCome(incomeData, outcomeData, prevData, prevData_out)

});

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