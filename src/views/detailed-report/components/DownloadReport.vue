<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref, computed } from 'vue';
import { tableActionData } from '@/data/Dashboard';
</script>
<template>
    <v-card elevation="10" class="bg-warning">
        <v-card-item>
            <div class="d-flex justify-space-between align-center mb-mb-0 mb-3">
                <div class="d-flex ga-3 align-center">
                    <v-card-title class="text-h3 font-weight-bold mb-0">Download Report</v-card-title>
                </div>
            </div>
            <v-row class="d-flex justify-space-between">
                <v-col cols="7" xl="5" class="mb-1">
                    <ul class="list-style">
                        <li>Daily Trading Report</li>
                        <li>Historical Data Trading Report</li>
                        <li>Bi Weekly Market Analysis</li>
                    </ul>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>

<style scoped>
.list-style {
    list-style-type: disc; /* Menampilkan bullet (•) */
    padding-left: 20px; /* Memberikan padding kiri */
}

li {
    margin-bottom: 8px; /* Memberikan jarak antar item */
}
</style>
