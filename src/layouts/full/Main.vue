<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue';
import sidebarItems from './vertical-sidebar/sidebarItem';
import NavGroup from './vertical-sidebar/NavGroup/index.vue';
import NavItem from './vertical-sidebar/NavItem/index.vue';
import Logo from './logo/Logo.vue';
import NotificationDD from './vertical-header/NotificationDD.vue';
import ProfileDD from './vertical-header/ProfileDD.vue';
import { Icon } from '@iconify/vue';
import { useDisplay } from 'vuetify';
import api from '@/plugins/axios';

const { mobile } = useDisplay();
const sidebarMenu = shallowRef(sidebarItems);
const sDrawer = ref(true);
const user = ref({ name: 'Guest' });
const notifications = ref([]);
const token = localStorage.getItem('access_token');

// Ambil user dari localStorage
try {
    const storedUser = localStorage.getItem('user');
    user.value = storedUser ? JSON.parse(storedUser) : { name: 'Guest' };
} catch (error) {
    user.value = { name: 'Guest' };
}

onMounted(async () => {
    await getNotification();
});

async function getNotification() {
    try {
        const res = await api.get('/get-notification', {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        });

        notifications.value = res.data.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
}
</script>

<template>
    <div class="safe-area">
        <template v-if="!mobile">
            <!-- Sidebar Web -->
            <v-navigation-drawer left elevation="0" app class="leftSidebar" v-model="sDrawer">
                <div class="d-flex flex-column align-center justify-center px-4 py-5">
                    <img src="@/assets/images/logos/logo-kpbn.jpg" height="100" alt="logo" />
                </div>

                <v-list class="py-2 px-2">
                    <template v-for="item in sidebarMenu" :key="item.title">
                        <NavGroup v-if="item.header" :item="item" />
                        <NavItem v-else :item="item" class="leftPadding" />
                    </template>
                </v-list>
            </v-navigation-drawer>
        </template>

        <template v-else>
            <!-- Sidebar Mobile (Bottom Navigation) -->
            <v-bottom-navigation app color="primary" grow :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }">
                <v-btn v-for="(item, i) in sidebarMenu.filter((i) => !i.header)" :key="item.title" :to="item.to" icon>
                    <Icon :icon="item.icon" />
                </v-btn>
            </v-bottom-navigation>
        </template>

        <!-- App Bar -->
        <v-app-bar elevation="0" height="70" class="bg-background" :style="{ paddingTop: 'env(safe-area-inset-top)' }">
            <div class="d-flex align-center justify-space-between w-100">
                <div :class="{ 'pt-7': mobile }">
                    <v-btn v-if="!mobile" class="text-muted" @click="sDrawer = !sDrawer" icon variant="flat" size="small">
                        <Icon icon="solar:hamburger-menu-outline" height="20" />
                    </v-btn>
                    <NotificationDD :notifications="notifications" />
                </div>

                <div :class="{ 'pt-7': mobile }" class="d-flex align-center">
                    <v-btn class="mr-2" href="">{{ user.name }}</v-btn>
                    <ProfileDD />
                </div>
            </div>
        </v-app-bar>
    </div>
</template>

<style scoped>
.leftSidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.safe-area {
    padding-top: env(safe-area-inset-top);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
}

.scrollnavbar {
    flex: 1;
    height: 100%;
    overflow: hidden;
}
</style>
