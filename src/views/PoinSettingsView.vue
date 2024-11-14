<template>
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('Minimum') }}</label>
        <InputNumber type="name" v-model="params.min" :use-grouping="false" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="100" class="w-full" :disabled="loading" />
    </div>  
    <div class="field">
        <label>{{ $store.getters['languageStore/translate']('Maximum') }}</label>
        <InputNumber type="name" v-model="params.max" :use-grouping="false" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="100" class="w-full" :disabled="loading" />
    </div>     
    <Button class="mt-3 w-full" :label="$store.getters['languageStore/translate']('submitLang')" @click="submit" :loading="loading" />
   
</template>

<script>
import { api } from '@/axios/api';

export default {
    data() {
        return {
            loading     : true,
            params: {
                id      : null,
                min     : null,
                max     : null,
            },
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        async submit() {
            try {
                if(this.params.id && this.params.min !== null && this.params.min !== null) {
                    this.loading = true
                    const reqBody = {
                        id      : this.params.id,
                        min     : this.params.min,
                        max     : this.params.max,
                    }
                    const res = await api.updatePointSettings(reqBody)

                    const code  = parseInt(res.data.code);
                    const msg   = res.data.message;
                    console.log(res, code, msg);
                    if(code !== 1) {
                        this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                        this.getList()
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
                this.loading = false
            }
        },
        async getList() {
            this.loading = true
            try {
                
                const res   = await api.getPointSettings()
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                if(code !== 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.params = res.data.data
                } else {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`) ? this.$store.getters['languageStore/translate'](`${msg}`) : msg)
                    this.params = {
                        id      : null,
                        min     : null,
                        max     : null,
                    }
                }
                
            } catch (error) {
                console.error(error)
                this.params = {
                    id      : null,
                    min     : null,
                    max     : null,
                }
                throw error
            } finally {
                this.loading = false
            }
        },
    },
}
</script>