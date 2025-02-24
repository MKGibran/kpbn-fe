<template>
    <v-container>
        <!-- KPBN -->
        <v-card elevation="10" class="pa-5 mb-5">
            <v-card-title class="text-h6 font-weight-bold">KPBN</v-card-title>
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
        </v-card>
        <!-- MDEX -->
        <v-card elevation="10" class="pa-5 mb-5">
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
        </v-card>
        <!-- SOYOIL -->
        <v-card elevation="10" class="pa-5 mb-5">
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
        </v-card>
    </v-container>
</template>

<script setup>
  // No additional logic needed for now
</script>

<style scoped>
    .v-btn {
        text-transform: none;
    }
</style>
