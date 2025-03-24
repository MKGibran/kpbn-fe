<script setup lang="ts">
import { UserIcon, MailIcon } from 'vue-tabler-icons';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

const router = useRouter();
const showMessage = ref(false);

const logout = async () => {
    try {
        const token = localStorage.getItem('access_token');
        if (!token) return; // Kalau tidak ada token, langsung redirect

        await axios.delete('http://127.0.0.1:5000/user/logout', {
            headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        showMessage.value = true;

        // Tunggu 3 detik sebelum redirect
        setTimeout(() => {
            router.push('/auth/login');
        }, 2000);
    } catch (error) {
        console.error('Logout Error:', error);
    }
};
</script>

<template>
    <!-- Snackbar untuk menampilkan pesan -->
    <v-snackbar v-model="showMessage" color="success" timeout="3000" location="top">
        Logout Succeed
        <template v-slot:actions>
            <v-btn color="white" @click="showMessage = false">Tutup</v-btn>
        </template>
    </v-snackbar>

    <!-- Menu -->
    <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
            <v-btn class="profileBtn custom-hover-primary" variant="text" v-bind="props" icon>
                <v-avatar size="35">
                    <img src="@/assets/images/profile/user.png" height="35" alt="user" />
                </v-avatar>
            </v-btn>
        </template>
        <v-sheet rounded="md" width="200" elevation="10" class="mt-2">
            <v-list class="py-0" lines="one" density="compact">
                <v-list-item value="account" color="primary">
                    <template v-slot:prepend>
                        <MailIcon stroke-width="1.5" size="20" />
                    </template>
                    <v-list-item-title class="pl-4 text-body-1">My Account</v-list-item-title>
                </v-list-item>
            </v-list>
            <div class="pt-4 pb-4 px-5 text-center">
                <v-btn @click="logout" color="primary" variant="outlined" block>Logout</v-btn>
            </div>
        </v-sheet>
    </v-menu>
</template>
