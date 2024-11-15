<template>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('nameLang') }}</label>
        <InputText type="name" v-model="params.name" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>  
    <template v-if="formData">   
        <div class="field">
            <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
            <StatusSelect v-model="params.status" :hide-all="true" />
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
            params: {
                name    : '',
            },
        }
    },
    mounted() {
        console.log(this.formData);
        if(this.formData) {
            this.params.id      = String(this.formData.id)
            this.params.name = this.formData.name
            this.params.status= String(this.formData.status)
        }
    },
    methods: {
        async submit(e) {
            let res;
            try {
                if(this.params.name) {
                    if(this.formData && this.params.name && this.params.id) {
                        res = await api.updateAccredited(this.params)
                    } else {
                        console.log(this.params);
                        res = await api.addAccredited(this.params)
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