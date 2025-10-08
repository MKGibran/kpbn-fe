<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import api from '@/plugins/axios';
import { VDataTable } from 'vuetify/components';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const props = defineProps<{
    title: String;
    tableData: any[];
    currencies: string;
    units: string;
}>();

const headers = [
    { title: 'Date', key: 'date' },
    { title: 'KPBN' + ' (' + props.currencies + '/' + props.units + ')', key: 'kpbn' },
    // { title: 'MDEX C1', key: 'mdex_c1' },
    // { title: 'MDEX C3', key: 'mdex_c3' },
    // { title: 'Rotterdam', key: 'rotterdam' },
    { title: 'Trend', key: 'status' }
];

const latestDate = computed(() => {
    if (!props.tableData?.length) return null;
    return props.tableData.reduce((latest, row) => {
        return new Date(row.date) > new Date(latest) ? row.date : latest;
    }, props.tableData[0].date);
});
</script>

<template>
    <v-card elevation="10" class="mt-5">
        <v-card-item>
            <div class="d-flex justify-space-between align-center mb-mb-0 mb-3">
                <div class="d-flex ga-3 align-center">
                    <v-card-title class="text-h3 font-weight-bold mb-3">{{ title }}</v-card-title>
                </div>
            </div>
            <v-row class="d-flex justify-space-between">
                <VDataTable :headers="headers" :items="props.tableData" hide-default-footer class="elevation-1">
                    <!-- Kolom status -->
                    <template #item.status="{ item }">
                        <v-tooltip :text="item.status" location="top">
                            <template #activator="{ props }">
                                <v-chip
                                    size="small"
                                    v-bind="props"
                                    :color="item.status === 'Turun' ? 'error' : item.status === 'Naik' ? 'success' : 'warning'"
                                >
                                    <v-icon>
                                        {{
                                            item.status === 'Turun'
                                                ? 'mdi-arrow-down-bold'
                                                : item.status === 'Naik'
                                                  ? 'mdi-arrow-up-bold'
                                                  : 'mdi-arrow-right-bold'
                                        }}
                                    </v-icon>
                                </v-chip>
                            </template>
                        </v-tooltip>
                    </template>

                    <!-- Kolom date -->
                    <template #item.date="{ item }">
                        <span :class="item.date === latestDate ? 'font-weight-bold' : ''">
                            {{ item.date }}
                        </span>
                    </template>

                    <!-- Kolom kpbn -->
                    <template #item.kpbn="{ item }">
                        <span :class="item.date === latestDate ? 'font-weight-bold' : ''">
                            {{ item.kpbn }}
                            <span v-if="item.date === latestDate" class="text-caption"> (Prediction)</span>
                        </span>
                    </template>
                </VDataTable>
            </v-row>
        </v-card-item>
    </v-card>
</template>
