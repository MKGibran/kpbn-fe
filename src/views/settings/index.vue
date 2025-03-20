<script setup lang="ts">
/*Call Components*/
import PriceTrends from '@/components/dashboard/PriceTrends.vue';
import MonthlyPrice from '@/components/dashboard/MonthlyPrice.vue';
import QuarterlyPrice from '@/components/dashboard/QuarterlyPrice.vue';
import YearlyPrice from '@/components/dashboard/YearlyPrice.vue';
</script>

<template>
    <div>
        <v-row class="center mb-5">
            <h3 class="font-weight-bold">Historical Price Trends and Forecast</h3>
            <span class="text-textSecondary text-sm ml-2">(USD/kg)</span>
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
            <v-col cols="12" md="12"><PriceTrends /></v-col>
            <v-col class="text-center text-center mt-2 mb-0">
                <p class="text-muted">KPBN</p>
            </v-col>
        </v-row>
    </div>
</template>
