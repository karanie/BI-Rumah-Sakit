<template>
  <div class="comp-table">
    <Panel header="Filter" :style="{ height: 'fit-content', width: '300px' }">
      <div class="comp-table__option-panel">
        <div class="form-input">
          <label for="jenisData">Jenis Data</label>
          <Dropdown id="jenisData" v-model="src" placeholder="Interval" :options="srcs" optionLabel="name" />
        </div>
        <div class="form-input">
          <label for="interval">Interval</label>
          <Dropdown id="interval" v-model="interval" placeholder="Interval" :options="intervalOptions" optionLabel="name" />
        </div>
        <div class="form-input">
          <label for="interval">Resample</label>
          <Dropdown id="interval" v-model="resample" placeholder="Resample" :options="resampleOptions" optionLabel="name" />
        </div>

        <Panel header="Data 1">
          <div class="comp-table__option-panel">
            <div class="form-input">
              <label for="kategori">Kategori</label>
              <Dropdown id="kategori" v-model="category1" filter :options="catOptions" placeholder="Kategori" showClear :virtualScrollerOptions="{ itemSize: 35.5 }" />
            </div>
            <div class="form-input">
              <label for="period">Period</label>
              <Dropdown id="period" v-model="period1" filter :options="periodOptions" optionLabel="name" placeholder="Periode ke-" showClear :virtualScrollerOptions="{ itemSize: 35.5 }" />
            </div>
          </div>
        </Panel>

        <Panel header="Data 2">
          <div class="comp-table__option-panel">
            <div class="form-input">
              <label for="kategori">Kategori</label>
              <Dropdown v-model="category2" filter :options="catOptions" placeholder="Kategori" showClear :virtualScrollerOptions="{ itemSize: 35.5 }" />
            </div>
            <div class="form-input">
              <label for="period">Periode</label>
              <Dropdown id="period" v-model="period2" filter :options="periodOptions" optionLabel="name" placeholder="Periode ke-" showClear :virtualScrollerOptions="{ itemSize: 35.5 }" />
            </div>
          </div>
        </Panel>
      </div>
    </Panel>
    <Panel header="Compare" class="comp-table__content">
      <DataTable v-if="status1 == 'success' && status2 =='success'" :value="data" scrollable>
        <ColumnGroup type="header">
          <Row>
            <Column header="" field="property" :rowspan="2" />
            <Column header="Data 1" field="data1" />
            <Column header="Data 2" field="data2" />
            <Column header="Diff" field="diff" />
          </Row>
          <Row>
          </Row>
        </ColumnGroup>
        <Column header="" field="property">
          <template #body="{ data }">
            <div class="row-header">{{ data.property }}</div>
          </template>
        </Column>
        <Column header="Data 1" field="data1">
          <template #body="{ data }">
            <div class="row-data">{{ formatNum(data.data1) }}</div>
          </template>
        </Column>
        <Column header="Data 2" field="data2">
          <template #body="{ data }">
            <div class="row-data"v>{{ formatNum(data.data2) }}</div>
          </template>
        </Column>
        <Column header="Diff" field="diff">
          <template #body="{ data }">
            <div class="row-data row-data--diff" :class="{ 'row-data--diff--positive': data.diff > 0, 'row-data--diff--negative': data.diff < 0 }">
              <div>
                {{ `${formatNum(data.diff)}` }}<br>{{ `(${formatNum(data.diff / data.data1 * 100)}%)` }}
              </div>
              <div>
                <Icon v-show="data.diff > 0" name="material-symbols:arrow-drop-up" size="24px" />
                <Icon v-show="data.diff < 0" name="material-symbols:arrow-drop-down" size="24px" />
              </div>
            </div>
          </template>
        </Column>
      </DataTable>
      <div v-if="status1 == 'pending' || status2 == 'pending'">
        <div class="skeletons">
          <Skeleton class="skeletons__item skeletons__item--header" height="44.5px" />
          <Skeleton class="skeletons__item skeletons__item--body" height="63px" />
          <Skeleton class="skeletons__item skeletons__item--body" height="63px" />
          <Skeleton class="skeletons__item skeletons__item--body" height="63px" />
        </div>
      </div>
    </Panel>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  srcs: { name: string, value: string, params?: any }[],
  defaultSrc?: number,
}>();

const route = useRoute();

const availParamOptions = (await $fetch("/api/filter-options"));
const lastUpdate = (await $fetch("/api/last-update"));

const src = ref(props.srcs[props.defaultSrc || 0]);
const category1 = ref();
const category2 = ref();
const interval = ref({ name: "Tahun", value: "tahun" });
const resample = ref({ name: "1 Bulan", value: "M" });

const intervalOptions = [
  { name: "Tahun", value: "tahun" },
  { name: "Bulan", value: "bulan" },
];
const resampleOptions = [
  { name: "1 Tahun", value: "Y" },
  { name: "4 Bulan", value: "3M" },
  { name: "3 Bulan", value: "3M" },
  { name: "1 Bulan", value: "M" },
  { name: "1 Minggu", value: "W" },
  { name: "1 Hari", value: "D" },
];
const catOptions = computed(() => {
  if (!data1.value)
    return [];
  return (data1.value as any).columns || (data1.value as any).index;
});
const periodOptions = computed(() => {
  if (interval.value.value == "tahun") {
    return availParamOptions.tahun.map((y: number) => {
      return { name: y, value: { tahun: y } };
    });
  } else {
    return availParamOptions.tahun
      .map((y: number) => availParamOptions.bulan
        .map(((m: number) => {
          return {
            name: `${m}/${y}`, value: { tahun: y, bulan: m } }
          }))
        .filter((i: { name: string, value: { tahun: number, bulan: number } }) => {
          return new Date(`${i.value.tahun}-${i.value.bulan}-1`) <= new Date(lastUpdate.waktuRegistrasiTerakhir);
        }))
      .reduce((a: string[], b: string[]) => a.concat(b));
  }
});

