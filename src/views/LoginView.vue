<template>
    <div class="min-h-screen min-w-screen flex align-items-center justify-content-center flex-column">
        <Card class="w-3 h-auto">
            <template #header>
                <div class="logo max-w-18rem mx-auto mt-4">
                    <img ref="logo" class="w-full" src="@/assets/img/masarap-logo.png" alt="">
                    <!-- <span class="logo-placeholder ml-3 text-center">LOGO</span> -->
                </div>
            </template>
            <template #title><div class="font-bold text-center">Administrator Login</div></template>
            <template #content>
                <div class="mt-4">
                    <div class="flex flex-column gap-2 mb-3">
                        <label for="username" class="text-500 font-medium">{{ this.$store.getters['languageStore/translate']('usernameLang') }}</label>
                        <IconField iconPosition="left">
                            <InputIcon>
                                <i class="pi pi-user " style="left: 14px;" />
                            </InputIcon>
                            <InputText v-model="params.tp_user_id" class="w-full pl-6 py-3" :placeholder="this.$store.getters['languageStore/translate']('enterUserNameLang')" @keyup.enter="login()" />
                        </IconField>
                    </div>
                    <div class="flex flex-column gap-2 mb-5">
                        <label for="username" class="text-500 font-medium">{{ this.$store.getters['languageStore/translate']('passwordLang') }}</label>
                        <IconField iconPosition="left">
                            <InputIcon class="left-2 z-1">
                                <i class="pi pi-lock " style="left: 14px;" />
                            </InputIcon>
                            <Password v-model="params.tp_password" class="w-full " inputClass="w-full pl-6 py-3" :placeholder="this.$store.getters['languageStore/translate']('enterPasswordLang')" :feedback="false" toggleMask @keyup.enter="login()" />
                        </IconField>
                    </div>
                    <Button :label="this.$store.getters['languageStore/translate']('loginLang')" class="w-full p-3" @click="login()" />
                </div>
            </template>
        </Card>
    </div>
</template>

<script>
import VanillaTilt from 'vanilla-tilt'

export default {
    data() {
        return {
            params: {
                tp_user_id  : null,
                tp_password : null,
                // user_device     : navigator.userAgent,
                // login_type      : 'admin',
            }
        }
    },
    mounted() {
        VanillaTilt.init(this.$refs.logo, {
            max: 25,
            speed: 1000,
            glare: true,
            'max-glare': 0.5
        })
    },
    methods: {
        async login() {
            if(this.params.tp_user_id && this.params.tp_password) {
                const ret = await this.$store.dispatch('userStore/login', this.params);
            } else {
                this.$GF.customToast(1, this.$store.getters['languageStore/translate']('Please complete all fields'));
            }
        }
    },
    components: {
    }
}
</script>