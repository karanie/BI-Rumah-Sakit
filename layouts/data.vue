<template>
  <NuxtLayout name="default">
    <div class="bi">
      <div class="bi__sidemenu">
        <Filter />
        <Menu :model="sidemenuItems" />
      </div>
      <div class="bi__content">
        <Message class="message" :closable="false">Data terkahir di-update pada <b>20xx/xx/xx</b></Message>
        <slot />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
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

.message {
  margin: 0;
}
</style>
