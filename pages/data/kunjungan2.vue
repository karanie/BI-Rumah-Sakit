<template>
    <DetailKunjungan src="/api/diagnosa" jenisRegis="IGD">
        <template #title>Diagnosa Penyakit IGD</template>
    </DetailKunjungan>

    <DetailKunjungan src="/api/diagnosa" jenisRegis="Rawat Inap">
        <template #title>Diagnosa Penyakit Rawat Inap</template>
    </DetailKunjungan>
</template>

<script setup>
definePageMeta({
    layout: "data",
});
</script>