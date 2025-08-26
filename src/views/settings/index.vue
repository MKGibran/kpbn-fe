<script setup lang="ts">
/*Call Components*/
import { onMounted, ref } from 'vue';
import api from '@/plugins/axios';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const token = localStorage.getItem('access_token');
const currencyOptions = ['USD', 'IDR', 'MYR'];
const unitOptions = ['MT', 'KG', 'GR'];
const notificationCategoryOptions = [
    { text: 'Absolute', value: 1 },
    { text: 'Relative', value: 2 }
];

const algorithms = ref<string>('');
const currencies = ref<string>('');
const units = ref<string>('');
const notification_categories = ref<number[]>([]);
const notification_values = ref<number[]>([]);

const snackbar = ref(false);
const snackbarText = ref('');
const SnackbarColor = ref('error');

const loading = ref(true);

onMounted(async () => {
    try {
        const res = await api.get('/setting', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const rawData = res.data?.data || {};
        if (rawData.algorithm) algorithms.value = rawData.algorithm;
        if (rawData.currency) currencies.value = rawData.currency;
        if (rawData.unit) units.value = rawData.unit;
        if (rawData.notification_category) notification_categories.value.push(rawData.notification_category);
        if (rawData.notification_value) notification_values.value.push(rawData.notification_value);
    } catch (error: any) {
        console.error('❌ Error fetching table data:', error?.response?.data || error);
    } finally {
        loading.value = false;
    }
});

const saveSettings = async () => {
    try {
        if (!token) {
            snackbarText.value = 'Missing authentication token!';
            snackbar.value = true;
            SnackbarColor.value = 'error';
            return;
        }

        const formData = new FormData();
        formData.append('algorithm', algorithms.value);
        formData.append('currency', currencies.value);
        formData.append('unit', units.value);
        formData.append('notification_category', notification_categories.value.toString());
        formData.append('notification_value', notification_values.value.toString());

        await api.post('/setting/update', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

        snackbarText.value = 'Upload successful!';
        snackbar.value = true;
        SnackbarColor.value = 'primary';
    } catch (error) {
        snackbarText.value = 'Upload failed!';
        snackbar.value = true;
        SnackbarColor.value = 'error';
    }
};

const retrainModel = async () => {
    try {
        if (!token) {
            snackbarText.value = 'Missing authentication token!';
            snackbar.value = true;
            SnackbarColor.value = 'error';
            return;
        }

        await api.get('/dataset/train/lstm', {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

        snackbarText.value = 'Retraining model successful!';
        snackbar.value = true;
        SnackbarColor.value = 'primary';
    } catch (error) {
        snackbarText.value = 'Retraining model failed!';
        snackbar.value = true;
        SnackbarColor.value = 'error';
    }
}
</script>

<template>
    <!-- Snackbar untuk menampilkan error -->
    <v-snackbar v-model="snackbar" :color="SnackbarColor" timeout="3000" location="top">
        {{ snackbarText }}
        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="snackbar = false">Close</v-btn>
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
                            v-model="algorithms"
                            :items="['LSTM', 'GRU', 'RNN']"
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
                        <v-select v-model="currencies" :items="currencyOptions" label="Currency" variant="outlined" density="comfortable" />
                    </v-col>
                </v-row>
                <!-- Unit -->
                <v-row>
                    <v-col> Unit </v-col>
                    <v-col cols="4">
                        <v-select v-model="units" :items="unitOptions" label="Unit" variant="outlined" density="comfortable" />
                    </v-col>
                </v-row>
                <!-- Notification Category -->
                <v-row>
                    <v-col> Notification Category </v-col>
                    <v-col cols="4">
                        <v-select
                            v-model="notification_categories"
                            :items="notificationCategoryOptions"
                            item-title="text"
                            item-value="value"
                            label="Notification Category"
                            variant="outlined"
                            density="comfortable"
                        />
                    </v-col>
                </v-row>
                <!-- Notification Value -->
                <v-row>
                    <v-col> Notification Value </v-col>
                    <v-col cols="4">
                        <v-text-field
                            v-model.number="notification_values[0]"
                            type="number"
                            label="Notification Value"
                            variant="outlined"
                            density="comfortable"
                        />
                    </v-col>
                </v-row>
                <!-- Button -->
                <v-row class="flex-nowrap" gutters>
                    <v-col cols="12" class="d-flex justify-end flex-wrap gap-2 mt-md-4">
                        <v-btn
                            rounded="md"
                            color="white"
                            class="bg-primary px-sm-5 px-md-7 mx-1 my-1"
                            size="large"
                            flat
                            @click="saveSettings"
                        >
                            Save Settings
                        </v-btn>

                        <v-btn
                            rounded="md"
                            color="white"
                            class="bg-warning px-sm-5 px-md-7 mx-1 my-1"
                            size="large"
                            flat
                            @click="retrainModel"
                        >
                            Retrain Model
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </div>
    <!-- Footer -->
    <div>
        <v-col v-if="!mobile" class="text-center text-center mt-2 mb-0">
            <p class="text-muted">KPBN</p>
        </v-col>
    </div>
</template>
