<script setup lang="ts">
/*Call Components*/
import { ref } from 'vue';
import { onMounted } from 'vue';
import api from '@/plugins/axios';
import PriceTrends from '../dashboard/components/PriceTrends.vue';
import MonthlyPrice from '../dashboard/components/MonthlyPrice.vue';
import QuarterlyPrice from '../dashboard/components/QuarterlyPrice.vue';
import YearlyPrice from '../dashboard/components/YearlyPrice.vue';
import { fi } from 'date-fns/locale';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();
// Data untuk chart Harga terhadap waktu
const yAxisPriceTitle = 'Price';

// Data untuk chart Volume terhadap Waktu
const yAxisVolumeTitle = 'Volume';

const dailyPriceX = ref<string[]>([]);
const weeklyPriceX = ref<string[]>([]);
const monthlyPriceX = ref<string[]>([]);
const chartSeriesDailyPrice = ref<{ name: string; data: number[] }[]>([]);
const chartSeriesWeeklyPrice = ref<{ name: string; data: number[] }[]>([]);
const chartSeriesMonthlyPrice = ref<{ name: string; data: number[] }[]>([]);

const dailyVolumeX = ref([]);
const weeklyVolumeX = ref([]);
const monthlyVolumeX = ref([]);
const chartSeriesDailyVolume = ref([]);
const chartSeriesWeeklyVolume = ref([]);
const chartSeriesMonthlyVolume = ref([]);

const loading = ref(true); // Loading

