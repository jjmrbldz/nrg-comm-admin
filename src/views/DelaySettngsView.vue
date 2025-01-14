<template>
    <Card>
        <template #content>
            <div class="grid">
                <div class="col-4">
                    <div class="field">
                        <label>{{ $store.getters['languageStore/translate']('Comment Delay') }}</label>
                        <InputNumber type="name" v-model="params.tc_comment_delay" :use-grouping="true" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="100" class="w-full" :disabled="loading" />
                    </div>
                    <div class="field col">
                        <label>{{ $store.getters['languageStore/translate']('Post Delay') }}</label>
                        <InputNumber type="name" v-model="params.tc_post_delay" :use-grouping="true" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" :max="100" class="w-full" :disabled="loading" />
                    </div>
                    <Divider>Attendance</Divider>   
                    <div class="field col">
                        <label>{{ $store.getters['languageStore/translate']('Reward Daily') }}</label>
                        <InputNumber type="name" v-model="params.tc_attendance_reward_daily" :use-grouping="true" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" class="w-full" :disabled="loading" />
                    </div>   
                    <div class="field col">
                        <label>{{ $store.getters['languageStore/translate']('Reward Weekly') }}</label>
                        <InputNumber type="name" v-model="params.tc_attendance_reward_weekly" :use-grouping="true" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" class="w-full" :disabled="loading" />
                    </div>   
                    <div class="field col">
                        <label>{{ $store.getters['languageStore/translate']('Reward Monthly') }}</label>
                        <InputNumber type="name" v-model="params.tc_attendance_reward_monthly" :use-grouping="true" :min-fraction-digits="0" :max-fraction-digits="0" :min="0" class="w-full" :disabled="loading" />
                    </div>   
                    <div class="field col">
                        <label>{{ $store.getters['languageStore/translate']('Attendance On/Off') }}</label>
                        <div class="w-full pt-1">
                            <InputSwitch  v-model="params.tc_attendance_on_off" :true-value="1" :false-value="0" />
                        </div>
                    </div> 
                    <div class="flex">
                        <Button class="w-full" :label="$store.getters['languageStore/translate']('submitLang')" @click="submit" :loading="loading" />
                    </div>
                </div>  
            </div>
        </template>
    </Card>
</template>

<script>
import { api } from '@/axios/api';

export default {
    data() {
        return {
            loading     : true,
            params: {
                id                  : null,
                tc_comment_delay    : null,
                tc_post_delay       : null,
                tc_attendance_reward_daily      : null,
                tc_attendance_reward_weekly    : null,
                tc_attendance_reward_monthly    : null,
                tc_attendance_on_off            : null,
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
                        id                  : this.params.id,
                        tc_comment_delay    : this.params.tc_comment_delay,
                        tc_post_delay       : this.params.tc_post_delay,
                        tc_attendance_reward_daily      : this.params.tc_attendance_reward_daily,
                        tc_attendance_reward_weekly    : this.params.tc_attendance_reward_weekly,
                        tc_attendance_reward_monthly    : this.params.tc_attendance_reward_monthly,
                        tc_attendance_on_off            : this.params.tc_attendance_on_off,
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
                        id                  : null,
                        tc_comment_delay    : null,
                        tc_post_delay       : null,
                        tc_attendance_reward_daily      : null,
                        tc_attendance_reward_weekly    : null,
                        tc_attendance_reward_monthly    : null,
                        tc_attendance_on_off            : null,
                    }
                }
                
            } catch (error) {
                console.error(error)
                this.params = {
                    id                  : null,
                    tc_comment_delay    : null,
                    tc_post_delay       : null,
                    tc_attendance_reward_daily      : null,
                    tc_attendance_reward_weekly     : null,
                    tc_attendance_reward_monthly    : null,
                    tc_attendance_on_off            : null,
                }
                throw error
            } finally {
                this.loading = false
            }
        },
    },
}
</script>