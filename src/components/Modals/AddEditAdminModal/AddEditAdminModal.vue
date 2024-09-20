<template>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('idLang') }}</label>
        <InputText type="username" v-model="params.tp_user_id" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="!!formData" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('nicknameLang') }}</label>
        <InputText type="name" v-model="params.tp_nickname" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('passwordLang') }}</label>
        <Password v-model="params.tp_password" class="w-full" inputClass="w-full" :feedback="false" toggleMask />
    </div>    
    <div class="field" v-if="formData">
        <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
        <StatusSelect v-model="params.tp_status" />
    </div>    
    <Button class="mt-3 w-full" :label="formData ? $store.getters['languageStore/translate']('updateLang') : $store.getters['languageStore/translate']('submitLang')" @click="submit('data')" />
   
</template>

<script>
import { api } from '@/axios/api';
import StatusSelect from '@/components/GlobalComponents/StatusSelect.vue';

export default {
    inject: ['dialogRef'],
    data() {
        return {
            formData    : this.dialogRef.data ? this.dialogRef.data.formData : null,
            // loading     : this.dialogRef.data ? this.dialogRef.data.loading : false,
            params: {
                // user_login_id     : this.$store.state.userStore.tp_user_id,
                // user_login_token  : this.$store.state.userStore.token,
                // tp_user_id           : '',
                tp_user_id      : '',
                tp_nickname     : '',
                tp_password     : '',
                tp_first_name   : '-',
                tp_last_name    : '-',
                tp_email        : '-',
                // user_email        : ''
            },
        }
    },
    mounted() {
        console.log(this.formData);
        if(this.formData) {
            this.params.tp_user_id  = this.formData.tp_user_id
            this.params.tp_nickname = this.formData.tp_nickname
            this.params.tp_status   = String(this.formData.tp_status)
            this.params.request_id  = String(this.$store.state.userStore.id)
            this.params.id          = String(this.formData.id)
        }
    },
    methods: {
        async submit(e) {
            let res;
            try {
                console.log(this.params);
                if(this.params.tp_user_id && this.params.tp_nickname) {
                    if(this.formData) {
                        // const updateParams = {
                        //     ...this.params,
                        //     tp_status: Number(this.params.tp_status)
                        // }
                        res = await api.updateAdmin(this.params)
                    } else {
                        if (this.params.tp_password) {
                            res = await api.addAdmin(this.params)
                        } else {
                            this.$GF.customToast(1, this.$store.getters['languageStore/translate'](`Please complete all fields`))
                        }
                    }
                    // const res   = await api[`${this.formData ? 'updateUser' : 'addAdmin'}`](this.params)
                    // const res   = await api.addAdmin(this.params)
                    const code  = parseInt(res.data.code);
                    const msg   = res.data.message;
                    console.log(res, code, msg);
                    if(code !== 1) {
                        this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                        this.dialogRef.close(e);
                    } else {
                        this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    }
                } else {
                    this.$GF.customToast(1, this.$store.getters['languageStore/translate'](`Please complete all fields`))
                }
            } catch (error) {
                console.error(error)
                throw error
            }
        },
    }
}
</script>