onMounted(async () => {
    try {
        const token = localStorage.getItem('access_token');
        const res = await api.get('http://103.41.204.232:81/dataset', {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

        const rawData = res.data.data;

        // Daily: ambil 30 data terakhir
        const last30 = rawData.slice(-30);
        last30.sort((a: { date: string }, b: { date: string }) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const dailyCategories: string[] = [];
        const dailySeries = {
            kpbn: [] as number[],
            mdexC1: [] as number[],
            mdexC3: [] as number[],
            rotterdam: [] as number[]
        };

        last30.forEach((entry: any) => {
            dailyCategories.push(formatDate(entry.date));
            dailySeries.kpbn.push(Number(parseFloat(entry.kpbn).toFixed(2)));
            dailySeries.mdexC1.push(Number(parseFloat(entry.mdex_c1).toFixed(2)));
            dailySeries.mdexC3.push(Number(parseFloat(entry.mdex_c3).toFixed(2)));
            dailySeries.rotterdam.push(Number(parseFloat(entry.rotterdam).toFixed(2)));
        });

        dailyPriceX.value = dailyCategories;
        chartSeriesDailyPrice.value = [
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

        const weeklyCategories = Object.keys(groupedWeekly).sort((a, b) => {
            const weekNumA = parseInt(a.match(/Week (\d)/)?.[1] || '0');
            const weekNumB = parseInt(b.match(/Week (\d)/)?.[1] || '0');
            return weekNumA - weekNumB;
        });

        const weeklySeries = {
            kpbn: [] as number[],
            mdexC1: [] as number[],
            mdexC3: [] as number[],
            rotterdam: [] as number[]
        };

        weeklyCategories.forEach((key) => {
            const group = groupedWeekly[key];
            const avg = (key: keyof (typeof group)[0]) =>
                Number((group.reduce((sum, item) => sum + parseFloat(item[key]), 0) / group.length).toFixed(2));

            weeklySeries.kpbn.push(avg('kpbn'));
            weeklySeries.mdexC1.push(avg('mdex_c1'));
            weeklySeries.mdexC3.push(avg('mdex_c3'));
            weeklySeries.rotterdam.push(avg('rotterdam'));
        });

        weeklyPriceX.value = weeklyCategories;
        chartSeriesWeeklyPrice.value = [
            { name: 'KPBN', data: weeklySeries.kpbn },
            { name: 'MDEX C1', data: weeklySeries.mdexC1 },
            { name: 'MDEX C3', data: weeklySeries.mdexC3 },
            { name: 'Rotterdam', data: weeklySeries.rotterdam }
        ];

        // Monthly
        const groupedMonthly: Record<string, any[]> = {};
        rawData.forEach((entry: any) => {
            const date = new Date(entry.date);
            const monthKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            if (!groupedMonthly[monthKey]) groupedMonthly[monthKey] = [];
            groupedMonthly[monthKey].push(entry);
        });

        const monthlyCategories = Object.keys(groupedMonthly).sort((a, b) => {
            const getDate = (label: string) => {
                const parts = label.split(' ');
                return new Date(`${parts[0]} 01, ${parts[1]}`);
            };
            return getDate(a).getTime() - getDate(b).getTime();
        });

        const monthlySeries = {
            kpbn: [] as number[],
            mdexC1: [] as number[],
            mdexC3: [] as number[],
            rotterdam: [] as number[]
        };

        monthlyCategories.forEach((key) => {
            const group = groupedMonthly[key];
            const avg = (key: keyof (typeof group)[0]) =>
                Number((group.reduce((sum, item) => sum + parseFloat(item[key]), 0) / group.length).toFixed(2));

            monthlySeries.kpbn.push(avg('kpbn'));
            monthlySeries.mdexC1.push(avg('mdex_c1'));
            monthlySeries.mdexC3.push(avg('mdex_c3'));
            monthlySeries.rotterdam.push(avg('rotterdam'));
        });

        monthlyPriceX.value = monthlyCategories;
        chartSeriesMonthlyPrice.value = [
            { name: 'KPBN', data: monthlySeries.kpbn },
            { name: 'MDEX C1', data: monthlySeries.mdexC1 },
            { name: 'MDEX C3', data: monthlySeries.mdexC3 },
            { name: 'Rotterdam', data: monthlySeries.rotterdam }
        ];
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    } finally {
        loading.value = false;
    }
});

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

function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7);
}

// Monthly
function groupByMonth(data: any[]) {
    const months: Record<string, any[]> = {};

    data.forEach((entry) => {
        const date = new Date(entry.date);
        const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (!months[yearMonth]) {
            months[yearMonth] = [];
        }
        months[yearMonth].push(entry);
    });

    return months;
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
                        <MonthlyPrice />
                    </v-col>
                    <v-col class="min-card" cols="12" md="4">
                        <QuarterlyPrice />
                    </v-col>
                    <v-col class="min-card" cols="12" md="4">
                        <YearlyPrice />
                    </v-col>
                </v-row>
            </div>

            <div v-else class="scroll-wrapper">
                <v-row class="flex-nowrap" gutters>
                    <v-col class="min-card" cols="12" md="4">
                        <MonthlyPrice />
                    </v-col>
                    <v-col class="min-card" cols="12" md="4">
                        <QuarterlyPrice />
                    </v-col>
                    <v-col class="min-card" cols="12" md="4">
                        <YearlyPrice />
                    </v-col>
                </v-row>
            </div>

            <div>
                <v-row>
                    <v-col cols="12" md="12">
                        <div v-if="loading">
                            <v-skeleton-loader type="article" />
                        </div>
                        <div v-else>
                            <PriceTrends
                                title="Price Trend & Chart"
                                :yAxisTitle="yAxisPriceTitle"
                                :xAxisCategories="{ daily: dailyPriceX, weekly: weeklyPriceX, monthly: monthlyPriceX }"
                                :chartSeries="{
                                    daily: chartSeriesDailyPrice,
                                    weekly: chartSeriesWeeklyPrice,
                                    monthly: chartSeriesMonthlyPrice
                                }"
                            />
                        </div>
                    </v-col>
                </v-row>
            </div>

            <!-- <div>
                <v-row>
                    <v-col cols="12" md="12">
                        <div v-if="loading">
                            <v-skeleton-loader type="article" />
                        </div>
                        <div v-else>
                            <PriceTrends
                                title="Volume Trend & Chart"
                                :yAxisTitle="yAxisVolumeTitle"
                                :xAxisCategories="{ daily: dailyVolumeX, weekly: weeklyVolumeX, monthly: monthlyVolumeX }"
                                :chartSeries="{
                                    daily: chartSeriesDailyVolume,
                                    weekly: chartSeriesWeeklyVolume,
                                    monthly: chartSeriesMonthlyVolume
                                }"
                            />
                        </div>
                    </v-col>
                </v-row>
            </div> -->

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
