
<template>
    <div class="card">
        <MeterGroup v-if="false" :value="value" labelPosition="end">
            <template #meter="slotProps">
                <span :class="slotProps.class" :style="{ background: `linear-gradient(to right, ${slotProps.value.color1}, ${slotProps.value.color2})`, width: slotProps.size }" />
            </template>
            <template #start="{ totalPercent }">
                <div class="flex justify-content-between mt-3 relative">
                    <span>Storage</span>
                    <span class="font-medium">{{ `${parseInt((totalPercent / 100 * totalUsedSpace) / (1024 * 1024))} MB / ${parseInt(totalStorage / (1024 * 1024 * 1024))} GB` }}</span>
                </div>
            </template>
            <template #end="{ totalPercent }">
                <div class="flex justify-content-between relative">
                    <span :style="{ width: totalPercent + '%' }" class="absolute text-right text-xs text-color-secondary">{{ parseInt((totalPercent  / 100 * totalUsedSpace) / (1024 * 1024))  }} MB</span>
                </div>
            </template>
            <template #label="{ value }">
                <div class="hidden"></div>
            </template>      
        </MeterGroup>
        <Card class="mt-4">
            <template #title>
                <span class="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center" :style="{ backgroundColor: `var(--cyan-500)`, color: '#ffffff' }">
                    <i class="mdi mdi mdi-poll" />
                </span>
                {{$store.getters['languageStore/translate']('Analytics')}}
            </template>
            <template #content>
                <div class="grid mt-2">
                    <div v-ripple class="col-2 cursor-pointer relative overflow-hidden hover:surface-hover border-round-sm" @click="$router.push('/user')">
                        <div class="flex justify-content-center align-items-center gap-5">
                            <span class="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center" :style="{ backgroundColor: `var(--orange-500)`, color: '#ffffff' }">
                                <i class="mdi mdi-account-circle" />
                            </span>
                            <div class="flex flex-column gap-1">
                                <span class="text-secondary text-sm">{{ $store.getters['languageStore/translate']('Users') }}</span>
                                <span class="font-bold text-lg">{{ dashboardData ? dashboardData.total_members : '-'}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-1"><Divider layout="vertical" /></div>
                    <div class="col-4">
                        <div class="flex justify-content-center align-items-center gap-5">
                            <span class="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center" :style="{ backgroundColor: `var(--teal-500)`, color: '#ffffff' }">
                                <i class="mdi mdi-calendar-account" />
                            </span>
                            <div class="flex flex-column gap-1">
                                <span class="text-secondary text-sm">{{ $store.getters['languageStore/translate']('Visitors Today') }}</span>
                                <span class="font-bold text-lg">{{ dashboardData ? dashboardData.today_visitor : '-'}}</span>
                            </div>
                            <div class="flex flex-column gap-1">
                                <span class="text-secondary text-sm">{{ $store.getters['languageStore/translate']('Visitors Yesterday') }}</span>
                                <span class="font-bold text-lg">{{ dashboardData ? dashboardData.yesterdata_visitory : '-'}}</span>
                            </div>
                            <div class="flex flex-column gap-1">
                                <span class="text-secondary text-sm">{{ $store.getters['languageStore/translate']('Total Visitors') }}</span>
                                <span class="font-bold text-lg">{{ dashboardData ? dashboardData.total_visitor : '-'}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-1"><Divider layout="vertical" /></div>
                    <div v-ripple class="col-2 cursor-pointer relative overflow-hidden hover:surface-hover border-round-sm" @click="$router.push('/inquiry')">
                        <div class="flex justify-content-center align-items-center gap-5">
                            <span class="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center" :style="{ backgroundColor: `var(--purple-500)`, color: '#ffffff' }">
                                <i class="mdi mdi-message-badge" />
                            </span>
                            <div class="flex flex-column gap-1">
                                <span class="text-secondary text-sm">{{ $store.getters['languageStore/translate']('Unread Inquiries') }}</span>
                                <span class="font-bold text-lg">{{ dashboardData ? dashboardData.inq_unread : '-'}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Card>
        <Card v-if="false" class="mt-4">
            <template #title>
                <span class="mr-2 w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center" :style="{ backgroundColor: `var(--green-500)`, color: '#ffffff' }">
                    <i class="mdi mdi-video" /> 
                </span>
                <router-link class="text-primary" to="/video">
                    {{$store.getters['languageStore/translate']('Videos')}}
                </router-link>
            </template>
            <template #content>
                <div class="grid">
                    <div class="col-2" v-if="dashboardData" v-for="item in dashboardData.dashboard_categoryies">
                        <div class="flex justify-content-between gap-5">
                            <div class="flex flex-column gap-1">
                                <span class="text-secondary text-sm capitalize">{{ $store.getters['languageStore/translate'](item.c_title) }}</span>
                                <span class="font-bold text-lg">{{ item.video_count }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </Card>
        <div v-if="false" class="mt-3 grid">
            <div class="col">
                <Card>
                    <template #title>
                        <span class="w-2rem h-2rem border-circle inline-flex justify-content-center align-items-center text-center" :style="{ backgroundColor: `var(--pink-500)`, color: '#ffffff' }">
                            <i class="mdi mdi-comment" />
                        </span>
                        {{ $store.getters['languageStore/translate']('Comments') }}
                    </template>
                    <template #content>
                        <DataTable :value="list" :loading="loading">
                            <Column :header="$store.getters['languageStore/translate']('numberAbbrLang')">
                                <template #body="{data}">
                                    {{ data.idx }}
                                </template>
                            </Column>
                            <Column :header="$store.getters['languageStore/translate']('nicknameLang')">
                                <template #body="{data}">
                                    {{ data.user_nickname }}
                                </template>
                            </Column>
                            <Column :header="$store.getters['languageStore/translate']('contentLang')">
                                <template #body="{data}">
                                    <p>
                                        {{ data.content }}
                                    </p>
                                </template>
                            </Column>
                            <Column :header="$store.getters['languageStore/translate']('dateLang')">
                                <template #body="{data}">
                                    {{ this.$GF.getDateTime(data.reg_datetime) }}
                                </template>
                            </Column>
                            <Column :header="$store.getters['languageStore/translate']('actionLang')">
                                <template #body="{data}">
                                    <Button icon="mdi mdi-eye" :label="$store.getters['languageStore/translate']('detailLang')" @click="$router.push({path: '/comments'})" />
                                </template>
                            </Column>
                        </DataTable>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
import { api } from '@/axios/api';
export default {
    data() {
        return {
            loading : false,
            show    : false,
            totalStorage    : 0,
            totalUsedSpace  : 0,
            value: [
                {  value: 300 / 1000 * 100 },
            ],
            list: [],
            dashboardData: null,
            params: {
                user_login_id   : this.$store.state.userStore.user_id,
                user_login_token: this.$store.state.userStore.token,
            }
        };
    },
    mounted() {
        this.getAnalytics()
    },
    methods: {
        showComments() {
            this.show = !this.show
            console.log('aa');
        },
        async getAnalytics() {
            this.loading = true
            try {
                
                const res   = await api.getDashboardData(this.params)
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                if(code !== 1) {
                    this.dashboardData = res.data.data
                    this.totalUsedSpace = res.data.data.dashboard_totalmemory - res.data.data.dashboard_freememory // to GB
                    this.totalStorage = this.dashboardData.dashboard_totalmemory

                    console.log(this.totalStorage, this.totalUsedSpace);

                    this.value[0].value = (this.totalUsedSpace / this.totalStorage) * 100
                    this.list = res.data.data.dashboard_comments
                } else {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`) ? this.$store.getters['languageStore/translate'](`${msg}`) : msg)
                    this.dashboardData = []
                }
                
            } catch (error) {
                console.error(error)
                this.dashboardData = []
                throw error
            } finally {
                this.loading = false
            }
        },
    },
};
</script>
