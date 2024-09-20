<template>
    <Menubar class="fixed z-50 top-0 m-2 header" style="height: 68px;z-index: 50;">
        <template #start>
            <div class="inline-flex max-w-12rem align-items-center">
                <RouterLink to="/">
                    <img class="h-4rem" src="@/assets/img/NRG-Logo.png" alt="">
                    <!-- <span class="logo-placeholder ml-3">LOGO</span> -->
                </RouterLink>
            </div>
        </template>
        <template #end>
            <div class="flex align-items-center gap-2">
                <Button icon="pi pi-bell" aria-label="Theme Toggle" rounded text />
                <LanguageToggle />
                <Button :icon="!this.$store.state.lightThemeStore.lightTheme ? 'pi pi-sun' : 'pi pi-moon'" aria-label="Theme Toggle" @click="handleTheme" rounded text />
                <span class="font-light mr-2">|</span>
                <Button icon="pi pi-user" severity="secondary" rounded @click="updateItem()" />
                <Button icon="pi pi-sign-out" aria-label="Logout" @click="this.$store.commit('userStore/logout')" rounded text />
            </div>
        </template>
    </Menubar>
</template>

<script>
import lightThemeStore from '@/store/theme';
import LanguageToggle from '@/components/GlobalComponents/LanguageToggle.vue'
import { api } from '@/axios/api';

export default {
    data() {
        return {
            updateProps: {
                itemID: this.$store.state.userStore.user_id, 
                getAPI: 'getUser', 
                getParams: 'user_id', 
                modalHeader: 'Add/Edit Admin', 
                icon: 'mdi mdi-account-edit', 
                modalType: 'AddEditAdmin', 
            }
        }
    },
    mounted() {
    },
    methods: {
        handleTheme() {
            console.log(this.$store.state.lightThemeStore.lightTheme);
            if(this.$store.state.lightThemeStore.lightTheme) {
                this.$primevue.changeTheme('aura-light-noir', 'aura-dark-noir', 'theme-link', () => {})
                this.$store.dispatch('lightThemeStore/setLightTheme', false)
            } else {
                this.$primevue.changeTheme('aura-dark-noir', 'aura-light-noir', 'theme-link', () => {})
                this.$store.dispatch('lightThemeStore/setLightTheme', true)
            }
        },
        async updateItem() {
            console.log(this.updateProps);
            let params = {};
            try {
                if(typeof this.updateProps.getParams === 'string') {
                    params[`${this.updateProps.getParams}`] = this.updateProps.itemID
                } else {
                    params = this.updateProps.getParams
                }
                console.log(params);
                const res   = await api[`${this.updateProps.getAPI}`](params)
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;

                if(code !== 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.$dialog.open(this.$modalComponent[`${this.updateProps.modalType}`], {
                        props: {
                            header: this.$store.getters['languageStore/translate'](`${this.updateProps.modalHeader}`),
                            style: {
                                width: this.updateProps.width ? this.updateProps.width : '30vw',
                                overflow: 'hidden'
                            },
                            breakpoints: {
                                // '960px': '75vw',
                                // '640px': '90vw'
                            },
                            modal: true,
                        },
                        data: {
                            formData: res.data.data,
                            // totalItems: this.updateProps.totalItems
                        },
                        onClose: (options) => {
                            // this.getList()
                        }
                    });
                } else {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`) ? this.$store.getters['languageStore/translate'](`${msg}`) : msg)
                }

            } catch(error) {
                console.error(error)
                throw error
            }
        },
    },
    components: {
        LanguageToggle
    }
}
</script>