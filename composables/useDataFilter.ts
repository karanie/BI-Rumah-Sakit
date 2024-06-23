export const useDataFilter = defineStore('dataFilter', () => {
  const selectedKabupaten = ref();
  const selectedTimeFilterMode = ref();
  const selectedTahun = ref();
  const selectedBulan = ref();
  const selectedRelative = ref();
  const selectedDateRange = ref();
  const lastFilter = ref();

  const isFiltering = computed(() => Boolean(lastFilter.value));
  const kabupaten = ref();
  const timeFilterMode = ref();
  const tahun = ref();
  const bulan = ref();
  const relative = ref();
  const startDate = ref();
  const endDate = ref();

  const filterOptionAvailable = computed(() => {
    return [selectedKabupaten.value, selectedTahun.value, selectedBulan.value].some((el: any) => el);
  });

  function filter() {
    lastFilter.value = Date.now();
    kabupaten.value = selectedKabupaten.value;
    tahun.value = selectedTahun.value;
    bulan.value = selectedBulan.value.value;
    relative.value = selectedRelative.value.value;
    startDate.value = selectedDateRange.value[0];
    endDate.value = selectedDateRange.value[1];
    console.log(isFiltering.value);
  }

  function clearOption(data: any) {
    selectedDateRange.value = null;
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
      bulan.value = selectedBulan.value?.value;
      relative.value = selectedRelative.value?.value;
      startDate.value = null;
      endDate.value = null;
    }
  }

  function $reset() {
    selectedKabupaten.value = null;
    selectedTahun.value = null;
    selectedBulan.value = null;
    relative.value = null;
    startDate.value = null;
    endDate.value = null;
    lastFilter.value = null;

    kabupaten.value = selectedKabupaten.value;
    tahun.value = selectedTahun.value;
    bulan.value = selectedBulan.value.value;
    relative.value = selectedRelative.value.value;
    startDate.value = selectedDateRange.value[0];
    endDate.value = selectedDateRange.value[1];
  }

  return {
    selectedKabupaten,
    selectedTimeFilterMode,
    selectedTahun,
    selectedBulan,
    selectedRelative,
    selectedDateRange,
    kabupaten,
    timeFilterMode,
    tahun,
    bulan,
    relative,
    startDate,
    endDate,
    lastFilter,
    isFiltering,
    filter,
    filterOptionAvailable,
    clearOption,
    $reset,
  };
});
