<template>
    <Card style="width: 40vw;">
        <template #content>
            <div class="field">
                <label>{{ $store.getters['languageStore/translate']('URL1') }}</label>
                <InputText v-model="params.url_1" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
            </div>
            <div class="field">
                <label>{{ $store.getters['languageStore/translate']('URL2') }}</label>
                <InputText v-model="params.url_2" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
            </div>
            <div class="field">
                <label>{{ $store.getters['languageStore/translate']('URL3') }}</label>
                <InputText v-model="params.url_3" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
            </div>    
            <div class="field">
                <label>{{ $store.getters['languageStore/translate']('URL4') }}</label>
                <InputText v-model="params.url_4" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
            </div>    
            <Button class="mt-3 w-full" :label="$store.getters['languageStore/translate']('submitLang')" @click="submit('data')" />
        </template>
    </Card>
   
</template>

<script>
import { api } from '@/axios/api';

export default {
    data() {
        return {
            // loading     : this.dialogRef.data ? this.dialogRef.data.loading : false,
            params: {
                user_login_id   : this.$store.state.userStore.user_id,
                user_login_token: this.$store.state.userStore.token,
                url_1            : '',
                url_2            : '',
                url_3            : '',
                url_4            : '',
            },
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        async submit(e) {
            try {
                
                if(this.params.id) {
                    delete this.params.id
                }
                const res = await api.updateURL(this.params)
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                console.log(res, code, msg);
                if(code !== 1) {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                } else {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                }
            
            } catch (error) {
                console.error(error)
                throw error
            }
        },
        async getList() {
            this.loading = true
            try {
                const res       = await api.getURL()
                const code      = parseInt(res.data.code);
                const msg       = res.data.message;
                this.totalitems = res.data.totalitems
                if(code !== 1) {
                    this.params = Object.assign(this.params, res.data.data)
                } else {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`) ? this.$store.getters['languageStore/translate'](`${msg}`) : msg)
                    // this.list = []
                }
            } catch (error) {
                console.error(error)
                this.list = []
                throw error
            } finally {
                this.loading = false
                this.$store.dispatch('listStore/setUploadProgress', null)
            }
        },
    }
}
</script>