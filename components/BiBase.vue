<template>
  <div class="bi">
    <div class="bi__sidemenu">
      <Filter @filter="filter" />
      <Menu :model="sidemenuItems" />
    </div>
    <div class="bi__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "filter", selectedData: any): void
}>();

const filter = (selectedData: any) => {
  emit('filter', selectedData);
}

const sidemenuItems = [
  {
    label: "Usia",
    command: () => navigateTo("/data/usia"),
  },
  {
    label: "Jenis Kelamin",
    command: () => navigateTo("/data/jenis_kelamin"),
  },
  {
    label: "Demografi",
    command: () => navigateTo("/data/demografi"),
  },
  {
    label: "Penjamin",
    command: () => navigateTo("/data/penjamin"),
  },
  {
    label: "Contoh Chart",
    command: () => navigateTo("/data/contoh_chart"),
  },
]
</script>

<style scoped lang="scss">
.bi {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 16px;
  padding: 8px;
  flex-direction: row;

  &__sidemenu {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: sticky;
    top: calc(55px + 8px); //topbar height + padding
    max-width: 256px;
    height: fit-content;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }
}

</style>
