<template>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('nameLang') }}</label>
        <InputText type="name" v-model="params.c_title" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>  
    <template v-if="formData">
        <div class="field" v-if="false">
            <label>{{ $store.getters['languageStore/translate']('currentOrderLang') }}</label>
            <InputText type="name" v-model="params.cat_sort_old" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" disabled />
        </div>    
        <div class="field" v-if="false">
            <label>{{ $store.getters['languageStore/translate']('newOrderLang') }}</label>
            <Dropdown class="w-full" v-model="params.cat_sort" :options="sortOptions" optionLabel="code" optionValue="code" />
        </div>    
        <div class="field">
            <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
            <StatusSelect v-model="params.c_status" :hide-all="true" />
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
                // user_login_id     : this.$store.state.userStore.user_id,
                // user_login_token  : this.$store.state.userStore.token,
                c_title         : '',
            },
        }
    },
    computed:{
        sortOptions(){
            let result = []
            let i
            for(i=1;i<=this.dialogRef.data.totalItems;i++){
                result.push({name:i,code:i})
            }

            return result
        }
    },
    mounted() {
        console.log(this.formData);
        if(this.formData) {
            this.params.id      = String(this.formData.id)
            this.params.c_title = this.formData.c_title
            this.params.c_status= String(this.formData.c_status)
            // this.params.cat_sort        = this.formData.cat_sort
            // this.params.cat_sort_old    = this.formData.cat_sort
        }
    },
    methods: {
        async submit(e) {
            let res;
            try {
                if(this.params.c_title) {
                    if(this.formData && this.params.c_title && this.params.id) {
                        // this.params.cat_sort = this.params.cat_sort == null ? '' : parseInt(this.params.cat_sort)
                        // this.params.c_status = parseInt(this.params.c_status)
                        res = await api.updateCategory(this.params)
                    } else {
                        console.log(this.params);
                        res = await api.addCategory(this.params)
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