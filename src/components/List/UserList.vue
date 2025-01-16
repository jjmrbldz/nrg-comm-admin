<template>
    <UserFilter2 v-model="params" :get-list="getList" />
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`idLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.tu_user_id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`nicknameLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.tu_nickname }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`statusLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <StatusTag :status="data.tu_status" />
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateRegisteredLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.getDateTime(data.tu_reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`lastLoginLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ `${this.$GF.getDateTime(data.tu_session_datetime)} / ${data.tu_last_ip}` }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <UpdateItemButton class="mr-2" :updateProps="{itemID: data.id, getAPI: 'getUser', getParams: 'id', modalHeader: 'Add/Edit User', icon: 'mdi mdi-account-edit', modalType: 'AddEditUser', callback: () => getList()}" />
                <ViewAttendanceButton icon="mdi mdi-calendar-check" :username="data.tu_user_id" :user-ID="data.id" />
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
import ViewAttendanceButton from '../Button/ViewAttendanceButton.vue';

export default {
    data() {
        return {
            totalRecords: 0,
            loading: false,
            list: [],
            params: {
                tu_user_id  : '',
                tu_status   : '',
                orderby     : 'desc',
                page         : 1,
                limit        : 10,
            }
        }
    },
    watch: {
        params: {
            handler(newValue, oldValue) {
                this.getList();
            },
            deep: true,
        }
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
        editVideo(id) {
            this.$dialog.open(this.$modalComponent.AddEditVideo, {
                props: {
                    header: 'Add/Edit Video',
                    style: {
                        width: '30vw'
                    },
                    breakpoints: {
                        // '960px': '75vw',
                        // '640px': '90vw'
                    },
                    modal: true,
                },
                data: {
                    id       : id,
                    update   : true
                },
                onClose: (options) => {
                    console.log(options);
                    this.getList()
                }
            });
        },
        async getList() {
            this.loading = true
            try {
                const reqParams = {
                    ...this.params,
                    page: String(this.params.page),
                    limit: String(this.params.limit),
                }
                const res   = await api.userList(reqParams)
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
        UserFilter,
        ViewAttendanceButton,
    }
}
</script>