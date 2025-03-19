<script setup lang="ts">
/*Call Components*/
import { ref } from 'vue';
import PriceTrends from '../dashboard/components/PriceTrends.vue';
import MonthlyPrice from '../dashboard/components/MonthlyPrice.vue';
import QuarterlyPrice from '../dashboard/components/QuarterlyPrice.vue';
import YearlyPrice from '../dashboard/components/YearlyPrice.vue';

// Data untuk chart Harga terhadap waktu
const yAxisPriceTitle = 'Price';

const dailyPriceX = [
    '10-02-2024', '11-02-2024', '12-02-2024', '13-02-2024', '14-02-2024',
    '15-02-2024', '16-02-2024', '17-02-2024', '18-02-2024', '19-02-2024'
];
const chartSeriesDailyPrice = ref([
    { name: 'Actual Price', data: [100, 105, 110, 108, 112, 115, 118, 120, 125, 120] },
    { name: 'External Knowledge', data: [100, 105, 110, 108, 112, 115, 118, 120, 125, 135] },
    { name: 'Expert Judge', data: [100, 105, 110, 108, 112, 115, 118, 120, 125, 125] },
    { name: 'X', data: [100, 105, 110, 108, 112, 115, 118, 120, 125, 140] }
]);

const weeklyPriceX = [
    'Week 1', 'Week 2', 'Week 3', 'Week 4'
];
const chartSeriesWeeklyPrice = ref([
    { name: 'Actual Price', data: [118, 120, 125, 120] },
    { name: 'External Knowledge', data: [118, 120, 125, 135] },
    { name: 'Expert Judge', data: [118, 120, 125, 125] },
    { name: 'X', data: [118, 120, 125, 140] }
]);

const monthlyPriceX = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
];
const chartSeriesMonthlyPrice = ref([
    { name: 'Actual Price', data: [100, 105, 110, 108, 112, 115, 105, 110, 118, 120, 125, 120] },
    { name: 'External Knowledge', data: [100, 105, 110, 108, 112, 115, 105, 110, 118, 120, 125, 135] },
    { name: 'Expert Judge', data: [100, 105, 110, 108, 112, 115, 105, 110, 118, 120, 125, 125] },
    { name: 'X', data: [100, 105, 110, 108, 112, 115, 105, 110, 118, 120, 125, 140] }
]);

// Data untuk chart Volume terhadap Waktu
const yAxisVolumeTitle = 'Volume';

const dailyVolumeX = [
    '10-02-2024', '11-02-2024', '12-02-2024', '13-02-2024', '14-02-2024',
    '15-02-2024', '16-02-2024', '17-02-2024', '18-02-2024', '19-02-2024'
];
const chartSeriesDailyVolume = ref([
    { name: 'Actual Volume', data: [100, 105, 110, 108, 112, 115, 118, 120, 125, 120] },
    { name: 'External Knowledge', data: [100, 105, 110, 108, 112, 115, 118, 120, 125, 135] },
    { name: 'Expert Judge', data: [100, 105, 110, 108, 112, 115, 118, 120, 125, 125] },
    { name: 'X', data: [100, 105, 110, 108, 112, 115, 118, 120, 125, 140] }
]);

const weeklyVolumeX = [
    'Week 1', 'Week 2', 'Week 3', 'Week 4'
];
const chartSeriesWeeklyVolume = ref([
    { name: 'Actual Volume', data: [118, 120, 125, 120] },
    { name: 'External Knowledge', data: [118, 120, 125, 135] },
    { name: 'Expert Judge', data: [118, 120, 125, 125] },
    { name: 'X', data: [118, 120, 125, 140] }
]);

const monthlyVolumeX = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
];
const chartSeriesMonthlyVolume = ref([
    { name: 'Actual Volume', data: [100, 105, 110, 108, 112, 115, 105, 110, 118, 120, 125, 120] },
    { name: 'External Knowledge', data: [100, 105, 110, 108, 112, 115, 105, 110, 118, 120, 125, 135] },
    { name: 'Expert Judge', data: [100, 105, 110, 108, 112, 115, 105, 110, 118, 120, 125, 125] },
    { name: 'X', data: [100, 105, 110, 108, 112, 115, 105, 110, 118, 120, 125, 140] }
]);
</script>

<template>
    <div>
        <v-row class="center mb-5">
            <h3 class="font-weight-bold">Historical Price Trends and Forecast</h3>
            <span class="text-textSecondary text-sm ml-2">(IDR/kg)</span>
        </v-row>
        <v-row>
            <v-row>
                <v-col cols="12" md="4">
                    <MonthlyPrice />
                </v-col>
                <v-col cols="12" md="4">
                    <QuarterlyPrice />
                </v-col>
                <v-col cols="12" md="4">
                    <YearlyPrice />
                </v-col>
            </v-row>
            <v-col cols="12" md="12">
                <PriceTrends
                    title="Price Trend & Chart"
                    :yAxisTitle="yAxisPriceTitle"
                    :xAxisCategories="{ daily: dailyPriceX, weekly: weeklyPriceX, monthly: monthlyPriceX }"
                    :chartSeries="{ daily: chartSeriesDailyPrice, weekly: chartSeriesWeeklyPrice, monthly: chartSeriesMonthlyPrice }"
                />
                </v-col>

                <v-col cols="12" md="12">
                <PriceTrends
                    title="Volume Trend & Chart"
                    :yAxisTitle="yAxisVolumeTitle"
                    :xAxisCategories="{ daily: dailyVolumeX, weekly: weeklyVolumeX, monthly: monthlyVolumeX }"
                    :chartSeries="{ daily: chartSeriesDailyVolume, weekly: chartSeriesWeeklyVolume, monthly: chartSeriesMonthlyVolume }"
                />
                </v-col>
            <v-col class="text-center text-center mt-2 mb-0">
                <p class="text-muted">KPBN</p>
            </v-col>
        </v-row>
    </div>
</template>
