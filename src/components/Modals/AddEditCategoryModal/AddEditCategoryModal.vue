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
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('Layout') }}</label>
        <Dropdown class="w-full" v-model="params.c_layout" :options="layoutOptions" optionLabel="label" optionValue="value" />
    </div>  
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('Allowed Level') }}</label>
        <InputNumber id="post-points" v-model="params.c_allowed_view_level" :min-fraction-digits="0" :max-fraction-digits="0" :min="1" class="w-full" :disabled="loading" />
    </div>  
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('Post Points') }}</label>
        <InputNumber id="post-points" v-model="params.c_post_pts" :min-fraction-digits="0" :max-fraction-digits="0" :min="1" class="w-full" :disabled="loading" />
    </div>  
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('Comment Points') }}</label>
        <InputNumber id="comment-points" v-model="params.c_comments_pts" :min-fraction-digits="0" :max-fraction-digits="0" :min="1" class="w-full" :disabled="loading" />
    </div>  
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('Lucky Comment') }}</label>
        <Dropdown class="w-full" v-model="params.c_lucky_comment" :options="luckyOptions" optionLabel="label" optionValue="value" />
    </div>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('Lucky Chance') }}</label>
        <InputNumber id="lucky-chance" v-model="params.c_lucky_pts_chance" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="100" class="w-full" :disabled="loading" />
    </div>  
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('Lucky Points') }}</label>
        <InputNumber id="lucky-points" v-model="params.c_lucky_pts" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="100" class="w-full" :disabled="loading" />
    </div>  
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('User Level') }}</label>
        <InputNumber id="user-level" v-model="params.c_allowed_user_level" :min-fraction-digits="0" :max-fraction-digits="0" :min="1" :max="100" class="w-full" :disabled="loading" />
    </div>  
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('User Level Comment') }}</label>
        <Dropdown class="w-full" v-model="params.c_allowed_user_level_comment" :options="luckyOptions" optionLabel="label" optionValue="value" />
    </div>
    <Button class="mt-3 w-full" :label="formData ? $store.getters['languageStore/translate']('updateLang') : $store.getters['languageStore/translate']('submitLang')" @click="submit('data')" :loading="loading" />
   
</template>

<script>
import { api } from '@/axios/api';
import StatusSelect from '@/components/GlobalComponents/StatusSelect.vue';

export default {
    inject: ['dialogRef'],
    data() {
        return {
            loading: false,
            formData    : this.dialogRef.data ? this.dialogRef.data.formData : null,
            // loading     : this.dialogRef.data ? this.dialogRef.data.loading : false,
            params: {
                // user_login_id     : this.$store.state.userStore.user_id,
                // user_login_token  : this.$store.state.userStore.token,
                c_title             : '',
                c_layout            : "grid", //grid or list
                c_post_pts          : null, // postive number
                c_comments_pts      : null, // postive number
                c_lucky_comment     : null, // 1 or 0 true or false,
                c_lucky_pts_chance  : null, // 1 - 100
                c_lucky_pts         : null, //1 - 100
                c_allowed_view_level: null, //user level
                c_allowed_user_level: null, //user level
                c_allowed_user_level_comment     : null, // 1 or 0 true or false,
            },
            layoutOptions: [
                {label: this.$store.getters['languageStore/translate']('Grid'), value: 'grid'},
                {label: this.$store.getters['languageStore/translate']('List'), value: 'list'},
            ],
            luckyOptions: [
                {label: this.$store.getters['languageStore/translate']('Yes'), value: 1},
                {label: this.$store.getters['languageStore/translate']('No'), value: 0},
            ],
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
            this.params.c_layout = this.formData.c_layout
            this.params.c_post_pts = this.formData.c_post_pts
            this.params.c_comments_pts = this.formData.c_comments_pts
            this.params.c_lucky_comment = this.formData.c_lucky_comment
            this.params.c_lucky_pts_chance = this.formData.c_lucky_pts_chance
            this.params.c_lucky_pts = this.formData.c_lucky_pts
            this.params.c_allowed_user_level = this.formData.c_allowed_user_level
            this.params.c_allowed_user_level_comment = this.formData.c_allowed_user_level_comment
            this.params.c_allowed_view_level = this.formData.c_allowed_view_level
            // this.params.cat_sort        = this.formData.cat_sort
            // this.params.cat_sort_old    = this.formData.cat_sort
        }
    },
    methods: {
        async submit(e) {
            this.loading = true;
            let res;
            try {
                if(this.params.c_title) {
                    if(this.formData && this.params.c_title && this.params.id) {
                        // this.params.cat_sort = this.params.cat_sort == null ? '' : parseInt(this.params.cat_sort)
                        // this.params.c_status = parseInt(this.params.c_status)
                        res = await api.updateCategory({
                            id: this.formData.id,
                            status: this.params.status,
                            ...this.params
                        })
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
            } finally {
                this.loading = false;
            }
        },
    },
    components: {
        StatusSelect,
    }
}
</script>