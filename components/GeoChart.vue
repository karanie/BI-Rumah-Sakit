<template>
  <div class="geochart">
    <LMap
      v-if="data"
      ref="map"
      :zoom="7.5"
      :center="[0.720, 101.464]"
      :minZoom="7.5"
      :maxZoom="7.5"
      :options="{ zoomControl: false }"
      @ready="onMapReady"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
      />
      <LGeoJson ref="geojsonLayer" @ready="onGeoJsonReady" :geojson="riauGeoData" :options="geoOptions" :optionsStyle="setGeoStyle" />
      <LControl position="bottomleft">
        <LCustomControlColorLegends :legends="legends" />
      </LControl>
      <LControl position="topright">
        <LCustomControl>
          <div class="l-control-data">
            <template v-if="!isHovered">Hover cursor ke kabupaten</template>
            <template v-if="isHovered">
              <b>{{ getHoveredData.name }}</b><br/>{{ getHoveredData.value }}
            </template>
          </div>
        </LCustomControl>
      </LControl>
    </LMap>
  </div>
</template>

<script setup>
import riauGeoData from '@/data/riau.geo.json';

const props = defineProps(["options", "data"]);

const geojsonLayer = ref();
const isHovered = ref(false);
const hoveredData = ref();
const legends = ref();
const map = ref();
const data = computed(() => {
  return props.data?.labels.map((el, idx) => {
    return {
      label: el,
      value: props.data?.datasets[0].data[idx],
    }
  });
});
const max = computed(() => {
  return data.value.reduce((a, b) => Math.max(a, b.value), -Infinity);
})
function formatNum(num) {
  return new Intl.NumberFormat(navigator.language).format(num);
}
const getHoveredData = computed(() => {
  const titleCallback = props?.options?.plugins?.tooltip?.callbacks?.title ?? (val => val);
  const labelCallback = props?.options?.plugins?.tooltip?.callbacks?.label ?? formatNum;
  return {
    name: titleCallback(hoveredData.value.name),
    value: labelCallback(hoveredData.value.value),
  }
});

const pallete = ['#ece7f2','#a6bddb','#74a9cf','#0570b0','#023858'];

watch(data, () => {
  //const maxRounded = Math.ceil(max / Math.pow(10, Math.floor(Math.log10(max)))) * Math.pow(10, Math.floor(Math.log10(max)));
  legends.value = generateLegends(getColor, max.value);
}, { immediate: true });

function onGeoJsonReady(e) {
  map.value.leafletObject.fitBounds(e.getBounds());
}

function getColor(n, max=1000) {
  return n <= 0 ? pallete[0]
    : n >= max ? pallete[pallete.length - 1]
    : pallete[Math.floor(n / max * pallete.length)];
}

function generateLegends(getColor, max=1000) {
  return [...Array(pallete.length).keys()].map(i => {
    return {
      label: i == 0 ? `<${formatNum(Math.round((i+1)/pallete.length * max, 2))}`
        : i == pallete.length - 1 ? `>${formatNum(Math.round((i)/pallete.length * max, 2))}`
        :`${formatNum(Math.round(i/pallete.length * max, 2))}-${formatNum(Math.round((i+1)/pallete.length * max, 2))}`,
      color: getColor(i/pallete.length * max, max),
    }
  });
}

function findCityInData(arr, city) {
  city = city.replace(/(Kota|Kab\.|Kabupaten)/i, "").trim();
  return arr.find(
      i => i.label.match(new RegExp("\\w*" + city + "\\w*", "i"))
  );
}

function setGeoStyle(feature) {
  return {
    fillColor: getColor(findCityInData(data.value, feature.properties.tags.official_name)?.value, max.value),
    weight: 2,
    opacity: 1,
    color: 'gray',
    dashArray: '3',
    fillOpacity: 0.75,
  };
}

function handleMouseOver(e) {
  const layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });
  layer.bringToFront();

  isHovered.value = true;
  hoveredData.value = {
    name: layer.feature.properties.tags.official_name,
    value: findCityInData(data.value, layer.feature.properties.tags.official_name)?.value,
  }
}

function handleMouseOut(e) {
  geojsonLayer.value.leafletObject.resetStyle(e.target);
  isHovered.value = false;
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: handleMouseOver,
    mouseout: handleMouseOut,
  });
}

const geoOptions = {
  onEachFeature: onEachFeature,
}
</script>

<style scoped lang="scss">
.geochart {
  width: 100%;
  height: 70vh;
}

.l-control-data {
  text-align: end;
}
</style>
