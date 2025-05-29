<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

const route = useRoute();
const { mobile } = useDisplay();

const notification = computed(() => {
    try {
        return JSON.parse(route.query.data as string);
    } catch {
        return null;
    }
});
</script>

<template>
    <div>
        <v-card elevation="10" class="px-2 py-5 mb-5">
            <v-card-title class="text-h6 font-weight-bold">Notification</v-card-title>
            <v-card-text>
                <div v-if="notification" class="mt-3">
                    <v-row align="center">
                        <!-- Input File -->
                        <v-col cols="12" class="d-flex flex-wrap gap-2">
                            {{ notification.text }}
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <p class="textSecondary text-caption">
                                {{ notification.date }}
                            </p>
                        </v-col>
                    </v-row>
                </div>
                <div v-else>Tidak ada data notifikasi.</div>
            </v-card-text>
        </v-card>
    </div>

    <!-- Footer -->
    <div>
        <v-col v-if="!mobile" class="text-center mt-2 mb-0">
            <p class="text-muted">KPBN</p>
        </v-col>
    </div>
</template>
