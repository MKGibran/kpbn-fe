<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const selectedFile = ref<File | null>(null);
const snackbar = ref(false);
const snackbarText = ref('');
const SnackbarColor = ref('error');

// Menangani perubahan file
const onFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        selectedFile.value = input.files[0];
    }
};

const uploadData = async () => {
    console.log('Selected File:', selectedFile.value);
    if (!selectedFile.value) {
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
    formData.append('dataset', selectedFile.value);

    try {
        const response = await axios.post('http://103.41.204.232:81/dataset/uploads', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}` // Tambahkan token ke header
            }
        });
        console.log('File Uploaded:', response.data);

        snackbarText.value = 'Upload successful!';
        snackbar.value = true;
        SnackbarColor.value = 'primary';
    } catch (error) {
        console.error('Upload Failed:', error);

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
            <v-btn color="white" text @click="snackbar = false">Close</v-btn>
        </template>
    </v-snackbar>
    <!-- KPBN -->
    <v-card elevation="10" class="pa-5 mb-5">
        <v-card-title class="text-h6 font-weight-bold">Upload Data</v-card-title>
        <v-card-text>
            <v-row align="center">
                <!-- Input File -->
                <v-col cols="10">
                    <v-file-input
                        @change="onFileChange"
                        label="Upload Files"
                        prepend-inner-icon="mdi-magnify"
                        variant="outlined"
                        hide-details
                    ></v-file-input>
                </v-col>

                <!-- Tombol Upload -->
                <v-col cols="2" class="text-right">
                    <v-btn @click="uploadData" rounded="md" color="white" class="bg-primary px-7" size="large" flat>Upload</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <a href="/template-xlsx/Data-Input.xlsx" download>
                        <v-btn rounded="md" color="white" class="bg-warning px-7" size="large" flat>Download Template</v-btn>
                    </a>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
    <!-- MDEX -->
    <!-- <v-card elevation="10" class="pa-5 mb-5">
            <v-card-title class="text-h6 font-weight-bold">MDEX</v-card-title>
            <v-card-text>
                <v-file-input
                label="Upload Files"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                class="mb-5"
                ></v-file-input>
                <v-btn rounded="md" color="white" class="bg-primary px-7" size="large" flat>Download Template</v-btn>
            </v-card-text>
        </v-card> -->
    <!-- SOYOIL -->
    <!-- <v-card elevation="10" class="pa-5 mb-5">
            <v-card-title class="text-h6 font-weight-bold">SOYOIL</v-card-title>
            <v-card-text>
                <v-file-input
                label="Upload Files"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                class="mb-5"
                ></v-file-input>
                <v-btn rounded="md" color="white" class="bg-primary px-7" size="large" flat>Download Template</v-btn>
            </v-card-text>
        </v-card> -->
        <v-col class="text-center text-center mt-2 mb-0">
            <p class="text-muted">KPBN</p>
        </v-col>
</template>

<style scoped>
.v-btn {
    text-transform: none;
}
</style>
