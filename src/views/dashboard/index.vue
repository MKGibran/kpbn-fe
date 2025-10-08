<script setup lang="ts">
/*Call Components*/
import { ref } from 'vue';
import { onMounted } from 'vue';
import api from '@/plugins/axios';
import PriceTrends from '@/components/dashboard/PriceTrends.vue';
import TableData from '@/components/dashboard/TableData.vue';
import DailyPrice from '@/components/dashboard/DailyPrice.vue';
import WeeklyPrice from '@/components/dashboard/WeeklyPrice.vue';
import BiweeklyPrice from '@/components/dashboard/BiweeklyPrice.vue';
import { da, fi } from 'date-fns/locale';
import dayjs from 'dayjs';
import { useDisplay } from 'vuetify';
import { VSkeletonLoader } from 'vuetify/components';

// import func from 'vue-temp/vue-editor-bridge';

const { mobile } = useDisplay();
const loading = ref(true);
const token = localStorage.getItem('access_token');
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

const dailyTableData = ref<any[]>([]);
const weeklyTableData = ref<any[]>([]);
const biweeklyTableData = ref<any[]>([]);
const loadingTable = ref(true);

const chartSeriesDailyPrice = ref<{ name: string; data: number[] }[]>([]);
const chartSeriesWeeklyPrice = ref<{ name: string; data: number[] }[]>([]);
const chartSeriesBiweeklyPrice = ref<{ name: string; data: number[] }[]>([]);

const exchangeRates = ref<{ IDR: number; MYR: number }>({ IDR: 1, MYR: 1 });
const settingsData = ref<{ unit: string; currency: string }>({
    unit: 'KG',
    currency: 'IDR'
});

// Settings
const algorithms = ref<string>('');
const currencies = ref<string>('');
const units = ref<string>('');
const notification_categories = ref<number[]>([]);
const notification_values = ref<number[]>([]);

const parse = (d: string) => dayjs(d); // format "YYYY-MM-DD"

onMounted(async () => {
    exchangeRates.value = await fetchExchangeRates();
    // await getForecast();
    // await getDataset();
    await getSettings();
    await getTableData();
});

