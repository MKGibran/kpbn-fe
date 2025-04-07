<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const form = ref(null);
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const showError = ref(false);
const router = useRouter();

const login = async () => {
    if (!form.value) return;

    const { valid } = await form.value.validate(); // Validasi form
    if (!valid) return; // Stop jika tidak valid

    try {
        const response = await axios.post(
            'http://103.41.204.232:81/user/login',
            new URLSearchParams({ email: email.value, password: password.value }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        localStorage.setItem('access_token', response.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        router.push('/dashboard');
    } catch (error) {
        console.error('Error:', error);
        errorMessage.value = error.response?.data?.message || 'Invalid email or password.';
        showError.value = true;
    }
};
</script>

<template>
    <!-- Snackbar untuk menampilkan error -->
    <v-snackbar v-model="showError" color="error" timeout="3000" location="top">
        {{ errorMessage }}
        <template v-slot:actions>
            <v-btn color="white" text @click="showError = false">Close</v-btn>
        </template>
    </v-snackbar>

    <!-- Login Form -->
    <v-form ref="form">
        <v-row class="d-flex mb-3">
            <v-col cols="12">
                <v-label class="font-weight-semibold mb-1">Email</v-label>
                <v-text-field
                    v-model="email"
                    variant="outlined"
                    density="compact"
                    hide-details="auto"
                    color="primary"
                    type="email"
                    :rules="[
                        (v) => !!v || 'Email is required',
                        (v) => /.+@.+\..+/.test(v) || 'Invalid email format'
                    ]"
                ></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-semibold mb-1">Password</v-label>
                <v-text-field
                    v-model="password"
                    variant="outlined"
                    density="compact"
                    type="password"
                    hide-details="auto"
                    color="primary"
                    :rules="[(v) => !!v || 'Password is required']"
                ></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0">
                <div class="d-flex flex-wrap align-center">
                    <div class="ml-sm-auto">
                        <RouterLink to="/" class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium"
                            >Forgot Password?</RouterLink
                        >
                    </div>
                </div>
            </v-col>
            <v-col cols="12" class="pt-0">
                <v-btn type="submit" @click.prevent="login" rounded="md" color="primary" size="large" block flat>Sign in</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
