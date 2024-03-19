<template>
  <Card>
    <template #title>Filter</template>
    <template #content>
      <div class="filter-panel">
        <div class="filter-panel__option">
          <Dropdown class="filter-panel__option__dropdown" v-model="selectedKabupaten" :options="kabupaten"
            placeholder="Pilih Kabupaten" :virtualScrollerOptions="{ itemSize: 38 }" filter />
          <Button class="filter-panel__option__clear" v-if="selectedKabupaten" severity="danger"
            @click="clearKabupatenOption" outlined>
            <template #icon>
              <Icon name="material-symbols:close" />
            </template>
          </Button>
        </div>
        <div class="filter-panel__option">
          <Dropdown class="filter-panel__option__dropdown" v-model="selectedTahun" :options="tahun"
            placeholder="Pilih Tahun" :virtualScrollerOptions="{ itemSize: 38 }" filter />
          <Button class="filter-panel__option__clear" v-if="selectedTahun" severity="danger" @click="clearTahunOption"
            outlined>
            <template #icon>
              <Icon name="material-symbols:close" />
            </template>
          </Button>
        </div>
        <div class="filter-panel__option">
          <Dropdown class="filter-panel__option__dropdown" v-model="selectedBulan" :options="bulan" optionLabel="name"
            placeholder="Pilih Bulan" :virtualScrollerOptions="{ itemSize: 38 }" filter :disabled="!selectedTahun" />
          <Button class="filter-panel__option__clear" v-if="selectedBulan" severity="danger" @click="clearBulanOption"
            outlined>
            <template #icon>
              <Icon name="material-symbols:close" />
            </template>
          </Button>
        </div>

        <div class="filter-panel__confirm">
          <Button label="Clear" outlined @click="$reset" :disabled="!filterOptionAvailable" />
          <Button label="Filter" :disabled="!filterOptionAvailable" @click="filter" />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import axios from 'axios';

const {
  selectedKabupaten,
  selectedTahun,
  selectedBulan,
  isFiltering,
  filterOptionAvailable,
} = storeToRefs(useDataFilter());

const {
  filter,
  clearOption,
  $reset,
} = useDataFilter();

watch(() => isFiltering, () => console.log(isFiltering));

// Could be the most stupidest thing i've written
function clearKabupatenOption() {
  clearOption(selectedKabupaten);
}
function clearTahunOption() {
  clearOption([selectedTahun, selectedBulan]);
}
function clearBulanOption() {
  clearOption(selectedBulan);
}

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

onMounted(async () => {
  const filterOptions = (await axios.get("http://localhost:5000/api/filter-options")).data
  kabupaten.value = filterOptions.kabupaten;
  tahun.value = filterOptions.tahun;
});
</script>

<style scoped lang="scss">
.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 210px;

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