// Fetching
// Ambil data forecast
async function getForecast() {
    try {
        const res = await api.get('/dataset/forecast/lstm', {
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
        const res = await api.get('/dataset', {
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
            dailySeries.forecast.push(convertPrice(Number(parseFloat(entry.kpbn).toFixed(2))));
            dailySeries.kpbn.push(convertPrice(Number(parseFloat(entry.kpbn).toFixed(2))));
            dailySeries.mdexC1.push(convertPrice(Number(entry.mdex_c1)));
            dailySeries.mdexC3.push(convertPrice(Number(entry.mdex_c3)));
            dailySeries.rotterdam.push(convertPrice(Number(entry.rotterdam)));
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

        // Last entry date untuk acuan 3 bulan terakhir
        const lastEntryDate = new Date(rawData[rawData.length - 1].date);
        const threeMonthsAgo = new Date(lastEntryDate);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        //
        // WEEKLY
        //
        const groupedWeekly: Record<string, any[]> = {};
        const filteredWeekly = rawData.filter((entry: any) => {
            const date = new Date(entry.date);
            return date >= threeMonthsAgo && date <= lastEntryDate;
        });

        filteredWeekly.forEach((entry: any) => {
            const date = new Date(entry.date);
            const weekNumber = Math.ceil(date.getDate() / 7);
            const monthName = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            const key = `Week ${weekNumber} - ${monthName} ${year}`;
            if (!groupedWeekly[key]) groupedWeekly[key] = [];
            groupedWeekly[key].push(entry);
        });

        let forecastWeekly = groupForecastData(lastWeeklyDate.value, 'Weekly');

        const weeklyCategories = Object.keys(groupedWeekly).sort((a, b) => {
            const parseLabel = (label: string) => {
                const match = label.match(/Week (\d+) - (\w{3}) (\d{4})/);
                if (!match) return new Date();
                const [, , month, year] = match;
                return new Date(`${month} 1, ${year}`);
            };
            return parseLabel(a).getTime() - parseLabel(b).getTime();
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
            weeklySeries.forecast.push(convertPrice(Number(parseFloat(group[group.length - 1].kpbn).toFixed(2))));
            weeklySeries.kpbn.push(convertPrice(Number(parseFloat(group[group.length - 1].kpbn).toFixed(2))));
            weeklySeries.mdexC1.push(convertPrice(Number(parseFloat(group[group.length - 1].mdex_c1).toFixed(2))));
            weeklySeries.mdexC3.push(convertPrice(Number(parseFloat(group[group.length - 1].mdex_c3).toFixed(2))));
            weeklySeries.rotterdam.push(convertPrice(Number(parseFloat(group[group.length - 1].rotterdam).toFixed(2))));
        });

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

        //
        // BIWEEKLY
        //
        const groupedBiweekly: Record<string, any[]> = {};
        const filteredBiweekly = rawData.filter((entry: any) => {
            const date = new Date(entry.date);
            return date >= threeMonthsAgo && date <= lastEntryDate;
        });

        filteredBiweekly.forEach((entry: any) => {
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

        let forecastBiweekly = groupForecastData(lastBiweeklyDate.value, 'Weekly');

        biweeklyCategories.forEach((key) => {
            const group = groupedBiweekly[key];
            biweeklySeries.forecast.push(convertPrice(Number(parseFloat(group[group.length - 1].kpbn).toFixed(2))));
            biweeklySeries.kpbn.push(convertPrice(Number(parseFloat(group[group.length - 1].kpbn).toFixed(2))));
            biweeklySeries.mdexC1.push(convertPrice(Number(parseFloat(group[group.length - 1].mdex_c1).toFixed(2))));
            biweeklySeries.mdexC3.push(convertPrice(Number(parseFloat(group[group.length - 1].mdex_c3).toFixed(2))));
            biweeklySeries.rotterdam.push(convertPrice(Number(parseFloat(group[group.length - 1].rotterdam).toFixed(2))));
        });

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

async function getSettings() {
    try {
        const res = await api.get('/setting', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const rawData = res.data?.data || {};
        if (rawData.algorithm) algorithms.value = rawData.algorithm;
        if (rawData.currency) currencies.value = rawData.currency;
        if (rawData.unit) units.value = rawData.unit;
        if (rawData.notification_category) notification_categories.value.push(rawData.notification_category);
        if (rawData.notification_value) notification_values.value.push(rawData.notification_value);
    } catch (error: any) {
        console.error('❌ Error fetching table data:', error?.response?.data || error);
    } finally {
        loading.value = false;
    }
}

async function getTableData() {
    try {
        loadingTable.value = true;
        const res = await api.get('/dashboard/table', {
            headers: { Authorization: `Bearer ${token}` }
        });

        let body = res.data;
        if (typeof body === 'string') {
            body = JSON.parse(
                body
                    .replace(/\bNaN\b/g, 'null')
                    .replace(/\bInfinity\b/g, 'null')
                    .replace(/\b-Infinity\b/g, 'null')
            );
        }

        const dailyRaw = body?.data?.daily || [];
        const weeklyRaw = body?.data?.weekly || [];
        const biweeklyRaw = body?.data?.biweekly || [];

        const dailyFiltered = byLatestRange(dailyRaw, 6, 6); // fallback 6 titik (≈ 2 minggu)
        const weeklyFiltered = byLatestRange(weeklyRaw, 30, 8); // fallback 8 minggu ~ 2 bulan
        const biweeklyFiltered = byLatestRange(biweeklyRaw, 60, 6); // fallback 6 titik (≈ 3 bulan)

        dailyTableData.value = dailyFiltered.map((row) => ({
            ...row,
            date: formatDate(row.date),
            kpbn: formatPrice(row.kpbn),
            mdex_c1: formatPrice(row.mdex_c1),
            mdex_c3: formatPrice(row.mdex_c3),
            rotterdam: formatPrice(row.rotterdam),
            soyoil: formatPrice(row.soyoil),
            soyoil_dalian_c1: formatPrice(row.soyoil_dalian_c1),
            soyoil_dalian_c3: formatPrice(row.soyoil_dalian_c3)
        }));

        weeklyTableData.value = weeklyFiltered.map((row) => ({
            ...row,
            date: formatDate(row.date),
            kpbn: formatPrice(row.kpbn),
            mdex_c1: formatPrice(row.mdex_c1),
            mdex_c3: formatPrice(row.mdex_c3),
            rotterdam: formatPrice(row.rotterdam),
            soyoil: formatPrice(row.soyoil),
            soyoil_dalian_c1: formatPrice(row.soyoil_dalian_c1),
            soyoil_dalian_c3: formatPrice(row.soyoil_dalian_c3)
        }));

        biweeklyTableData.value = biweeklyFiltered.map((row) => ({
            ...row,
            date: formatDate(row.date),
            kpbn: formatPrice(row.kpbn),
            mdex_c1: formatPrice(row.mdex_c1),
            mdex_c3: formatPrice(row.mdex_c3),
            rotterdam: formatPrice(row.rotterdam),
            soyoil: formatPrice(row.soyoil),
            soyoil_dalian_c1: formatPrice(row.soyoil_dalian_c1),
            soyoil_dalian_c3: formatPrice(row.soyoil_dalian_c3)
        }));
    } catch (error: any) {
        console.error('❌ Error fetching table data:', error?.response?.data || error);
    } finally {
        loadingTable.value = false;
    }
}

// UI Interactions
// Function to fetch exchange rates
async function fetchExchangeRates(): Promise<{ IDR: number; MYR: number }> {
    try {
        const response = await fetch(
            'https://api.exchangerate.host/latest?access_key=d83921db3627ca32086823d96d3f664b&base=EUR&symbols=USD,IDR,MYR'
        );
        const data = await response.json();

        if (
            !data ||
            !data.rates ||
            typeof data.rates.USD !== 'number' ||
            typeof data.rates.IDR !== 'number' ||
            typeof data.rates.MYR !== 'number'
        ) {
            throw new Error('Invalid exchange rate response structure');
        }

        // Hitung manual USD → IDR dan USD → MYR
        const usdToIdr = data.rates.IDR / data.rates.USD;
        const usdToMyr = data.rates.MYR / data.rates.USD;

        return {
            IDR: usdToIdr,
            MYR: usdToMyr
        };
    } catch (error) {
        console.error('Gagal mengambil kurs:', error);
        return { IDR: 1, MYR: 1 }; // fallback nilai default
    }
}

// Function to convert price
function convertPrice(currentPrice: number): number {
    let unitPrice = currentPrice;

    // Konversi berdasarkan unit
    if (settingsData.value.unit === 'KG') {
        unitPrice = currentPrice / 1000;
    } else if (settingsData.value.unit === 'GR') {
        unitPrice = currentPrice / 1000000;
    }

    // Konversi berdasarkan currency
    if (settingsData.value.currency === 'IDR') {
        unitPrice *= exchangeRates.value.IDR;
    } else if (settingsData.value.currency === 'MYR') {
        unitPrice *= exchangeRates.value.MYR;
    }

    return Number(unitPrice.toFixed(2));
}

function getLastData(rawData: any[]) {
    // Mengambil data KPBN terakhir untuk kategori Daily
    const lastEntry = rawData[rawData.length - 1];
    const lastDailyKpbn = convertPrice(Number(parseFloat(lastEntry.kpbn).toFixed(2)));
    const lastDailyDate = lastEntry.date;

    // Mengambil data KPBN terakhir untuk kategori Weekly
    const lastWeekNumber = getWeekNumber(new Date(lastEntry.date));
    const filteredWeekly = rawData.filter((entry) => {
        const date = new Date(entry.date);
        return getWeekNumber(date) === lastWeekNumber && date.getFullYear() === new Date(lastEntry.date).getFullYear();
    });
    const lastWeeklyKpbn = filteredWeekly.length
        ? convertPrice(Number(parseFloat(filteredWeekly[filteredWeekly.length - 1].kpbn).toFixed(2)))
        : null;
    const lastWeeklyDate = filteredWeekly.length ? filteredWeekly[filteredWeekly.length - 1].date : null;

    // Mengambil data KPBN terakhir untuk kategori Biweekly
    const lastBiweeklyNumber = Math.ceil(lastWeekNumber / 2);
    const filteredBiweekly = rawData.filter((entry) => {
        const date = new Date(entry.date);
        return Math.ceil(getWeekNumber(date) / 2) === lastBiweeklyNumber && date.getFullYear() === new Date(lastEntry.date).getFullYear();
    });
    const lastBiweeklyKpbn = filteredBiweekly.length
        ? convertPrice(Number(parseFloat(filteredBiweekly[filteredBiweekly.length - 1].kpbn).toFixed(2)))
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

type TableRow = {
    date: string;
    kpbn: number;
    mdex_c1: number;
    mdex_c3: number;
    rotterdam: number;
    soyoil: number;
    soyoil_dalian_c1: number;
    soyoil_dalian_c3: number;
};

function byLatestRange<T extends TableRow>(rows: T[], days: number, fallbackCount: number): T[] {
    if (!rows?.length) return [];
    // cari tanggal latest di seri ini
    const latest = rows.reduce((acc, r) => {
        const t = parse(r.date);
        return t.isAfter(acc) ? t : acc;
    }, parse(rows[0].date));
    const cutoff = latest.subtract(days, 'day');

    // inklusif: >= cutoff
    let filtered = rows.filter((r) => !parse(r.date).isBefore(cutoff));

    // fallback kalau kosong: ambil N item terakhir
    if (!filtered.length) {
        filtered = rows.slice(-fallbackCount);
    }

    // urutkan ascending by date
    filtered.sort((a, b) => (parse(a.date).isBefore(parse(b.date)) ? 1 : -1));
    return filtered;
}

// Format angka
function formatNumber(num: number) {
    if (num == null || isNaN(num)) return '-';
    return num.toFixed(1); // 1 decimal
}

function formatPrice(value: number | string) {
    if (value === null || value === undefined || value === '') return '-';
    return new Intl.NumberFormat('id-ID', {
        style: 'decimal',
        minimumFractionDigits: 1, // selalu ada 1 desimal
        maximumFractionDigits: 2 // kalau ada lebih, potong max 2
    }).format(Number(value));
}

function formatDateKey(date: any) {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        console.error('Invalid date in formatDateKey:', date);
        return null;
    }
    return d.toISOString().split('T')[0];
}

// Format tanggal table
function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long', // tampilkan nama hari
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
function getWeekNumber(date: Date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

// Biweekly
function isInLast3Months(date: Date): boolean {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    return date >= threeMonthsAgo && date <= now;
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
        </div>
        <div>
            <!-- Report Card -->
            <!-- <div v-if="!mobile">
                <v-row>
                    <v-col class="min-card" cols="12" md="4">
                        <DailyPrice :currency="settingsData.currency" :latest-price="lastDailyKpbn" />
                    </v-col>
                    <v-col class="min-card" cols="12" md="4">
                        <WeeklyPrice :currency="settingsData.currency" :latest-price="lastWeeklyKpbn" />
                    </v-col>
                    <v-col class="min-card" cols="12" md="4">
                        <BiweeklyPrice :currency="settingsData.currency" :latest-price="lastBiweeklyKpbn" />
                    </v-col>
                </v-row>
            </div>

            <div v-else class="scroll-wrapper">
                <v-row class="flex-nowrap" gutters>
                    <v-col class="min-card" cols="12" md="4">
                        <DailyPrice :currency="settingsData.currency" :latest-price="lastDailyKpbn" />
                    </v-col>
                    <v-col class="min-card" cols="12" md="4">
                        <WeeklyPrice :currency="settingsData.currency" :latest-price="lastWeeklyKpbn" />
                    </v-col>
                    <v-col class="min-card" cols="12" md="4">
                        <BiweeklyPrice :currency="settingsData.currency" :latest-price="lastBiweeklyKpbn" />
                    </v-col>
                </v-row>
            </div> -->

            <!-- Table Data -->
            <div v-if="loadingTable">
                <VSkeletonLoader class="mt-5" type="article" />
            </div>
            <div v-else>
                <TableData title="Daily Price Trends " :tableData="dailyTableData" :currencies="currencies" :units="units" />
                <TableData title="Weekly Price Trends" :tableData="weeklyTableData" :currencies="currencies" :units="units" />
                <TableData title="Biweekly Price Trends" :tableData="biweeklyTableData" :currencies="currencies" :units="units" />
            </div>

            <!-- Price Trends and Chart -->
            <!-- <div>
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
