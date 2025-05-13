<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { VForm } from 'vuetify/components';

const form = ref<VForm | null>(null);
const name = ref('');
const email = ref('');
const password = ref('');
const level = ref('1'); // Level 1
const responseMessage = ref('');
const SnackbarColor = ref('error');
const showMessage = ref(false);

const register = async () => {
    // Validasi form sebelum mengirim data
    if (!form.value) return;
    const { valid } = await form.value.validate();
    if (!valid) return;

    try {
        const response = await axios.post(
            'http://103.41.204.232:81/user/register',
            new URLSearchParams({
                name: name.value,
                email: email.value,
                password: password.value,
                level: level.value
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        responseMessage.value = response.data.message || 'User Added Successfully';
        SnackbarColor.value = 'success';
        showMessage.value = true; // Pindahkan ke sini agar hanya muncul saat berhasil
    } catch (error: any) {
        responseMessage.value = error.response?.data?.message || 'An error occurred';
        SnackbarColor.value = 'error';
        showMessage.value = true; // Pindahkan ke sini agar hanya muncul saat error
    }
};
</script>

<template>
    <!-- Snackbar untuk menampilkan pesan -->
    <v-snackbar v-model="showMessage" :color="SnackbarColor" timeout="3000" location="top">
        {{ responseMessage }}
        <template v-slot:actions>
            <v-btn color="white" @click="showMessage = false">Close</v-btn>
        </template>
    </v-snackbar>

    <!-- Register Form -->
    <v-form ref="form" @submit.prevent="register">
        <v-row class="d-flex mb-3">
            <v-col cols="12">
                <v-label class="font-weight-semibold mb-1">Name</v-label>
                <v-text-field
                    v-model="name"
                    hide-details="auto"
                    variant="outlined"
                    density="compact"
                    color="primary"
                    :rules="[(v: any) => !!v || 'Name is required']"
                ></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-semibold mb-1">Email Address</v-label>
                <v-text-field
                    v-model="email"
                    variant="outlined"
                    density="compact"
                    type="email"
                    hide-details="auto"
                    color="primary"
                    :rules="[(v: any) => !!v || 'Email is required', (v: string) => /.+@.+\..+/.test(v) || 'Invalid email']"
                ></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-semibold mb-1">Password</v-label>
                <v-text-field
                    v-model="password"
                    variant="outlined"
                    type="password"
                    density="compact"
                    hide-details="auto"
                    color="primary"
                    :rules="[(v: string) => !!v || 'Password is required', (v: string) => v.length >= 6 || 'Min 6 characters']"
                ></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-btn type="submit" rounded="md" color="primary" size="large" block flat>Sign up</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
