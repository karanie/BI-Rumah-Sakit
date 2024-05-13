<template>
  <CompTable :srcs="sources">
  </CompTable>
</template>

<script setup lang="ts">
const sources = [
  { name: "Pendapatan", value: "/api/pendapatan" },
  { name: "Kunjungan/Kabupaten", value: "/api/demografi" },
];
</script>
