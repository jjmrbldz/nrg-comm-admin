<template>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('idLang') }}</label>
        <InputText type="username" v-model="params.tu_user_id" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="!!formData" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('nicknameLang') }}</label>
        <InputText type="name" v-model="params.tu_nickname" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('passwordLang') }}</label>
        <Password v-model="params.tu_password" class="w-full" inputClass="w-full" :feedback="false" toggleMask />
    </div>    
    <div class="field" v-if="formData">
        <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
        <StatusSelect v-model="params.tu_status" :hide-all="true" />
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
                // user_login_id     : this.$store.state.userStore.user_id,
                // user_login_token  : this.$store.state.userStore.token,
                tu_user_id           : '',
                tu_first_name         : '-',
                tu_last_name         : '-',
                tu_nickname     : '',
                tu_password     : '',
                tu_email        : '-'
            },
        }
    },
    mounted() {
        console.log(this.formData);
        if(this.formData) {
            this.params.id              = this.formData.id,
            this.params.tu_user_id      = this.formData.tu_user_id,
            this.params.tu_first_name   = this.formData.tu_first_name,
            this.params.tu_last_name   = this.formData.tu_last_name,
            this.params.tu_nickname     = this.formData.tu_nickname,
            // this.params.tu_password  = this.formData.tu_password,
            this.params.user_phone      = this.formData.user_phone,
            this.params.tu_email        = this.formData.tu_email
            this.params.tu_status       = String(this.formData.tu_status)
        }
    },
    methods: {
        async submit(e) {
            let res;
            try {
                console.log(this.params);
                if(this.params.tu_user_id && this.params.tu_nickname) {
                    if(this.formData) {
                        res = await api.updateUser(this.params)
                    } else {
                        if (this.params.tu_password) {
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