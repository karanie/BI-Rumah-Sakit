<template>
  <Nuxt-link :to="props.link" class="no-underline">
    <Card :class="{ 'active': route.path == props.link }" class="numeric-data__card">
      <template #title>
        <span>
          <slot name="title"></slot>
        </span>
      </template>
      <template #subtitle>
        <span>
          <slot name="subtitle"></slot>
        </span>
      </template>
      <template #content>
        <Skeleton v-if='status == "pending" && !data' height="2.25rem" />
        <template v-else>
          <div class="big-number">{{ getData }}</div>
        </template>
      </template>
    </Card>
  </Nuxt-link>
</template>

<script setup lang="ts">
const route = useRoute();

const props = defineProps<{
  src: string,
  link: string,
  tipeData?: string,
  currency?: boolean,
  listenUpdate?: boolean
}>();

const {
  bulan,
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

const getData = computed(() => {
  if (!import.meta.client)
    return
  if (props.currency) {
    return new Intl.NumberFormat(document.documentElement.lang, { style: 'currency', currency: 'IDR' }).format((data.value as any)?.value);
  }
  return new Intl.NumberFormat().format((data.value as any)?.value);
});


watch(lastFilter, () => {
  refresh()
});

const { update: newUpdate } = storeToRefs(useDataUpdate());
watch(newUpdate, () => {
  if (props.listenUpdate) {
    refresh();
  }
});

</script>

<style scoped lang="scss">
.numeric-data {
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(3, 1fr);

  &__card {
    width: 100%;
    text-decoration: none;

    &.active {
      background-color: var(--cyan-100);
      color: var(--surface-800);
      // color: white; /* Jika ingin teks menjadi putih */
    }

    &:hover {
      transform: scale(1.05);
      background-color: var(--cyan-50);
    }

    /* Style untuk card yang tidak aktif */
    &:not(.active) {
      background-color: var(--surface-100);
      color: var(--surface-500);
    }
  }

}
.big-number {
  font-weight: bold;
  font-size: 24px;
}

.no-underline {
  text-decoration: none;
}

.message {
  margin: 0;
}
</style>
