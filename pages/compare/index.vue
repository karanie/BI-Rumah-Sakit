<template>
  <CompTable :srcs="sources">
  </CompTable>
</template>

<script setup lang="ts">
const sources = [
  { name: "Pendapatan", value: "/api/data/pendapatan" },
  { name: "Kunjungan/Kabupaten", value: "/api/data/demografi" },
];
</script>
