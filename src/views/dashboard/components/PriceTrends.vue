<script setup lang="ts">
import { ref, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();
// Definisi props
const props = defineProps<{
  title: string;
  yAxisTitle: string;
  xAxisCategories: { daily: string[]; weekly: string[]; monthly: string[] };
  chartSeries: { daily: { name: string; data: number[] }[]; weekly: { name: string; data: number[] }[]; monthly: { name: string; data: number[] }[] };
}>();

// State untuk pilihan dropdown
const selectedOption = ref<'Daily' | 'Weekly' | 'Monthly'>('Daily');

// Mengupdate kategori X dan series data berdasarkan pilihan dropdown
const filteredXAxisCategories = computed(() => {
  return props.xAxisCategories[selectedOption.value.toLowerCase() as 'daily' | 'weekly' | 'monthly'];
});

const filteredChartSeries = computed(() => {
  return props.chartSeries[selectedOption.value.toLowerCase() as 'daily' | 'weekly' | 'monthly'];
});

// Konfigurasi utama ApexCharts
const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    height: 350,
    toolbar: { show: !mobile.value },
    zoom: { enabled: true },
    id: 'main-chart'
  },
  colors: ['#008FFB', '#FF8C42', '#4CAF50', '#FFC107'],
  stroke: { width: 2, curve: 'straight' },
  markers: { size: 5 },
  xaxis: { categories: filteredXAxisCategories.value },
  yaxis: { title: { text: props.yAxisTitle } },
  tooltip: { theme: 'dark' },
  legend: { position: 'top', horizontalAlign: 'center' }
}));
</script>

<template>
  <v-card elevation="10">
    <v-card-item>
      <v-row>
        <v-col>
          <v-card-title>{{ props.title }}</v-card-title>
        </v-col>
        <v-col>
          <v-select
            label="Categories"
            v-model="selectedOption"
            :items="['Daily', 'Weekly', 'Monthly']"
          ></v-select>
        </v-col>
      </v-row>
      <!-- Grafik utama -->
      <vue-apex-charts id="main-chart" type="line" height="350" :options="chartOptions" :series="filteredChartSeries" />
    </v-card-item>
  </v-card>
</template>