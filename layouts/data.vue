<template>
  <NuxtLayout name="default">
    <div class="bi">
      <div class="bi__sidemenu">
        <Filter />
      </div>
      <div class="bi__content">
        <Message class="message" :closable="false">
          Data terakhir di-update pada
          <b>{{ data?.mtimeLocaltime }}</b>
        </Message>
        <Message class="message" :closable="false">
          Waktu registrasi pasien terakhir dari tanggal
          <b>{{ data?.waktuRegistrasiTerakhir }}</b>
        </Message>

        <div class="numeric-data">
          <Nuxt-link to="/data/pasien" class="no-underline">
            <Card :class="{ 'active': activeCard === 0 }" class="numeric-data__card" @click="setActiveCard(0)">
              <template #title>Total Pasien</template>
              <template #subtitle>Jumlah pasien</template>
              <template #content>
                <div class="big-number">{{ getJumlahPasien }}</div>
              </template>
            </Card>
          </Nuxt-link>

          <Nuxt-link to="/data/kunjungan" class="no-underline">
            <Card :class="{ 'active': activeCard === 1 }" class="numeric-data__card" @click="setActiveCard(1)">
              <template #title>Total Kunjungan</template>
              <template #subtitle>Jumlah Kunjungan</template>
              <template #content>
                <div class="big-number">{{ getJumlahKunjungan }}</div>
              </template>
            </Card>
          </Nuxt-link>

          <Nuxt-link to="/data/pendapatan" class="no-underline">
            <Card :class="{ 'active': activeCard === 2 }" class="numeric-data__card" @click="setActiveCard(2)">
              <template #title>Total Pendapatan</template>
              <template #subtitle>Jumlah Pendapatan</template>
              <template #content>
                <div class="big-number">Rp{{ getJumlahPendapatan }}</div>
              </template>
            </Card>
          </Nuxt-link>
        </div>

        <slot />
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
// TODO: format datetime based on browser locale
const { data } = useFetch("http://localhost:5000/api/last-update");

import Chart from 'primevue/chart';
import axios from 'axios';

const {
  bulan,
  tahun,
  kabupaten,
  lastFilter,
} = storeToRefs(useDataFilter());

const jumlahPasien = ref();
const jumlahKunjungan = ref();
const jumlahPendapatan = ref();

const activeCard = ref(0);

const getJumlahPasien = computed(() => new Intl.NumberFormat().format(jumlahPasien.value));
const getJumlahKunjungan = computed(() => new Intl.NumberFormat().format(jumlahKunjungan.value));
const getJumlahPendapatan = computed(() => new Intl.NumberFormat().format(jumlahPendapatan.value));

onMounted(async () => {
  const data = (await axios.get("http://localhost:5000/api/dashboard", {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  })).data
  console.log(data);
  jumlahPasien.value = data.jumlahPasien;
  jumlahKunjungan.value = data.jumlahKunjungan;
  jumlahPendapatan.value = data.pendapatan;

});

watch(lastFilter, async () => {
  const data = (await axios.get("http://localhost:5000/api/dashboard", {
    params: {
      tahun: tahun.value,
      bulan: bulan.value,
      kabupaten: kabupaten.value,
    }
  })).data
  jumlahPasien.value = data.jumlahPasien;
  jumlahKunjungan.value = data.jumlahKunjungan;
  jumlahPendapatan.value = data.pendapatan;
  
});

const setActiveCard = (index) => {
  activeCard.value = index
  console.log('hasil', activeCard.value)
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
    font-size: 30px;
  }
}

.no-underline {
  text-decoration: none;
}

.message {
  margin: 0;
}
</style>
