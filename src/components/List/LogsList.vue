<template>
    <div class="formgrid grid">
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('User ID') }}</label>
            <InputText type="search" v-model="params.user_id" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @keyup.enter="getList()" />
        </div>
        <div class="field col-1">
            <label>&nbsp;</label>
            <Button class="w-full" label="Search" @click="getList()" />
        </div>
    </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`numberAbbrLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`idLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.log_user_id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`User ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.logs_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.getDateTime(data.log_date_time) }}</span>
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
import UserFilter from '../Filter/UserFilter.vue'

export default {
    data() {
        return {
            currDate    : new Date(),
            totalRecords: 0,
            loading     : false,
            list        : [],
            searchBy    : null,
            searchValue : null,
            disabled    : true,
            searchByOptions: [
                { label: 'User ID', value: 'user_id' },
                { label: 'Name', value: 'filter_user_name' },
                { label: 'Nickname', value: 'filter_user_nickname' },
            ],
            params: {
                orderby             : 'desc',
                user_id      : "",
                // filter_user_nickname: "",
                // filter_start_date   : new Date(),
                // filter_end_date     : new Date(),
                // filter_timezone     : Intl.DateTimeFormat().resolvedOptions().timeZone,
                page         : 1,
                limit        : 10,
            },
            startDate   : new Date(),
            endDate     : new Date()
        }
    },
    watch: {
        searchValue: {
            handler(newValue, oldValue) {
                if(newValue) {
                    this.params[`${this.searchBy}`] = newValue
                }
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        handleDateChange() {
            this.params.page = 1
            this.getList()
        },
        handleSearchBy() {
            this.disabled       = false;
            this.searchValue                = ""
            this.params.user_id      = ""
            this.params.filter_user_name    = ""
            this.params.filter_user_nickname= ""

            this.params[`${this.searchBy}`] = ''
        },
        handlePagination(data) {
            console.log(data);
            this.params.page     = data.page+1;
            this.params.limit    = data.rows;
            this.getList()
        },
        async getList() {
            this.loading = true
            try {
                // this.params.filter_start_date = this.startDate ? `${this.$GF.getDateTime(this.startDate, 'date')} 00:00:00` : null;
                // this.params.filter_end_date = this.endDate ? `${this.$GF.getDateTime(this.endDate, 'date')} 23:59:59` : null;
                const reqParams = {
                    ...this.params,
                    page: String(this.params.page),
                    limit: String(this.params.limit)
                }
                console.log(this.params);
                const res   = await api.getLoginLogs(reqParams)
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
    components: {
        UserFilter
    }
}
</script>