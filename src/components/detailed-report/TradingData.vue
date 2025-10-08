<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '@/plugins/axios';
import { VDataTable } from 'vuetify/components';

// State untuk data tabel
const dailyTableData = ref<any[]>([]);
// State untuk status loading
const loading = ref(true);
// State untuk search input
const search = ref('');

// Headers tabel
const headers = [
    { title: 'Tanggal', key: 'date' },
    { title: 'KPBN', key: 'kpbn' },
    { title: 'MDEX C1', key: 'mdex_c1' },
    { title: 'MDEX C3', key: 'mdex_c3' },
    { title: 'SOYOIL', key: 'soyoil' },
    { title: 'Rotterdam', key: 'rotterdam' }
];

// Format tanggal
const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Ambil data saat mounted
onMounted(async () => {
    try {
        const token = localStorage.getItem('access_token');
        const res = await api.get('/dataset', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const rawData = res.data?.data || [];

        if (!Array.isArray(rawData)) {
            dailyTableData.value = [];
            return;
        }

        const last30 = rawData
            .slice(-30)
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        dailyTableData.value = last30.map((entry: any) => ({
            date: formatDate(entry.date),
            kpbn: parseFloat(entry.kpbn).toFixed(2),
            mdex_c1: parseFloat(entry.mdex_c1).toFixed(2),
            mdex_c3: parseFloat(entry.mdex_c3).toFixed(2),
            soyoil: parseFloat(entry.soyoil).toFixed(2),
            rotterdam: parseFloat(entry.rotterdam).toFixed(2)
        }));

    } catch (error: any) {
        console.error('❌ Error fetching table data:', error?.response?.data || error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <v-card elevation="10">
        <v-card-item>
            <div class="d-flex justify-space-between align-center mb-mb-0 mb-3">
                <div class="d-flex gap-3 align-center">
                    <v-card-title class="text-h3 font-weight-bold mb-3">Trading Data</v-card-title>
                </div>
            </div>

            <!-- Input untuk search -->
            <v-text-field
                v-model="search"
                label="Search"
                prepend-icon="mdi-magnify"
                class="mb-3"
                dense
            />

            <v-row class="d-flex justify-space-between">
                <VDataTable
                    :headers="headers"
                    :items="dailyTableData"
                    :items-per-page="5"
                    class="elevation-1"
                    :loading="loading"
                    :search="search"
                ></VDataTable>
            </v-row>
        </v-card-item>
    </v-card>
</template>
