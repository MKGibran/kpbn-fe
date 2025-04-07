<script setup lang="ts">
/*Call Components*/
import { ref } from 'vue';

const settings = ref({
    algorithm: 'LSTM',
    currency: 'USD',
    unit: 'Kg'
});
const algorithms = ['LSTM', 'ARIMA', 'SVR'];
const currencies = ['USD', 'IDR', 'MYR'];
const units = ['Kg', 'Ton', 'Gram'];
const snackbar = ref(false);
const snackbarText = ref('');
const SnackbarColor = ref('error');

function saveSettings() {
    snackbarText.value = 'No Action';
    snackbar.value = true;
    SnackbarColor.value = 'primary';
    console.log('Saved Settings:', settings.value);
    // Kirim ke backend kalau perlu
}
</script>

<template>
    <!-- Snackbar untuk menampilkan error -->
    <v-snackbar v-model="snackbar" :color="SnackbarColor" timeout="3000" location="top">
        {{ snackbarText }}
        <template v-slot:actions>
            <v-btn color="white" text @click="snackbar = false">Close</v-btn>
        </template>
    </v-snackbar>
    <div>
        <v-card elevation="10" class="pa-5 mb-5">
            <v-card-title class="text-h6 font-weight-bold">Settings</v-card-title>
            <v-container>
                <!-- Training Algorithm -->
                <v-row>
                    <v-col> Training Algorithm </v-col>
                    <v-col cols="4">
                        <v-select
                            v-model="settings.algorithm"
                            :items="algorithms"
                            label="Training Algorithm"
                            variant="outlined"
                            density="comfortable"
                        />
                    </v-col>
                </v-row>
                <!-- Currency -->
                <v-row>
                    <v-col> Currency </v-col>
                    <v-col cols="4">
                        <v-select
                            v-model="settings.currency"
                            :items="currencies"
                            label="Currency"
                            variant="outlined"
                            density="comfortable"
                        />
                    </v-col>
                </v-row>
                <!-- Unit -->
                <v-row>
                    <v-col> Unit </v-col>
                    <v-col cols="4">
                        <v-select v-model="settings.unit" :items="units" label="Unit" variant="outlined" density="comfortable" />
                    </v-col>
                </v-row>
                <!-- Button -->
                <v-row>
                    <v-col cols="12" class="d-flex justify-end mt-4">
                        <v-btn rounded="md" color="white" class="bg-primary px-7 mx-2" size="large" flat @click="saveSettings"
                            >Save Settings</v-btn
                        >
                        <v-btn rounded="md" color="white" class="bg-warning px-7 mx-2" size="large" flat @click="saveSettings">Retrain Model</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <v-col class="text-center text-center mt-2 mb-0">
            <p class="text-muted">KPBN</p>
        </v-col>
    </div>
</template>
