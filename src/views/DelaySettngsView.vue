<template>
    <div class="formgrid grid">
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('Comment Delay') }}</label>
            <InputNumber type="name" v-model="params.tc_comment_delay" :use-grouping="false" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="100" class="w-full" :disabled="loading" />
        </div>  
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('Post Delay') }}</label>
            <InputNumber type="name" v-model="params.tc_post_delay" :use-grouping="false" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="100" class="w-full" :disabled="loading" />
        </div>   
        <div class="field col">
            <label>&nbsp;</label>
            <Button class="w-full" :label="$store.getters['languageStore/translate']('submitLang')" @click="submit" :loading="loading" />
        </div>
    </div>
</template>

<script>
import { api } from '@/axios/api';

export default {
    data() {
        return {
            loading     : true,
            params: {
                id      : null,
                tc_comment_delay     : null,
                tc_post_delay     : null,
            },
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        async submit() {
            try {
                if(this.params.id && this.params.tc_comment_delay !== null && this.params.tc_post_delay !== null) {
                    this.loading = true
                    const reqBody = {
                        id      : this.params.id,
                        tc_comment_delay     : this.params.tc_comment_delay,
                        tc_post_delay     : this.params.tc_post_delay,
                    }
                    const res = await api.updateDelaySettings(reqBody)

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
                
                const res   = await api.getDelaySettings()
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                if(code !== 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.params = res.data.data
                } else {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`) ? this.$store.getters['languageStore/translate'](`${msg}`) : msg)
                    this.params = {
                        id      : null,
                        tc_comment_delay     : null,
                        tc_post_delay     : null,
                    }
                }
                
            } catch (error) {
                console.error(error)
                this.params = {
                    id      : null,
                    tc_comment_delay     : null,
                    tc_post_delay     : null,
                }
                throw error
            } finally {
                this.loading = false
            }
        },
    },
}
</script>