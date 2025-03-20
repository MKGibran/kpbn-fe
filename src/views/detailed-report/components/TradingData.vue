<script setup lang="ts">
import { ref } from 'vue';

const headers = ref([
    { text: 'Trading Data', align: 'start', sortable: false, value: 'Trading Date' },
    { text: 'Price (USD/Kg)', value: 'Price' },
    { text: 'Change (%)', value: 'Change' }
]);

const data = ref([
    { TradingDate: 'Frozen Yogurt', Price: 159, Change: 6.0 },
    { TradingDate: 'Ice cream sandwich', Price: 237, Change: 9.0 },
    { TradingDate: 'Eclair', Price: 262, Change: 16.0 },
    { TradingDate: 'Cupcake', Price: 305, Change: 3.7 }
]);
</script>

<template>
    <v-card elevation="10" class="">
        <v-card-item>
            <div class="d-flex justify-space-between align-center mb-mb-0 mb-3">
                <div class="d-flex ga-3 align-center">
                    <v-card-title class="text-h3 font-weight-bold mb-0">Trading Data</v-card-title>
                </div>
            </div>
            <v-row class="d-flex justify-space-between">
                <v-data-table :header="headers" :items="data" :items-per-page="5" class="elevation-1"></v-data-table>
            </v-row>
        </v-card-item>
    </v-card>
</template>
