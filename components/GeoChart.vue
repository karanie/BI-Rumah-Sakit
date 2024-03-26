<template>
  <div class="geochart">
    <LMap
      ref="map"
      :zoom="7.5"
      :center="[0.720, 101.464]"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
      />
      <LGeoJson ref="geojsonLayer" :geojson="riauGeoData" :options="geoOptions" :optionsStyle="setGeoStyle" />
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
const data = computed(() => toRaw(props.data));

const getHoveredData = computed(() => {
  const labelCallback = props?.options?.plugins?.tooltip?.callbacks?.label ?? (val => val);
  const titleCallback = props?.options?.plugins?.tooltip?.callbacks?.title ?? (val => val);
  return {
    name: titleCallback(hoveredData.value.name),
    value: labelCallback(hoveredData.value.value),
  }
});

const pallete = ['#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#045a8d','#023858'];

function getColor(n, max=1000) {
  return n <= 0 ? pallete[0]
    : n >= max ? pallete[pallete.length - 1]
    : pallete[Math.floor(n / max * pallete.length)];
}

function generateLegends(getColor, max=1000) {
  return [...Array(pallete.length).keys()].map(i => {
    return {
      label: `${Math.round(i/pallete.length * max, 2)}-${Math.round((i+1)/pallete.length * max, 2)}`,
      color: getColor(i/pallete.length * max, max),
    }
  });
}

const legends = generateLegends(getColor, 1000000)

function setGeoStyle(feature) {
  return {
    fillColor: getColor(feature.properties.tags.population, 1000000),
    weight: 2,
    opacity: 1,
    color: 'white',
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
    value: layer.feature.properties.tags.population,
  }

  console.log(data.value);
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