const period1 = ref(periodOptions.value[periodOptions.value.length - 2]);
const period2 = ref(periodOptions.value[periodOptions.value.length - 1]);
const srcParams1 = ref(generateParams(period1.value));
const srcParams2 = ref(generateParams(period2.value));

function generateParams(periods: any) {
  let params: any = {
    timeseries: true,
    resample: resample.value?.value,
  };

  if (!periods)
    return params;

  if (src.value.params)
    params = src.value.params

  if (interval.value.value == "tahun") {
    params.tahun = periods.value.tahun;
  } else if (interval.value.value == "bulan") {
    params.tahun = periods.value.tahun;
    params.bulan = periods.value.bulan;
  }

  return params;
}

const {
  data: data1,
  status: status1,
  refresh: refresh1,
  error: error1,
  } = useFetch(() => src.value.value || "", {
  server: false,
  lazy: true,
  params: srcParams1,
  watch: false,
});

const {
  data: data2,
  status: status2,
  refresh: refresh2,
  error: error2,
  } = useFetch(() => src.value.value || "", {
  server: false,
  lazy: true,
  params: srcParams2,
  watch: false,
});

watch([src, period1, period2, resample], () => {
  srcParams1.value = generateParams(period1.value);
  srcParams2.value = generateParams(period2.value);
  refresh1();
  refresh2();
}, { deep: true });

watch(interval, () => {
  period1.value = periodOptions.value[periodOptions.value.length - 2];
  period2.value = periodOptions.value[periodOptions.value.length - 1];
});

function generateData() {
  const aggregateList = [
    {
      name: "Count",
      callback: (l: number[]) => {
        return l.length;
      },
    },
    {
      name: "Sum",
      callback: (l: number[]) => {
        return l.reduce((a: number, b: number) => a+b, 0);
      },
    },
    {
      name: "Avg",
      callback: (l: number[]) => {
        return l.reduce((a: number, b: number) => a+b, 0) / l.length;
      },
    },
    {
      name: "Median",
      callback: (l: number[]) => {
        if (l.length - 1 % 2 == 0)
          return l.sort()[(l.length - 1) / 2];
        else
          return (l.sort()[Math.floor((l.length - 1) / 2)] + l.sort()[Math.ceil((l.length - 1) / 2)]) / 2;
      },
    },
    {
      name: "Std. Dev",
      callback: (l: number[]) => {
        const avg = l.reduce((a: number, b: number) => a+b, 0) / l.length;
        return Math.sqrt(l.map(i => (i - avg)**2).reduce((a, b) => a + b, 0) / l.length);
      },
    },
    {
      name: "Min",
      callback: (l: number[]) => {
        return Math.min(...l);
      },
    },
    {
      name: "Max",
      callback: (l: number[]) => {
        return Math.max(...l);
      },
    },
    {
      name: "25% Percentile",
      callback: (l: number[]) => {
        return l.sort((a: number, b: number) => a - b)[Math.round((l.length - 1) * (25 / 100))];
      },
    },
    {
      name: "75% Percentile",
      callback: (l: number[]) => {
        return l.sort((a: number, b: number) => a - b)[Math.round((l.length - 1) * (75 / 100))];
      },
    },
  ];

  // This basically decide wether to pick 1 column from the data or "merge" all
  // the columns if the user doesn't specify a specific category. It only merge
  // the categories/columns but tries to keep the data position in time the same.
  function getDataList(data: any, category: string | undefined) {
    if (!data.columns || data.values.length === 0)
      return data.values;

    const catIdx = category ? data.columns.findIndex((col: any) => col == category) : -1;
    if (catIdx != -1)
      return data.values[catIdx];

    return data.values.reduce((acc: number[], curr: number[]) => {
      return acc.map((val: number, idx: number) => val + curr[idx]);
    }, Array(data.values[0].length).fill(0));
  }

  const data1List = getDataList(data1.value, category1.value);
  const data2List = getDataList(data2.value, category2.value);

  return aggregateList.map((i: { name: string, callback: (l: number[]) => number }) => {
    return {
      property: i.name,
      data1: i.callback(data1List),
      data2: i.callback(data2List),
      diff: i.callback(data2List) - i.callback(data1List),
    };
  });
}

const data = ref();

watch([data1, data2, category1, category2], () => {
  if (status1.value == "success" && status2.value == "success") {
    data.value = generateData();
  }
});

function formatNum(num: number) {
  return new Intl.NumberFormat(navigator.language).format(num);
}
</script>

<style scoped lang="scss">
.comp-table {
  display: flex;
  gap: 8px;
  flex-direction: row;
  justify-content: stretch;
  margin: 8px;

  &__option-panel {
    max-height: calc(100vh - 55px - 16px - 2px - 52px - 1.125rem);
    overflow: auto;

    & > div {
      margin-top: 8px;
    }

    & > div:first-child {
      margin-top: 0;
    }
  }

  &__content {
    width: 100%;
    min-width: 0;
  }
}

.row-header {
  font-weight: bold;
}

.row-data {
  font-family: monospace;
  text-align: right;
  &--diff {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;

    &--positive {
      color: var(--green-600);
    }

    &--negative {
      color: var(--red-600);
    }
  }
}

.form-input {
  display: flex;
  gap: 8px;
  flex-direction: column;
}

.skeletons {
  &__item {
    margin: 0.75rem 1rem;
    &--header {
    }
  }
}
</style>
