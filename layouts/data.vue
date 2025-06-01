<template>
  <NuxtLayout name="default">
    <div class="bi">
      <div class="bi__sidemenu">
        <Filter />
      </div>

      <!-- Last Update Notice -->
      <div class="bi__content">
        <Message class="message" :closable="false">
          Waktu registrasi pasien terakhir dari tanggal
          <b>{{ data?.waktuRegistrasiTerakhir }}</b>
        </Message>

        <!-- Card -->
        <div class="container">
      <div class="container__card">
        <BIClickableCard link="/data/pasien" src="/api/pasien" tipeData="jumlahPasien" listenUpdate>
          <template #title>Total Pasien</template>
          <template #subtitle>{{ getBulanOrTahun() }}</template>
        </BIClickableCard>
      </div>
      <div class="container__card">
        <BIClickableCard link="/data/kunjungan" src="/api/kunjungan" tipeData="jumlahKunjungan" listenUpdate>
          <template #title>Total Kunjungan</template>
          <template #subtitle>{{ getBulanOrTahun() }}</template>
        </BIClickableCard>
      </div>
      <div class="container__card">
        <BIClickableCard link="/data/pendapatan" src="/api/pendapatan" tipeData="profit" currency listenUpdate>
          <template #title>Total Profit</template>
          <template #subtitle>{{ getBulanOrTahun() }} </template>
        </BIClickableCard>
      </div>
    </div>
        <slot />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// TODO: format datetime based on browser locale
const { data } = useFetch("/api/last-update");

const {
    tahun,
    bulan,
    kabupaten,
    selectedBulan,
    lastFilter,
} = storeToRefs(useDataFilter());

function getBulanOrTahun(){
  if (!tahun.value){
    return "Bulan waktu registrasi terakhir data di-update"
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

.numeric-data {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);

  &__card {
    width: 100%;
    text-decoration: none;

    &.active {
      background-color: var(--cyan-100);
      color : var(--surface-800);
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

  .big-number {
    font-weight: bold;
    font-size: 24px;
  }
}

.no-underline {
  text-decoration: none;
}

.message {
  margin: 0;
}

.container {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;

  &__card{
    width: 100%;
  }
}

</style>
