<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue';
import sidebarItems from './vertical-sidebar/sidebarItem';
import NavGroup from './vertical-sidebar/NavGroup/index.vue';
import NavItem from './vertical-sidebar/NavItem/index.vue';
import Logo from './logo/Logo.vue';
// dropdown imports
import NotificationDD from './vertical-header/NotificationDD.vue';
import ProfileDD from './vertical-header/ProfileDD.vue';
import { Icon } from '@iconify/vue';
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();
const sidebarMenu = shallowRef(sidebarItems);
const sDrawer = ref(true);

// Default guest user
const user = ref({ name: 'Guest' });

// Ambil user dari localStorage
try {
    const storedUser = localStorage.getItem('user');
    user.value = storedUser ? JSON.parse(storedUser) : { name: 'Guest' };
} catch (error) {
    user.value = { name: 'Guest' };
}
</script>

<template>
    <!-- Sidebar Web & Mobile dibungkus agar v-if / v-else valid -->
    <template v-if="!mobile">
        <!-- Sidebar Web -->
        <v-navigation-drawer left elevation="0" app class="leftSidebar" v-model="sDrawer">
            <div class="d-flex flex-column align-center justify-center px-4 py-5">
                <!-- <h3>CPO</h3> -->
                <img src="@/assets/images/logos/logo-kpbn.jpg" height="100" alt="user" />
                <!-- <h5 class="text-body-1 text-textSecondary">Dashboard KPBN</h5> -->
            </div>

            <v-list class="py-2 px-2">
                <template v-for="item in sidebarMenu" :key="item.title">
                    <NavGroup v-if="item.header" :item="item" />
                    <NavItem v-else :item="item" class="leftPadding" />
                </template>
            </v-list>
            <!-- <perfect-scrollbar class="scrollnavbar">
            </perfect-scrollbar> -->
        </v-navigation-drawer>
    </template>

    <template v-else>
        <!-- Sidebar Mobile (Bottom Navigation) -->
        <v-bottom-navigation app color="primary" grow>
            <v-btn v-for="(item, i) in sidebarMenu.filter((i) => !i.header)" :key="item.title" :to="item.to" icon>
                <Icon :icon="item.icon" />
            </v-btn>
        </v-bottom-navigation>
    </template>

    <!-- App Bar -->
    <v-app-bar elevation="0" height="70" class="bg-background">
        <div class="d-flex align-center justify-space-between w-100">
            <div>
                <v-btn v-if="!mobile" class="hidden-lg-and-up text-muted" @click="sDrawer = !sDrawer" icon variant="flat" size="small">
                    <Icon icon="solar:hamburger-menu-outline" height="20" />
                </v-btn>
            </div>
            <div>
                <v-btn class="mr-2" href="">{{ user.name }}</v-btn>
                <ProfileDD />
            </div>
        </div>
    </v-app-bar>
</template>

<style scoped>
.leftSidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.scrollnavbar {
    flex: 1;
    height: 100%;
    overflow: hidden;
}
</style>
