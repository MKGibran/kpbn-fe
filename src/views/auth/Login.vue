<script setup lang="ts">
// import Logo from '@/layouts/full/logo/Logo.vue';

/* Login form */
import LoginForm from '@/components/auth/LoginForm.vue';
</script>
<template>
    <div class="authentication">
        <v-container fluid class="pa-3">
            <v-row class="h-100vh d-flex justify-center align-center">
                <v-col cols="12" lg="4" xl="3" class="d-flex align-center">
                    <v-card elevation="10" class="px-sm-1 px-0  mx-auto" max-width="500">
                        <v-card-item class="pa-sm-8">
                            <div class="d-flex justify-center py-4">
                                <!-- <Logo /> -->
                                <!-- <h2>Logo</h2> -->
                                <img src="@/assets/images/logos/logo-kpbn.jpg" height="100" alt="user" />
                            </div>
                            <!-- <div class="text-body-1 text-muted text-center mb-3">Dashboard KPBN</div> -->
                            <LoginForm />
                            <h6 class="text-h6 text-muted font-weight-regular d-flex justify-center align-center mt-3">
                                Dont have an Account?
                                <RouterLink to="/auth/register"
                                    class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium pl-2">
                                    Register Here</RouterLink>
                            </h6>
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
