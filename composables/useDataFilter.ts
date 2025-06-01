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
    selectedDateRange.value = undefined;
    if (Array.isArray(data)) {
      data.forEach(i => {
        i.value = undefined;
      });
    } else {
      data.value = undefined;
    }
    if (!filterOptionAvailable.value) {
      lastFilter.value = undefined;
      kabupaten.value = selectedKabupaten.value;
      tahun.value = selectedTahun.value;
      bulan.value = selectedBulan.value?.value;
      relative.value = selectedRelative.value?.value;
      startDate.value = undefined;
      endDate.value = undefined;
    }
  }

  function $reset() {
    selectedKabupaten.value = undefined;
    selectedTahun.value = undefined;
    selectedBulan.value = undefined;
    relative.value = undefined;
    startDate.value = undefined;
    endDate.value = undefined;
    lastFilter.value = undefined;

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
