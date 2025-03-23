<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const checkbox = ref(true);
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const showError = ref(false); // Tambahkan ini untuk mengontrol Snackbar
const router = useRouter();

const login = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/user/login', 
            new URLSearchParams({ email: email.value, password: password.value }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        localStorage.setItem('access_token', response.data.data.access_token);
        router.push('/main/dashboard');
    } catch (error) {
        console.error("Error:", error);
        errorMessage.value = error.response?.data?.message || "Terjadi kesalahan.";
        showError.value = true;
    }

}
</script>

<template>
    <!-- Snackbar untuk menampilkan error -->
    <v-snackbar v-model="showError" color="error" timeout="3000" location="top">
        {{ errorMessage }}
        <template v-slot:actions>
            <v-btn color="white" text @click="showError = false">Tutup</v-btn>
        </template>
    </v-snackbar>
    <!-- Login Form -->
    <v-row class="d-flex mb-3">
        <v-col cols="12">
            <v-label class="font-weight-semibold mb-1">Email</v-label>
            <v-text-field v-model="email" variant="outlined" density="compact" hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-semibold mb-1">Password</v-label>
            <v-text-field v-model="password" variant="outlined" density="compact" type="password" hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12" class="pt-0">
            <div class="d-flex flex-wrap align-center">
                <div class="ml-sm-auto">
                    <RouterLink to="/" class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium"
                        >Forgot Password ?</RouterLink
                    >
                </div>
            </div>
        </v-col>
        <v-col cols="12" class="pt-0">
            <v-btn type="submit" @click="login" rounded="md" color="primary" size="large" block flat>Sign in</v-btn>
        </v-col>
    </v-row>
</template>
