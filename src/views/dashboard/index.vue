<script setup lang="ts">
/*Call Components*/
import { ref } from 'vue';
import { onMounted } from 'vue';
import api from '@/plugins/axios';
import PriceTrends from '@/components/dashboard/PriceTrends.vue';
import DailyPrice from '@/components/dashboard/DailyPrice.vue';
import WeeklyPrice from '@/components/dashboard/WeeklyPrice.vue';
import BiweeklyPrice from '@/components/dashboard/BiweeklyPrice.vue';
import { fi } from 'date-fns/locale';
import { useDisplay } from 'vuetify';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader';
import func from 'vue-temp/vue-editor-bridge';

const { mobile } = useDisplay();
// Data untuk chart Harga terhadap waktu
const yAxisPriceTitle = 'Price';

const forecastData = ref<any[]>([]);
const dailyPriceX = ref<string[]>([]);
const weeklyPriceX = ref<string[]>([]);
const biweeklyPriceX = ref<string[]>([]);

const lastDailyKpbn = ref<number | null>(null);
const lastDailyDate = ref<string | null>(null);
const lastWeeklyKpbn = ref<number | null>(null);
const lastWeeklyDate = ref<string | null>(null);
const lastBiweeklyKpbn = ref<number | null>(null);
const lastBiweeklyDate = ref<string | null>(null);

const chartSeriesDailyPrice = ref<{ name: string; data: number[] }[]>([]);
const chartSeriesWeeklyPrice = ref<{ name: string; data: number[] }[]>([]);
const chartSeriesBiweeklyPrice = ref<{ name: string; data: number[] }[]>([]);

const token = localStorage.getItem('access_token');

const loading = ref(true); // Loading

onMounted(async () => {
    await getForecast();
    await getDataset();
});

