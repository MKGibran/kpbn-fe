<script setup lang="ts">
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// Definisi props
const props = defineProps<{
  title: string;
  yAxisTitle: string;
  xAxisCategories: string[];
  chartSeries: { name: string; data: number[] }[]
}>();

// Data series untuk Line Chart (semua kategori sama)


// Konfigurasi utama ApexCharts
const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    height: 350,
    toolbar: { show: true },
    zoom: { enabled: true },
    id: 'main-chart'
  },
  colors: ['#008FFB', '#FF8C42', '#4CAF50', '#FFC107'],
  stroke: { width: 2, curve: 'smooth' },
  markers: { size: 5 },
  xaxis: { categories: props.xAxisCategories },
  yaxis: { title: { text: props.yAxisTitle } },
  tooltip: { theme: 'dark' },
  legend: { position: 'top', horizontalAlign: 'center' }
}));
</script>

<template>
  <v-card elevation="10">
    <v-card-item>
      <v-card-title>{{ props.title }}</v-card-title>
      <!-- Grafik utama -->
      <vue-apex-charts id="main-chart" type="line" height="350" :options="chartOptions" :series="chartSeries" />
    </v-card-item>
  </v-card>
</template>
