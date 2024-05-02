<template>
    <Message class="message" :closable="false">
        Data terakhir di-update pada
        <b> xxxx</b>
    </Message>
    <Message class="message" :closable="false">
        Waktu registrasi pasien terakhir dari tanggal
        <b> xxxx </b>
    </Message>

    <div class="grid">
        <div class="grid__item1">
            <ComparisonFilter></ComparisonFilter>
            <BIChart src="/api/demografi" type="line" tipeData="timeseries" style="height: 100%;">
                <template #title>Data 1</template>
            </BIChart>
        </div>

        <div class="grid__item2">
            <ComparisonFilter></ComparisonFilter>
            <BIChart src="/api/jeniskelamin" type="line" style="height: 100%;">
                <template #title>Data 2</template>
            </BIChart>
        </div>
    </div>

</template>

<script setup>

</script>

<style scoped lang="scss">
.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    &__item1 {
        padding: 10px;
    }

    &__item2 {
        padding: 10px;
    }
}
</style>