<template>
    <div class="formgrid grid">
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('startDateLang') }}</label>
            <Calendar v-model="startDate" placeholder="yyyy-mm-dd" dateFormat="yy-mm-dd" @dateSelect="handleDateChange()" @keyup.enter="handleDateChange()" :maxDate="currDate" showIcon iconDisplay="input" inputId="icondisplay" class="w-full" />
        </div>
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('endDateLang') }}</label>
            <Calendar v-model="endDate" placeholder="yyyy-mm-dd" dateFormat="yy-mm-dd" @dateSelect="handleDateChange()" @keyup.enter="handleDateChange()" :minData="startDate" :maxDate="currDate" showIcon iconDisplay="input" inputId="icondisplay" class="w-full" />
        </div>
        <div class="field col-1">
            <label>{{ $store.getters['languageStore/translate']('searchByLang') }}</label>
            <Dropdown v-model="searchBy" :options="searchByOptions" optionLabel="label" optionValue="value" placeholder="Search by" checkmark :highlightOnSelect="false" class="w-full" @change="handleSearchBy()" />
        </div>
        <div class="field col-2">
            <label>&nbsp;</label>
            <InputText type="search" v-model="searchValue" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="disabled" @keyup.enter="getList()" />
        </div>
        <div class="field col-1">
            <label>&nbsp;</label>
            <Button class="w-full" label="Search" @click="getList()" />
        </div>
    </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`numberAbbrLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.view_id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`idLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.view_user ? data.view_user : '-' }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`titleLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.view_title }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`deviceLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.view_device }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.getDateTime(data.view_datetime) }} / {{ data.view_ip }}</span>
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
                { label: 'User ID', value: 'filter_user_id' },
                { label: 'Video', value: 'filter_video_title' },
                // { label: 'Nickname', value: 'filter_user_nickname' },
            ],
            params: {
                filter_user_id      : "",
                filter_video_title  : "",
                filter_start_date   : new Date(),
                filter_end_date     : new Date(),
                filter_timezone     : Intl.DateTimeFormat().resolvedOptions().timeZone,
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
            this.params.filter_user_id      = ""
            this.params.filter_video_title  = ""

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
                this.params.filter_start_date = this.startDate ? `${this.$GF.getDateTime(this.startDate, 'date')} 00:00:00` : null;
                this.params.filter_end_date = this.endDate ? `${this.$GF.getDateTime(this.endDate, 'date')} 23:59:59` : null;
                console.log(this.params);
                const res   = await api.getViewHistory(this.params)
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