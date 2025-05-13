<script setup>
import { Icon } from '@iconify/vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps({ item: Object, level: Number });
</script>

<template>
    <!---Single Item-->
    <v-list-item
        :to="item.type === 'external' ? '' : item.to"
        :href="item.type === 'external' ? item.to : ''"
        rounded
        class="mb-1"
        :class="{ 'active-menu': route.path === item.to }"
        :disabled="item.disabled"
        :target="item.type === 'external' ? '_blank' : ''">
        <!---If icon-->
        <template v-slot:prepend>
            <Icon :icon="item.icon" height="18" width="18" :level="level" class="dot" :class="'text-' + item.BgColor"/>
        </template>
        <v-list-item-title class="mx-2">{{item.title}}</v-list-item-title>
        <!---If Caption-->
        <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
            {{ item.subCaption }}
        </v-list-item-subtitle>
        <!---If any chip or label-->
        <template v-slot:append v-if="item.chip">
            <v-chip
                :color="item.chipColor"
                :class="'sidebarchip hide-menu bg-' + item.chipBgColor"
                :size="item.chipIcon ? 'small' : 'small'"
                :variant="item.chipVariant"
                :prepend-icon="item.chipIcon"
            >
                {{ item.chip }}
            </v-chip>
        </template>
    </v-list-item>
</template>

<style scoped>
.active-menu {
    background-color: #7ddaffee; /* Warna biru muda */
    font-weight: bold;
    border-radius: 8px;
}
</style>

