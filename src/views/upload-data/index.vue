<script setup lang="ts">
import { ref } from 'vue';
import api from '@/plugins/axios';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();
const selectedFileDataset = ref<File | null>(null);
const selectedFileModel = ref<File | null>(null);
const snackbar = ref(false);
const snackbarText = ref('');
const SnackbarColor = ref('error');

// Menangani perubahan file
const onFileChangeDataset = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        selectedFileDataset.value = input.files[0];
    }
};
const onFileChangeModel = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        selectedFileModel.value = input.files[0];
    }
};

const uploadData = async () => {
    if (!selectedFileDataset.value) {
        snackbarText.value = 'Please select a file';
        snackbar.value = true;
        SnackbarColor.value = 'error';
        return;
    }

    const token = localStorage.getItem('access_token'); // Ambil token dari localStorage
    if (!token) {
        snackbarText.value = 'Missing authentication token!';
        snackbar.value = true;
        SnackbarColor.value = 'error';
        return;
    }

    const formData = new FormData();
    formData.append('dataset', selectedFileDataset.value);

    try {
        const response = await api.post('/dataset/uploads', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}` // Tambahkan token ke header
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

const uploadModel = async () => {
    if (!selectedFileModel.value) {
        snackbarText.value = 'Please select a file';
        snackbar.value = true;
        SnackbarColor.value = 'error';
        return;
    }

    const token = localStorage.getItem('access_token'); // Ambil token dari localStorage
    if (!token) {
        snackbarText.value = 'Missing authentication token!';
        snackbar.value = true;
        SnackbarColor.value = 'error';
        return;
    }

    const formData = new FormData();
    formData.append('model', selectedFileModel.value);

    try {
        const response = await api.post('/dataset/upload-model', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}` // Tambahkan token ke header
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
</script>

<template>
    <!-- Snackbar untuk menampilkan error -->
    <v-snackbar v-model="snackbar" :color="SnackbarColor" timeout="3000" location="top">
        {{ snackbarText }}
        <template v-slot:actions>
            <v-btn color="white" variant="text" @click="snackbar = false">Close</v-btn>
        </template>
    </v-snackbar>

    <!-- Upload Data -->
    <div>
        <v-card elevation="10" class="px-2 py-5 mb-5">
            <v-card-title class="text-h6 font-weight-bold">Upload Data</v-card-title>
            <v-card-text>
                <v-row align="center">
                    <!-- Input File -->
                    <v-col cols="12" class="d-flex flex-wrap gap-2">
                        <v-file-input
                            @change="onFileChangeDataset"
                            label="Upload Files"
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            hide-details
                        ></v-file-input>
                        <!-- Tombol Upload -->
                        <div cols="2" class="text-right mx-2">
                            <v-btn @click="uploadData" rounded="md" color="white" class="bg-primary px-sm-5 px-md-7" size="large" flat
                                ><v-icon start>mdi-upload</v-icon>Upload</v-btn
                            >
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <a href="/template-xlsx/Data-Input.xlsx" download>
                            <v-btn rounded="md" color="white" class="bg-warning px-sm-5 px-md-7" size="large" flat><v-icon start>mdi-download</v-icon>Template</v-btn>
                        </a>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>

    <!-- Upload Model -->
    <div>
        <v-card elevation="10" class="px-2 py-5 mb-5">
            <v-card-title class="text-h6 font-weight-bold">Upload Model</v-card-title>
            <v-card-text>
                <v-row align="center">
                    <v-col> Training Algorithm </v-col>
                    <v-col cols="6">
                        <v-select
                            :items="['LSTM']"
                            label="Training Algorithm"
                            variant="outlined"
                            density="comfortable"
                        />
                    </v-col>
                </v-row>
                <v-row align="center">
                    <!-- Input File -->
                    <v-col cols="6"> Model File </v-col>
                    <v-col cols="6" class="d-flex flex-wrap gap-2">
                        <v-file-input
                            @change="onFileChangeModel"
                            label="Upload Files"
                            prepend-inner-icon="mdi-magnify"
                            variant="outlined"
                            hide-details
                        ></v-file-input>
                        <!-- Tombol Upload -->
                        <div cols="2" class="text-right mx-2">
                            <v-btn @click="uploadModel" rounded="md" color="white" class="bg-primary px-sm-5 px-md-7" size="large" flat
                                ><v-icon start>mdi-upload</v-icon>Upload</v-btn
                            >
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>

    <!-- Footer -->
    <div>
        <v-col v-if="!mobile" class="text-center text-center mt-2 mb-0">
            <p class="text-muted">KPBN</p>
        </v-col>
    </div>
</template>

<style scoped>
.v-btn {
    text-transform: none;
}
</style>
