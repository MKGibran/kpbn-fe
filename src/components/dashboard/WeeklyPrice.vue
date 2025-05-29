<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref, computed } from 'vue';
import { tableActionData } from '@/data/Dashboard';
const props = defineProps<{
    latestPrice: number | null;
    currency: string;
}>();
</script>
<template>
    <v-card elevation="10" class="bg-lightprimary">
        <v-card-item>
            <div class="d-flex justify-space-between align-center mb-mb-0 mb-3">
                <div class="d-flex ga-3 align-center">
                    <div class="rounded-pill d-inline-flex px-4 py-2 mr-2 align-center py-0 bg-primary">
                        <Icon icon="solar:calendar-mark-broken" width="25" height="25" class="text-white" />
                    </div>
                    <v-card-title class="text-h6 textSecondary font-weight-medium mb-0">Weekly Price</v-card-title>
                </div>
            </div>
            <v-row class="d-flex justify-space-between align-end">
                <v-col cols="6" xl="6">
                    <h2 class="text-h5 textSecondary mb-0">{{ currency }}</h2>
                </v-col>
                <v-col cols="6" xl="6">
                    <h2 class="text-h2 mb-0">{{ latestPrice !== null ? latestPrice.toLocaleString('id-ID') : '' }}</h2>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>
