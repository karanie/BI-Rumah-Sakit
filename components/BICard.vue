<template>
  <Card class="card">
    <template #title>
      <template v-if='status == "success"'>
        <span ><slot name="title"/></span>
      </template>
      <Skeleton v-else height="1.25rem" />
    </template>
    <template #subtitle>
      <span v-if='status == "success"'> <slot name="subtitle"/> {{ bulanTahunFilter }}</span>
      <Skeleton v-else height="1rem" />
    </template>
    <template #content>
      <template v-if='status == "success"'>
        <b v-if='color == "green"' class="big-number--positive">Rp{{ getData }}</b>
        <b v-if='color == "red"' class="big-number--negative">Rp{{ getData }}</b>
        <b v-if='!color' class="big-number">Rp{{ getData }}</b>
      </template>
      <Skeleton v-else height="2rem" />
    </template>
  </Card>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string,
  tipeData?: string,
  color?: string,
}>();

const {
  bulan,
  selectedBulan,
  tahun,
  kabupaten,
  lastFilter,
} = storeToRefs(useDataFilter());

const params = computed(() => {
  const p: any = {
    tahun: tahun.value,
    bulan: bulan.value,
    tipe_data: props.tipeData,
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

watch(data, () => console.log(data.value));
watch(status, () => console.log(status.value));

const getData = computed(() => new Intl.NumberFormat().format((data.value as any)?.value));
const bulanTahunFilter = ref(getBulanTahunFilter());

watch(lastFilter, () => {
  refresh()
  bulanTahunFilter.value = getBulanTahunFilter()
});

function getBulanTahunFilter() {
  if (!tahun.value) {
    return "Bulan Ini";
  } else {
    if (!bulan.value) {
      return tahun.value;
    }
    else {
      return tahun.value + " " + selectedBulan.value.name
    }
  }
}
</script>

<style scoped lang="scss">
.big-number {
    &--positive {
      font-weight: bold;
      font-size: 30px;
      color: rgb(50,205,50);
    }

    &--negative {
      font-weight: bold;
      font-size: 30px;
      color: rgb(255, 75, 70);
    }
}
</style>
