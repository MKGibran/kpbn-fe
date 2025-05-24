<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref, computed } from 'vue';
import { tableActionData } from '@/data/Dashboard';
const props = defineProps<{
    latestPrice: number | null;
}>();
</script>
<template>
    <v-card elevation="10" class="bg-lighterror">
        <v-card-item>
            <div class="d-flex justify-space-between align-center mb-mb-0 mb-3">
                <div class="d-flex ga-3 align-center">
                    <div class="rounded-pill d-inline-flex px-4 py-2 mr-2 align-center py-0 bg-error">
                        <Icon icon="solar:calendar-mark-broken" width="25" height="25" class="text-white" />
                    </div>
                    <v-card-title class="text-h6 textSecondary font-weight-medium mb-0">Biweekly Price</v-card-title>
                </div>
            </div>
            <v-row class="d-flex justify-space-between">
                <v-col cols="7" xl="5" class="mb-1">
                    <h2 class="text-h2 mb-1 mt-2">IDR {{ latestPrice !== null ? latestPrice.toLocaleString('id-ID') : '' }}</h2>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>
