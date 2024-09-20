<template>
    <div class="grid p-2">
        <div class="formgrid grid">
            <div class="field col-4">
                <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
                <StatusSelect v-model="params.status" />
            </div>
            <div class="field col-6">
                <label>{{ $store.getters['languageStore/translate']('titleLang') }}</label>
                <InputText type="search" v-model="params.filter_title" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @keyup.enter="getList()" />
            </div>
        </div>
        <div class="col"></div>
    </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`numberAbbrLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`userIdLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span class="mr-2">{{ data.username }}</span>
                <StatusTag :status="data.inq_user_status" />
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`titleLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.inq_content }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`messageLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <div v-html="data.inq_reply"></div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateRegisteredLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.getDateTime(data.inq_reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Reply`)" style="min-width: 100px">
            <template #body="{ data }">
                <div v-html="data.inq_reply"></div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateupdatedLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.getDateTime(data.inq_update_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <UpdateItemButton :updateProps="{itemID: data.id, getAPI: 'getInquiry', getParams: { id: data.id }, modalHeader: 'Reply Inquiry', icon: 'mdi  mdi-reply', modalType: 'ReplyInquiry', callback: () => getList(), totalItems: totalRecords, width: '40vw'}" />
            </template>
        </Column>
        
        <template #empty> <div class="text-center text-danger"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
    </DataTable>
    <Paginator
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        :rows="params.limit"
        :totalRecords="totalRecords"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        @page="handlePagination"
        >
    </Paginator>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { api } from '@/axios/api';
import StatusTag from '../GlobalComponents/StatusTag.vue';

export default {
    data() {
        return {
            totalRecords: 0,
            loading: false,
            list: [],
            params: {
                user_id     : '',
                status      : '',
                orderby     : 'desc',
                page        : 1,
                limit       : 10
            }
        }
    },
    watch: {
        'params.status'() {
            this.page = 1
            this.getList();
        },
        'params.filter_title'(newVal) {
            if(!newVal) {
                this.page = 1
                this.getList();
            }
        },
    },
    mounted() {
        this.getList()
    },
    methods: {
        handlePagination(data) {
            console.log(data);
            this.params.page     = data.page+1;
            this.params.limit    = data.rows;
            this.getList()
        },
        async getList() {
            this.loading = true
            try {
                const reqParams = {
                    ...this.params,
                    page    : String(this.params.page),
                    limit   : String(this.params.limit)
                }
                const res   = await api.getInquiryList(reqParams)
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                if(code !== 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.list = res.data.data
                    this.totalRecords = res.data.totalitems
                } else {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`) ? this.$store.getters['languageStore/translate'](`${msg}`) : msg)
                    this.list = []
                }
                
            } catch (error) {
                console.error(error)
                this.list = []
                throw error
            } finally {
                this.loading = false
            }
        },
    },
}
</script>