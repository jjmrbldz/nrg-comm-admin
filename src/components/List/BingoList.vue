<template>
    <BingoFilter v-model="params" :get-list="getList" />
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`usernameLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.tu_user_id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`statusLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <Tag v-if="data.status === 0" severity="warning" :value="$store.getters['languageStore/translate']('In Progress')"></Tag>
                <Tag v-else-if="data.status === 1" severity="success" :value="$store.getters['languageStore/translate']('Finished')"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateRegisteredLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.getDateTime(data.reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <ViewBingoCardsButton icon="mdi mdi-grid" :username="data.tu_user_id" :items="data.binggo_cards" />
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
import BingoFilter from '../Filter/BingoFilter.vue';
import ViewBingoCardsButton from '../Button/ViewBingoCardsButton.vue';

export default {
    data() {
        return {
            totalRecords: 0,
            loading: false,
            list: [],
            params: {
                username    : '',
                status      : '',
                orderby     : 'desc',
                page        : 1,
                limit       : 10,
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
        async getList() {
            this.loading = true
            try {
                const reqParams = {
                    ...this.params,
                    page: String(this.params.page),
                    limit: String(this.params.limit),
                }
                const res   = await api.getBingoCards(reqParams)
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
        BingoFilter,
        ViewBingoCardsButton,
    }
}
</script>