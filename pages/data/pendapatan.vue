<template>
  <div class="grid">
    <div class="grid-row1">
      <BICard src="/api/pendapatan" tipeData="totalPendapatan" color="green">
        <template #title>
          Total Pendapatan
        </template>
        <template #subtitle>
          Jumlah total tagihan pada
        </template>
      </BICard>
      <BICard src="/api/pendapatan" tipeData="totalPengeluaran" color="red">
        <template #title>
          Total Pengeluaran
        </template>
        <template #subtitle>
          Jumlah total semua hpp pada
        </template>
      </BICard>
    </div>

    <BIChart src="/api/pendapatan" timeseries type="line" forecast :setChartData="setPendapatanName"
      :chartOpt="setPendapatanChartDataOpt()">
      <template #title>Jumlah Pendapatan Seiring Waktu</template>
    </BIChart>

    <BIChart src="/api/pendapatan" timeseries tipeData="jenisregis" :chartOpt="setPendapatanChartDataOpt()" type="line">
      <template #title>Jumlah Pendapatan Seiring Waktu Berdasarkan jenis_registrasi</template>
    </BIChart>

    <Accordion expandIcon="pi pi-plus" collapseIcon="pi pi-minus" :lazy="true">
      <AccordionTab>
        <template #header>
          <span>
            <Icon style="font-size: 2.5rem; margin-right: 10px" color="var(--surface-400)"
              name="material-symbols:e911-emergency-rounded" />
            <span class="font-bold white-space-nowrap" style="margin-right: 10px;">IGD</span>
          </span>
        </template>
        <DetailPendapatan src="/api/pendapatan" jenisRegis="IGD">
          <template #title>Diagnosa Penyakit di IGD</template>
        </DetailPendapatan>
      </AccordionTab>

      <AccordionTab>
        <template #header>
          <span>
            <Icon style="font-size: 2.5rem; margin-right: 10px;" color="var(--surface-400)"
              name="material-symbols:outpatient-rounded" />
            <span class="font-bold white-space-nowrap" style="margin-right: 10px;">Rawat Jalan</span>
          </span>
        </template>
        <DetailPendapatan src="/api/pendapatan" jenisRegis="Rawat Jalan">
          <template #title>Poliklinik di Rawat Jalan</template>
        </DetailPendapatan>
      </AccordionTab>

      <AccordionTab>
        <template #header>
          <span>
            <Icon style="font-size: 2.5rem; margin-right: 10px;" color="var(--surface-400)"
              name="material-symbols:inpatient-rounded" />
            <span style="margin-right: 10px;">Rawat Inap</span>
          </span>
        </template>
        <DetailPendapatan src="/api/pendapatan" jenisRegis="Rawat Inap">
          <template #title>Diagnosa Penyakit di Rawat Inap</template>
        </DetailPendapatan>
      </AccordionTab>

      <AccordionTab>
        <template #header>
          <span>
            <Icon style="font-size: 2.5rem; margin-right: 10px;" color="var(--surface-400)"
              name="material-symbols:local-pharmacy-rounded" />
            <span style="margin-right: 10px;">OTC</span>
          </span>
        </template>
        <DetailPendapatan src="/api/pendapatan" jenisRegis="OTC" />
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script setup>

definePageMeta({
  layout: "data"
})

function setPendapatanName(data, forecastData) {
  const mapLabelName = {
    "total_tagihan": "Pengeluaran",
    "total_semua_hpp": "Pendapatan"
  }
  const out = {
    labels: data.index,
    datasets: data.columns.map((val, i) => {
      return {
        label: mapLabelName[val],
        data: data.values[i],
        pointStyle: false,
      }
    })
  }
  if (!forecastData) {
    return out;
  } else {
    console.log(forecastData);
    forecastData.forEach((el) => {
      out.datasets.push(
        {
          label: `${mapLabelName[el.columns[0]]} Forecast`,
          data: el.values[0].map((val, i) => {
            return { x: el.index[i], y: val }
          }),
          pointStyle: false,
        }
      );
    });
    return out;
  }
}

// Chart Options
const setPendapatanChartDataOpt = () => {
  return {
    plugins: {
      tooltip: {
        callbacks: {
          label: tooltipLabelCallbackCurrency({ style: 'currency', currency: 'IDR' }),
        }
      }
    }
  }
}

</script>

<style scoped lang="scss">
.grid {
  display: grid;
  gap: 20px;
}

.grid-row1 {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, 1fr);
}
</style>