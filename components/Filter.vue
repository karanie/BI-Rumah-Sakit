<template>
  <Button class="filter-button__filter" :label="isFiltering ? 'Filtering' : 'Filter'" :outlined="isFiltering" @click="toggleOverlayPanel">
    <template #icon><Icon name="material-symbols:filter-list" /></template>
  </Button>
  <OverlayPanel ref="overlayPanel">
    <div class="overlay-panel">
      <div class="overlay-panel__option">
        <Dropdown
          class="overlay-panel__option__dropdown"
          v-model="selectedKabupaten"
          :options="kabupaten"
          placeholder="Pilih Kabupaten"
          :virtualScrollerOptions="{ itemSize: 38 }"
          filter
          />
        <Button class="overlay-panel__option__clear" v-if="selectedKabupaten" severity="danger" @click="clearOptionWrapper(() => selectedKabupaten = null)" outlined>
          <template #icon><Icon name="material-symbols:close" /></template>
        </Button>
      </div>
      <div class="overlay-panel__option">
        <Dropdown
          class="overlay-panel__option__dropdown"
          v-model="selectedTahun"
          :options="tahun"
          placeholder="Pilih Tahun"
          :virtualScrollerOptions="{ itemSize: 38 }"
          filter
          />
        <Button class="overlay-panel__option__clear" v-if="selectedTahun" severity="danger" @click="clearOptionWrapper(() => { selectedTahun = null; selectedBulan = null })" outlined>
          <template #icon><Icon name="material-symbols:close" /></template>
        </Button>
      </div>
      <div class="overlay-panel__option">
        <Dropdown
          class="overlay-panel__option__dropdown"
          v-model="selectedBulan"
          :options="bulan"
          optionLabel="name"
          placeholder="Pilih Bulan"
          :virtualScrollerOptions="{ itemSize: 38 }"
          filter
          :disabled="!selectedTahun"
          />
        <Button class="overlay-panel__option__clear" v-if="selectedBulan" severity="danger" @click="clearOptionWrapper(() => selectedBulan = null)" outlined>
          <template #icon><Icon name="material-symbols:close" /></template>
        </Button>
      </div>

      <div class="overlay-panel__confirm">
        <Button label="Clear" outlined @click="clearAll" :disabled="!filterOptionAvailable" />
        <Button label="Filter" :disabled="!filterOptionAvailable" @click="filter" />
      </div>
    </div>
  </OverlayPanel>
</template>

<script setup lang="ts">
import axios from 'axios';

const overlayPanel = ref();

const selectedKabupaten = ref();
const selectedTahun = ref();
const selectedBulan = ref();
const isFiltering = ref(false);

const filterOptionAvailable = computed(() => {
  return [selectedKabupaten.value, selectedTahun.value, selectedBulan.value].some((el: any) => el);
});

const kabupaten = ref();
const tahun = ref();
const bulan = ref([
  { name: "Januari", value: 1 },
  { name: "Febuari", value: 2 },
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
]);

const emit = defineEmits<{
  (e: "filter", selectedData: any): void
}>();

onMounted(async () => {
  window.onscroll = (e: any) => overlayPanel.value.hide(e);
  const filterOptions = (await axios.get("http://localhost:5000/api/filter-options")).data
  kabupaten.value = filterOptions.kabupaten;
  tahun.value = filterOptions.tahun;
});

const toggleOverlayPanel = (e: any) => overlayPanel.value.toggle(e);
const clearOptionWrapper = (callback: () => any) => {
  callback();
  if (!filterOptionAvailable.value) {
    isFiltering.value = false;
    emit('filter', {
      kabupaten: selectedKabupaten.value,
      tahun: selectedTahun.value,
      bulan: selectedBulan.value?.value
    });
  }
}
const clearAll = () => {
  selectedKabupaten.value = null;
  selectedTahun.value = null;
  selectedBulan.value = null;
  isFiltering.value = false;
  emit('filter', {
    kabupaten: selectedKabupaten.value,
    tahun: selectedTahun.value,
    bulan: selectedBulan.value?.value
  });
}
const filter = () => {
  isFiltering.value = true;
  emit('filter', {
    kabupaten: selectedKabupaten.value,
    tahun: selectedTahun.value,
    bulan: selectedBulan.value?.value
  });
}
</script>

<style scoped lang="scss">
.overlay-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 256px;

  &__option {
    display: flex;
    gap: 4px;
    width: 100%;

    &__dropdown {
      overflow: hidden;
      flex: 1;
    }

    &__clear {
      flex-shrink: 0;
    }
  }

  &__confirm {
    display: flex;
    gap: 4px;
    align-self: end;
  }
}
</style>
