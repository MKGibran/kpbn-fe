<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import api from '@/plugins/axios';

const router = useRouter();
const showMessage = ref(false);
const token = localStorage.getItem('access_token');

const props = withDefaults(
    defineProps<{
        notifications: any[];
    }>(),
    {
        notifications: () => []
    }
);

// Fungsi kirim data notifikasi ke route
function goToNotification(notification: any) {
    if (notification.is_read === 0) {
        api.get('/read-notification', {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });
    }
    notification.date = formatDate(notification.date);
    router.push({
        path: '/notifications',
        query: {
            data: JSON.stringify(notification)
        }
    });
}

const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: enUS });
};
</script>

<template>
    <!-- Snackbar -->
    <v-snackbar v-model="showMessage" color="primary" timeout="3000" location="top">
        Logout Succeed
        <template #actions>
            <v-btn color="white" @click="showMessage = false">Tutup</v-btn>
        </template>
    </v-snackbar>

    <!-- Menu -->
    <v-menu :close-on-content-click="false">
        <template #activator="{ props: menuProps }">
            <v-btn icon class="custom-hover-primary" size="small" variant="text" v-bind="menuProps" color="primary">
                <v-badge dot color="primary" offset-x="-5" offset-y="-3">
                    <Icon icon="solar:bell-bing-line-duotone" height="22" />
                </v-badge>
            </v-btn>
        </template>

        <v-sheet rounded="md" width="300" elevation="10" class="mt-2">
            <v-list class="py-0" lines="two" density="compact">
                <v-list-item
                    v-for="(notification, index) in props.notifications"
                    :key="index"
                    @click="goToNotification(notification)"
                    style="cursor: pointer"
                    class="hover:bg-grey-lighten-4"
                >
                    <template #prepend>
                        <Icon :icon="notification.is_read === 0 ? 'mynaui:envelope' : 'mynaui:envelope-open'" height="22" />
                    </template>

                    <v-list-item-title class="pl-4 text-body-1 text-truncate-2">
                        {{ notification.text }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-sheet>
    </v-menu>
</template>

<style>
.text-truncate-2 {
    display: -webkit-box !important;
    -webkit-line-clamp: 2; /* maksimal 2 baris */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal !important; /* jangan dipaksa satu baris */
    line-height: 1.4em;
    max-height: 2.8em; /* pas untuk 2 baris */
}
</style>
