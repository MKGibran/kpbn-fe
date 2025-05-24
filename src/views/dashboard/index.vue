<script setup lang="ts">
/*Call Components*/
import { ref } from 'vue';
import { onMounted } from 'vue';
import api from '@/plugins/axios';
import PriceTrends from '../dashboard/components/PriceTrends.vue';
import DailyPrice from '@/views/dashboard/components/DailyPrice.vue';
import WeeklyPrice from '@/views/dashboard/components/WeeklyPrice.vue';
import BiweeklyPrice from '@/views/dashboard/components/BiweeklyPrice.vue';
import { fi } from 'date-fns/locale';
import { useDisplay } from 'vuetify';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader';

const { mobile } = useDisplay();
// Data untuk chart Harga terhadap waktu
const yAxisPriceTitle = 'Price';

const dailyPriceX = ref<string[]>([]);
const weeklyPriceX = ref<string[]>([]);
const biweeklyPriceX = ref<string[]>([]);
const lastDailyKpbn = ref<number | null>(null);
const lastWeeklyKpbn = ref<number | null>(null);
const lastBiweeklyKpbn = ref<number | null>(null);
const chartSeriesDailyPrice = ref<{ name: string; data: number[] }[]>([]);
const chartSeriesWeeklyPrice = ref<{ name: string; data: number[] }[]>([]);
const chartSeriesBiweeklyPrice = ref<{ name: string; data: number[] }[]>([]);

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

        const lastData = getLastData(rawData);
        lastDailyKpbn.value = lastData.lastDailyKpbn;
        lastWeeklyKpbn.value = lastData.lastWeeklyKpbn;
        lastBiweeklyKpbn.value = lastData.lastBiweeklyKpbn;

        console.log('Gibran', lastDailyKpbn.value);

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
            const weekNumA = parseInt(a.match(/Week (\d+)/)?.[1] || '0');
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
            weeklySeries.kpbn.push(Number(parseFloat(group[group.length - 1].kpbn).toFixed(2)));
            weeklySeries.mdexC1.push(Number(parseFloat(group[group.length - 1].mdex_c1).toFixed(2)));
            weeklySeries.mdexC3.push(Number(parseFloat(group[group.length - 1].mdex_c3).toFixed(2)));
            weeklySeries.rotterdam.push(Number(parseFloat(group[group.length - 1].rotterdam).toFixed(2)));
        });

        weeklyPriceX.value = weeklyCategories;
        chartSeriesWeeklyPrice.value = [
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
            kpbn: [] as number[],
            mdexC1: [] as number[],
            mdexC3: [] as number[],
            rotterdam: [] as number[]
        };

        biweeklyCategories.forEach((key) => {
            const group = groupedBiweekly[key];
            biweeklySeries.kpbn.push(Number(parseFloat(group[group.length - 1].kpbn).toFixed(2)));
            biweeklySeries.mdexC1.push(Number(parseFloat(group[group.length - 1].mdex_c1).toFixed(2)));
            biweeklySeries.mdexC3.push(Number(parseFloat(group[group.length - 1].mdex_c3).toFixed(2)));
            biweeklySeries.rotterdam.push(Number(parseFloat(group[group.length - 1].rotterdam).toFixed(2)));
        });

        biweeklyPriceX.value = biweeklyCategories;
        chartSeriesBiweeklyPrice.value = [
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
});

function getLastData(rawData: any[]) {
    // Mengambil data KPBN terakhir untuk kategori Daily
    const lastDailyKpbn = Number(parseFloat(rawData[rawData.length - 1].kpbn).toFixed(2));

    // Mengambil data KPBN terakhir untuk kategori Weekly
    const filteredWeekly = rawData.filter((entry) => {
        const date = new Date(entry.date);
        return (
            date.getMonth() === new Date(rawData[rawData.length - 1].date).getMonth() &&
            date.getFullYear() === new Date(rawData[rawData.length - 1].date).getFullYear()
        );
    });

    const lastWeeklyKpbn = filteredWeekly.length ? Number(parseFloat(filteredWeekly[filteredWeekly.length - 1].kpbn).toFixed(2)) : null;

    // Mengambil data KPBN terakhir untuk kategori Biweekly
    const filteredBiweekly = rawData.filter((entry) => {
        const date = new Date(entry.date);
        return (
            date.getMonth() === new Date(rawData[rawData.length - 1].date).getMonth() &&
            date.getFullYear() === new Date(rawData[rawData.length - 1].date).getFullYear()
        );
    });

    const lastBiweeklyKpbn = filteredBiweekly.length
        ? Number(parseFloat(filteredBiweekly[filteredBiweekly.length - 1].kpbn).toFixed(2))
        : null;

    return {
        lastDailyKpbn,
        lastWeeklyKpbn,
        lastBiweeklyKpbn
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

function getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7);
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
