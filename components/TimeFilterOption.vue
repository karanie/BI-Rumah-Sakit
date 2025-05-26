<template>
  <div class="time-filter">
    <div class="time-filter__option">
      <Dropdown class="time-filter__option__dropdown" v-model="selectedTimeFilterMode" :options="filterModes" optionLabel="name"
        placeholder="Pilih Mode Filter Waktu" :virtualScrollerOptions="{ itemSize: 38 }" />
    </div>

    <div class="time-fitler__option time-filter__option--content" v-if="(selectedTimeFilterMode as any)?.value === 'tahunBulan'">
      <div class="time-filter__option">
        <Dropdown class="time-filter__option__dropdown" v-model="selectedTahun" :options="tahun"
          placeholder="Pilih Tahun" :virtualScrollerOptions="{ itemSize: 38 }" filter />
        <Button class="time-filter__option__clear" v-if="selectedTahun" severity="danger" @click="e => emit('clearTahun', e)"
          outlined>
          <template #icon>
            <Icon name="material-symbols:close" />
          </template>
        </Button>
      </div>

      <div class="time-filter__option">
        <Dropdown class="time-filter__option__dropdown" v-model="selectedBulan" :options="getAvailBulan" optionLabel="name" :disabled="!selectedTahun"
          placeholder="Pilih Bulan" :virtualScrollerOptions="{ itemSize: 38 }" filter />
        <Button class="time-filter__option__clear" v-if="selectedBulan" severity="danger" @click="e => emit('clearBulan', e)"
          outlined>
          <template #icon>
            <Icon name="material-symbols:close" />
          </template>
        </Button>
      </div>
    </div>

    <div class="time-fitler__option time-filter__option--content" template v-if="(selectedTimeFilterMode as any)?.value === 'relative'">
      <div class="time-filter__option">
        <Dropdown class="time-filter__option__dropdown" v-model="selectedRelative" :options="relativeOptions" optionLabel="name"
          placeholder="Pilih Waktu Relative" :virtualScrollerOptions="{ itemSize: 38 }" filter />
        <Button class="time-filter__option__clear" v-if="selectedRelative" severity="danger" @click="e => emit('clearRelative', e)"
          outlined>
          <template #icon>
            <Icon name="material-symbols:close" />
          </template>
        </Button>
      </div>
    </div>

    <div class="time-fitler__option time-filter__option--content" template v-if="(selectedTimeFilterMode as any)?.value === 'range'">
      <div class="time-filter__option">
        <Calendar v-model="selectedDateRange" selectionMode="range" :manualInput="false" dateFormat="dd/mm/yy" />
        <Button class="time-filter__option__clear" v-if="selectedDateRange" severity="danger" @click="e => emit('clearDateRange', e)"
          outlined>
          <template #icon>
            <Icon name="material-symbols:close" />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedTahun = defineModel('selectedTahun');
const selectedBulan = defineModel('selectedBulan');
const selectedRelative = defineModel('selectedRelative');
const selectedDateRange = defineModel<Date[]>('selectedDateRange');
const selectedTimeFilterMode = defineModel('selectedTimeFilterMode');

const emit = defineEmits<{
  (e: 'clearTahun', event: any): void
  (e: 'clearBulan', event: any): void
  (e: 'clearRelative', event: any): void
  (e: 'clearDateRange', event: any): void
}>();

const availParamOptions = (await $fetch("/api/filter-options"));
const lastUpdate = (await $fetch("/api/last-update"));

const filterModes = ref([
  { name: "Tahun/Bulan", value: "tahunBulan" },
  { name: "Relatif", value: "relative" },
  { name: "Range", value: "range" },
]);
const tahun = ref();
const bulan = [
  { name: "Januari", value: 1 },
  { name: "Februari", value: 2 },
  { name: "Maret", value: 3 },
  { name: "April", value: 4 },
  { name: "Mei", value: 5 },
  { name: "Juni", value: 6 },
  { name: "Juli", value: 7 },
  { name: "Agustus", value: 8 },
  { name: "September", value: 9 },
  { name: "Oktober", value: 10 },
  { name: "November", value: 11 },
  { name: "Desember", value: 12 }
];
const relativeOptions = [
  { name: "1 Tahun Terakhir", value: "year" },
  { name: "6 Bulan Terakhir", value: "6month" },
  { name: "1 Bulan Terakhir", value: "month" },
  { name: "1 Minggu Terakhir", value: "week" },
  { name: "1 Hari Terakhir", value: "day" },
];

const getAvailBulan = computed(() => {
  return bulan.filter((i: { name: string, value: number }) => {
    return new Date(`${selectedTahun.value}-${i.value}-1`) <= new Date(lastUpdate.waktuRegistrasiTerakhir);
  });
});

onMounted(async () => {
  tahun.value = availParamOptions.tahun;
});
</script>

<style scoped lang="scss">
.time-filter {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__option {
    display: flex;
    gap: 4px;
    width: 100%;

    &--content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      border: 1px solid var(--surface-border);
      border-radius: var(--border-radius);
      padding: 1.125rem;
    }

    &__dropdown {
      overflow: hidden;
      flex: 1;
    }

    &__clear {
      flex-shrink: 0;
    }
  }
}
</style>