async function getForecast() {
    try {
        const res = await api.get('http://103.41.204.232:81/dataset/forecast/lstm', {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

        forecastData.value = res.data.data;
    } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
    }
}

async function getDataset() {
    try {
        const res = await api.get('http://103.41.204.232:81/dataset', {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

        const rawData = res.data.data;

        // Get last date on each category
        const lastData = getLastData(rawData);
        lastDailyKpbn.value = lastData.lastDailyKpbn;
        lastDailyDate.value = lastData.lastDailyDate;

        lastWeeklyKpbn.value = lastData.lastWeeklyKpbn;
        lastWeeklyDate.value = lastData.lastWeeklyDate;

        lastBiweeklyKpbn.value = lastData.lastBiweeklyKpbn;
        lastBiweeklyDate.value = lastData.lastBiweeklyDate;

        // Daily: ambil 30 data terakhir
        const last30 = rawData.slice(-30);
        last30.sort((a: { date: string }, b: { date: string }) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Get forecast daily
        let forecastDaily = groupForecastData(lastDailyDate.value, 'Daily');
        console.log('Gibran', forecastDaily);

        const dailyCategories: string[] = [];
        const dailySeries = {
            forecast: [] as number[],
            kpbn: [] as number[],
            mdexC1: [] as number[],
            mdexC3: [] as number[],
            rotterdam: [] as number[]
        };

        last30.forEach((entry: any) => {
            dailyCategories.push(formatDate(entry.date));
            dailySeries.forecast.push(Number(parseFloat(entry.kpbn).toFixed(2)));
            dailySeries.kpbn.push(Number(parseFloat(entry.kpbn).toFixed(2)));
            dailySeries.mdexC1.push(Number(parseFloat(entry.mdex_c1).toFixed(2)));
            dailySeries.mdexC3.push(Number(parseFloat(entry.mdex_c3).toFixed(2)));
            dailySeries.rotterdam.push(Number(parseFloat(entry.rotterdam).toFixed(2)));
        });

        // Add forecast data
        dailyCategories.push(formatDate(forecastDaily.Tanggal));
        dailySeries.forecast.push(Number(parseFloat(forecastDaily.Prediksi).toFixed(2)));

        dailyPriceX.value = dailyCategories;
        chartSeriesDailyPrice.value = [
            { name: 'Forecast', data: dailySeries.forecast },
            { name: 'KPBN', data: dailySeries.kpbn },
            { name: 'MDEX C1', data: dailySeries.mdexC1 },
            { name: 'MDEX C3', data: dailySeries.mdexC3 },
            { name: 'Rotterdam', data: dailySeries.rotterdam }
        ];

        // Weekly
        const lastEntryDate = new Date(rawData[rawData.length - 1].date);
        const targetMonth = lastEntryDate.getMonth();
        const targetYear = lastEntryDate.getFullYear();

        const filteredWeekly = rawData.filter((entry: any) => {
            const date = new Date(entry.date);
            return date.getMonth() === targetMonth && date.getFullYear() === targetYear;
        });

        const groupedWeekly: Record<string, any[]> = {};
        filteredWeekly.forEach((entry: any) => {
            const date = new Date(entry.date);
            const weekNumber = Math.ceil(date.getDate() / 7);
            const monthName = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const key = `Week ${weekNumber} - ${monthName} ${year}`;
            if (!groupedWeekly[key]) groupedWeekly[key] = [];
            groupedWeekly[key].push(entry);
        });

        // Get forecast weekly
        let forecastWeekly = groupForecastData(lastWeeklyDate.value, 'Weekly');

        const weeklyCategories = Object.keys(groupedWeekly).sort((a, b) => {
            const weekNumA = parseInt(a.match(/Week (\d+)/)?.[1] || '0');
            const weekNumB = parseInt(b.match(/Week (\d)/)?.[1] || '0');
            return weekNumA - weekNumB;
        });

        const weeklySeries = {
            forecast: [] as number[],
            kpbn: [] as number[],
            mdexC1: [] as number[],
            mdexC3: [] as number[],
            rotterdam: [] as number[]
        };

        weeklyCategories.forEach((key) => {
            const group = groupedWeekly[key];
            weeklySeries.forecast.push(Number(parseFloat(group[group.length - 1].kpbn).toFixed(2)));
            weeklySeries.kpbn.push(Number(parseFloat(group[group.length - 1].kpbn).toFixed(2)));
            weeklySeries.mdexC1.push(Number(parseFloat(group[group.length - 1].mdex_c1).toFixed(2)));
            weeklySeries.mdexC3.push(Number(parseFloat(group[group.length - 1].mdex_c3).toFixed(2)));
            weeklySeries.rotterdam.push(Number(parseFloat(group[group.length - 1].rotterdam).toFixed(2)));
        });

        // Add forecast data
        weeklyCategories.push(formatDate(forecastWeekly.Tanggal));
        weeklySeries.forecast.push(Number(parseFloat(forecastWeekly.Prediksi).toFixed(2)));

        weeklyPriceX.value = weeklyCategories;
        chartSeriesWeeklyPrice.value = [
            { name: 'Forecast', data: weeklySeries.forecast },
            { name: 'KPBN', data: weeklySeries.kpbn },
            { name: 'MDEX C1', data: weeklySeries.mdexC1 },
            { name: 'MDEX C3', data: weeklySeries.mdexC3 },
            { name: 'Rotterdam', data: weeklySeries.rotterdam }
        ];

        // Biweekly
        const groupedBiweekly: Record<string, any[]> = {};
        rawData.forEach((entry: any) => {
            const date = new Date(entry.date);
            const day = date.getDate();
            const part = day <= 15 ? '1st Half' : '2nd Half';
            const biweeklyKey = `${part} - ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

            if (!groupedBiweekly[biweeklyKey]) groupedBiweekly[biweeklyKey] = [];
            groupedBiweekly[biweeklyKey].push(entry);
        });

        const biweeklyCategories = Object.keys(groupedBiweekly).sort((a, b) => {
            const getDate = (label: string) => {
                const match = label.match(/(1st|2nd) Half - (\w{3}) (\d{4})/);
                if (!match) return new Date();
                const [, half, month, year] = match;
                const day = half === '1st' ? 1 : 16;
                return new Date(`${month} ${day}, ${year}`);
            };
            return getDate(a).getTime() - getDate(b).getTime();
        });

        const biweeklySeries = {
            forecast: [] as number[],
            kpbn: [] as number[],
            mdexC1: [] as number[],
            mdexC3: [] as number[],
            rotterdam: [] as number[]
        };

        // Get forecast biweekly
        let forecastBiweekly = groupForecastData(lastBiweeklyDate.value, 'Weekly');

        biweeklyCategories.forEach((key) => {
            const group = groupedBiweekly[key];
            biweeklySeries.forecast.push(Number(parseFloat(group[group.length - 1].kpbn).toFixed(2)));
            biweeklySeries.kpbn.push(Number(parseFloat(group[group.length - 1].kpbn).toFixed(2)));
            biweeklySeries.mdexC1.push(Number(parseFloat(group[group.length - 1].mdex_c1).toFixed(2)));
            biweeklySeries.mdexC3.push(Number(parseFloat(group[group.length - 1].mdex_c3).toFixed(2)));
            biweeklySeries.rotterdam.push(Number(parseFloat(group[group.length - 1].rotterdam).toFixed(2)));
        });

        // Add forecast data
        biweeklyCategories.push(formatDate(forecastBiweekly.Tanggal));
        biweeklySeries.forecast.push(Number(parseFloat(forecastBiweekly.Prediksi).toFixed(2)));

        biweeklyPriceX.value = biweeklyCategories;
        chartSeriesBiweeklyPrice.value = [
            { name: 'Forecast', data: biweeklySeries.forecast },
            { name: 'KPBN', data: biweeklySeries.kpbn },
            { name: 'MDEX C1', data: biweeklySeries.mdexC1 },
            { name: 'MDEX C3', data: biweeklySeries.mdexC3 },
            { name: 'Rotterdam', data: biweeklySeries.rotterdam }
        ];
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    } finally {
        loading.value = false;
    }
}

function getLastData(rawData: any[]) {
    // Mengambil data KPBN terakhir untuk kategori Daily
    const lastEntry = rawData[rawData.length - 1];
    const lastDailyKpbn = Number(parseFloat(lastEntry.kpbn).toFixed(2));
    const lastDailyDate = lastEntry.date;

    // Mengambil data KPBN terakhir untuk kategori Weekly
    const lastWeekNumber = getWeekNumber(new Date(lastEntry.date));
    const filteredWeekly = rawData.filter((entry) => {
        const date = new Date(entry.date);
        return getWeekNumber(date) === lastWeekNumber && date.getFullYear() === new Date(lastEntry.date).getFullYear();
    });
    const lastWeeklyKpbn = filteredWeekly.length ? Number(parseFloat(filteredWeekly[filteredWeekly.length - 1].kpbn).toFixed(2)) : null;
    const lastWeeklyDate = filteredWeekly.length ? filteredWeekly[filteredWeekly.length - 1].date : null;

    // Mengambil data KPBN terakhir untuk kategori Biweekly
    const lastBiweeklyNumber = Math.ceil(lastWeekNumber / 2);
    const filteredBiweekly = rawData.filter((entry) => {
        const date = new Date(entry.date);
        return Math.ceil(getWeekNumber(date) / 2) === lastBiweeklyNumber && date.getFullYear() === new Date(lastEntry.date).getFullYear();
    });
    const lastBiweeklyKpbn = filteredBiweekly.length
        ? Number(parseFloat(filteredBiweekly[filteredBiweekly.length - 1].kpbn).toFixed(2))
        : null;
    const lastBiweeklyDate = filteredBiweekly.length ? filteredBiweekly[filteredBiweekly.length - 1].date : null;

    return {
        lastDailyKpbn,
        lastDailyDate,
        lastWeeklyKpbn,
        lastWeeklyDate,
        lastBiweeklyKpbn,
        lastBiweeklyDate
    };
}

// Format tanggal
function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// Daily
function getLast30Entries(data: any[]) {
    if (!Array.isArray(data)) return [];
    return data.slice(-30);
}

// Weekly
function groupByWeek(data: any[]) {
    const grouped: Record<string, any[]> = {};

    data.forEach((entry) => {
        const date = new Date(entry.date);
        const year = date.getFullYear();

        // Dapatkan minggu ke berapa dalam bulan (1-5)
        const weekNumber = Math.ceil(date.getDate() / 7);

        // Format nama bulan
        const monthName = date.toLocaleString('default', { month: 'short' });

        const key = `Week ${weekNumber} - ${monthName} ${year}`;

        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(entry);
    });

    return grouped;
}

function getWeekNumber(date: Date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

// Biweekly
function groupByBiweek(data: any[]) {
    const biweeks: Record<string, any[]> = {};

    data.forEach((entry) => {
        const date = new Date(entry.date);
        const yearBiweek = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!biweeks[yearBiweek]) {
            biweeks[yearBiweek] = [];
        }
        biweeks[yearBiweek].push(entry);
    });

    return biweeks;
}

function formatDateKey(date: any) {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        console.error('Invalid date in formatDateKey:', date);
        return null;
    }
    return d.toISOString().split('T')[0];
}


// grouping data
function groupForecastData(date: any, category: string) {
    let offset = 0;
    if (category === 'Daily') offset = 1;
    else if (category === 'Weekly') offset = 7;
    else if (category === 'Biweekly') offset = 14;
    
    const baseDate = new Date(date);
    baseDate.setDate(baseDate.getDate() + offset);

    const key = formatDateKey(baseDate);
    if (!key) return;

    const result = forecastData.value.find((f: any) => {
        const forecastDate = f.Tanggal;
        return forecastDate === key;
    });

    return result;
}

</script>

<template>
    <div>
        <div class="center mb-5">
            <h3 class="font-weight-bold">Historical Price Trends and Forecast</h3>
            <span class="text-textSecondary text-sm ml-2">(IDR/kg)</span>
        </div>
        <div>
            <div v-if="!mobile">
                <v-row>
                    <v-col class="min-card" cols="12" md="4">
                        <DailyPrice :latest-price="lastDailyKpbn" />
                    </v-col>
                    <v-col class="min-card" cols="12" md="4">
                        <WeeklyPrice :latest-price="lastWeeklyKpbn" />
                    </v-col>
                    <v-col class="min-card" cols="12" md="4">
                        <BiweeklyPrice :latest-price="lastBiweeklyKpbn" />
                    </v-col>
                </v-row>
            </div>

            <div v-else class="scroll-wrapper">
                <v-row class="flex-nowrap" gutters>
                    <v-col class="min-card" cols="12" md="4">
                        <DailyPrice :latest-price="lastDailyKpbn" />
                    </v-col>
                    <v-col class="min-card" cols="12" md="4">
                        <WeeklyPrice :latest-price="lastWeeklyKpbn" />
                    </v-col>
                    <v-col class="min-card" cols="12" md="4">
                        <BiweeklyPrice :latest-price="lastBiweeklyKpbn" />
                    </v-col>
                </v-row>
            </div>

            <div>
                <v-row>
                    <v-col cols="12" md="12">
                        <div v-if="loading">
                            <VSkeletonLoader type="article" />
                        </div>
                        <div v-else>
                            <PriceTrends
                                title="Price Trend & Chart"
                                :yAxisTitle="yAxisPriceTitle"
                                :xAxisCategories="{ daily: dailyPriceX, weekly: weeklyPriceX, biweekly: biweeklyPriceX }"
                                :chartSeries="{
                                    daily: chartSeriesDailyPrice,
                                    weekly: chartSeriesWeeklyPrice,
                                    biweekly: chartSeriesBiweeklyPrice
                                }"
                            />
                        </div>
                    </v-col>
                </v-row>
            </div>

            <!-- Footer -->
            <div>
                <v-col v-if="!mobile" class="text-center text-center mt-2 mb-0">
                    <p class="text-muted">KPBN</p>
                </v-col>
            </div>
        </div>
    </div>
</template>

<style scoped>
.scroll-wrapper {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 1rem;
}

.min-card {
    min-width: 250px;
    flex: 0 0 auto;
}
</style>
