<template>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('titleLang') }}</label>
        <InputText v-model="params.trt_title" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>  
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('contentLang') }}</label>
        <Editor v-model="params.trt_content" editorStyle="height: 320px" />
    </div>  
    <template v-if="formData"> 
        <div class="field">
            <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
            <StatusSelect v-model="params.trt_status" :hide-all="true" />
        </div>    
    </template>
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
                user_login_id   : this.$store.state.userStore.user_id,
                user_login_token: this.$store.state.userStore.token,
                trt_title       : '',
                trt_content     : '',
            },
        }
    },
    mounted() {
        console.log(this.formData);
        if(this.formData) {
            this.params.id              = this.formData.id
            this.params.trt_title       = this.formData.trt_title
            this.params.trt_content     = this.formData.trt_content
            this.params.trt_status      = String(this.formData.trt_status)
            console.log(this.params.trt_content);
        }
    },
    methods: {
        async submit(e) {
            let res;
            try {
                if(this.params.trt_title) {
                    if(this.formData && this.params.trt_title && this.params.id) {
                        res = await api.updateTemplate(this.params)
                    } else {
                        console.log(this.params);
                        res = await api.addTemplate(this.params)
                    }

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
    },
    components: {
        StatusSelect,
    }
}
</script>