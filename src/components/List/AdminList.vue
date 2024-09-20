<template>
    <UserFilter v-model="$store.state.listStore.adminListParams" />
    <DataTable :value="$store.state.listStore.adminList" scrollable class="mt-4" stripedRows paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown" :loading="$store.state.listStore.listLoading">
        <Column :header="this.$store.getters['languageStore/translate'](`idLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.tp_user_id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`nicknameLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.tp_nickname }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`statusLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <StatusTag :status="data.tp_status" />
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateRegisteredLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.getDateTime(data.tp_reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`lastLoginLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ `${this.$GF.getDateTime(data.tp_session_datetime)} / ${data.tp_last_ip}` }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <UpdateItemButton :updateProps="{itemID: data.id, getAPI: 'getAdmin', getParams: 'id', modalHeader: 'Add/Edit Admin', icon: 'mdi mdi-account-edit', modalType: 'AddEditAdmin', callback: () => getList()}" />
            </template>
        </Column>
        
        <template #empty> <div class="text-center text-danger"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
    </DataTable>
    <Paginator
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        :rows="getAdminListParams.limit"
        :totalRecords="adminListTotalItems"
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
import UpdateItemButton from '../Button/UpdateItemButton.vue'
import { mapGetters, mapState } from 'vuex';

export default {
    data() {
        return {
            loading: false,
            list: [],
            // params: {
            //     filter_user_id      : '',
            //     filter_user_name    : '',
            //     filter_user_nickname: '',
            // }
        }
    },
    computed: {  
        ...mapGetters('listStore', ['getAdminListParams']),
        ...mapGetters('listStore', ['getAdminListTotalItems']),
        ...mapState('listStore', ['adminListTotalItems']),
    },
    watch: {
        getAdminListParams: {
            handler(newValue, oldValue) {
                this.getList();
            },
            deep: true,
        },
        // params: {
        //     handler(newValue, oldValue) {
        //         this.getList();
        //     },
        //     deep: true,
        // }
    },
    mounted() {
        console.log(this.getAdminListParams);
        console.log('Total Page:',this.getAdminListTotalItems);
        console.log('Total Page:',this.adminListTotalItems);
        this.getList()
    },
    methods: {
        async getList() {
            this.$store.dispatch('listStore/getAdminList', this.getAdminListParams)
            // this.$store.dispatch('listStore/getAdminList', this.$store.state.listStore.adminListParams)
        },
        handlePagination(data) {
            console.log(data);
            this.$store.dispatch('listStore/setAdminListParams', ['page', data.page+1])
            this.$store.dispatch('listStore/setAdminListParams', ['limit', data.rows])
            this.getList()
        }
    },
    components: {
        UserFilter,
        UpdateItemButton
    }
}
</script>