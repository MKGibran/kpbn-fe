<script setup lang="ts">
/*Call Components*/
import DownloadReport from '@/components/detailed-report/DownloadReport.vue';
import TradingData from '@/components/detailed-report/TradingData.vue';
</script>

<template>
    <div>
        <v-row>
            <v-col cols="12" md="12" mt-2 mb-0>
                <DownloadReport />
            </v-col>
            <v-col cols="12" md="12" mt-2 mb-0>
                <TradingData />
            </v-col>
            <!-- <v-col cols="12" md="12"><PriceTrends /></v-col> -->
            <v-col class="text-center text-center mt-2 mb-0">
                <p class="text-muted">KPBN</p>
            </v-col>
        </v-row>
    </div>
</template>
