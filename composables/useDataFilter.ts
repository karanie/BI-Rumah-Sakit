export const useDataFilter = defineStore('dataFilter', () => {
  const selectedKabupaten = ref();
  const selectedTahun = ref();
  const selectedBulan = ref();
  const lastFilter = ref();

  const isFiltering = computed(() => Boolean(lastFilter.value));
  const kabupaten = ref();
  const tahun = ref();
  const bulan = ref();

  const filterOptionAvailable = computed(() => {
    return [selectedKabupaten.value, selectedTahun.value, selectedBulan.value].some((el: any) => el);
  });

  function filter() {
    lastFilter.value = Date.now();
    kabupaten.value = selectedKabupaten.value;
    tahun.value = selectedTahun.value;
    bulan.value = selectedBulan.value.value;
    console.log(isFiltering.value);
  }

  function clearOption(data: any) {
    if (Array.isArray(data)) {
      data.forEach(i => {
        i.value = null;
      });
    } else {
      data.value = null;
    }
    if (!filterOptionAvailable.value) {
      lastFilter.value = null;
      kabupaten.value = selectedKabupaten.value;
      tahun.value = selectedTahun.value;
      bulan.value = selectedBulan.value.value;
    }
  }

  function $reset() {
    selectedKabupaten.value = null;
    selectedTahun.value = null;
    selectedBulan.value = null;
    lastFilter.value = null;

    kabupaten.value = selectedKabupaten.value;
    tahun.value = selectedTahun.value;
    bulan.value = selectedBulan.value.value;
  }

  return {
    selectedKabupaten,
    selectedTahun,
    selectedBulan,
    kabupaten,
    tahun,
    bulan,
    lastFilter,
    isFiltering,
    filter,
    filterOptionAvailable,
    clearOption,
    $reset,
  };
});
