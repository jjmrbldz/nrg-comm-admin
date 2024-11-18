<template>
    <div class="grid p-2">
        <div class="formgrid grid">
            <div class="field col-4">
                <label>{{ $store.getters['languageStore/translate']('ID') }}</label>
                <UserSelect v-model="params.user_id" return-value="id" />
            </div>
            <div class="field col-4">
                <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
                <StatusSelect2 v-model="params.status" />
            </div>
            <div class="field col-4">
                <label>{{ $store.getters['languageStore/translate']('Post Type') }}</label>
                <PostTypeSelect v-model="params.post_type" />
            </div>
        </div>
     </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`numberAbbrLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`usernameLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`statusLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <StatusTag2 :status="data.status" />
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Company`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.company }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`typeLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.post_type }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Content`)" style="min-width: 100px">
            <template #body="{ data }">
                <div v-html="data.content"></div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`amountLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span :class="$GF.handleTextColor(data.amount ?? 0)">{{ $GF.formatNumComma(data.amount ?? 0) }}</span>
            </template>
        </Column>
        <Column :header="$store.getters['languageStore/translate']('Statistics')" style="min-width: 100px">
            <template #body="{ data }">
                <div class="">
                    <div class="flex">
                        <i class="mdi mdi-eye mr-2 text-color-secondary"></i>
                        <span>{{ data.view_count }}</span>
                    </div>
                    <div class="flex">
                        <i class="mdi mdi-comment mr-2 text-color-secondary"></i>
                        <span>{{ data.comment_count }}</span>
                    </div>
                </div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateRegisteredLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.getDateTime(data.reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`updatedAtLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.update_datetime ? `${this.$GF.getDateTime(data.update_datetime)}  by  ${data.updated_by_username}` : '-' }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <div v-if="data.status == 0" class="flex gap-2">
                    <UpdateStatusButton :updateProps="{
                            reqParams: {
                                id        : data.id,
                                user_id   : this.$store.state.userStore.id,
                                status    : 1 //1 = Approve | 2 = Reject
                            },
                            updateAPI: 'updatePostChange',
                            severity: 'success',
                            icon: 'mdi mdi-check', 
                            callback: () => getList(), 
                        }" 
                    />
                    <UpdateStatusButton :updateProps="{
                            reqParams: {
                                id        : data.id,
                                user_id   : this.$store.state.userStore.id,
                                status    : 2 //1 = Approve | 2 = Reject
                            },
                            updateAPI: 'updatePostChange',
                            severity: 'danger',
                            icon: 'mdi mdi-close', 
                            callback: () => getList(), 
                        }" 
                    />
                </div>
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
import CategoryFilter from '../Filter/CategoryFilter.vue'

export default {
    data() {
        return {
            totalRecords: 0,
            loading: false,
            list: [],
            params: {
                status      : "", //0, 1, 2
                user_id     : "",
                post_type   : "", //change, trade
                orderby     : 'desc',
                page        : 1,
                limit       : 10
            },
            interval: null,
        }
    },
    watch: {
        'params.user_id'(newValue, oldValue) {
            this.params.page = 1;
            clearTimeout(this.interval)
            this.interval = setTimeout(() => {
                this.getList();
            }, 1000)
        },
        'params.status'(newValue, oldValue) {
            this.params.page = 1;
            clearTimeout(this.interval)
            this.interval = setTimeout(() => {
                this.getList();
            }, 1000)
        },
        'params.post_type'(newValue, oldValue) {
            this.params.page = 1;
            clearTimeout(this.interval)
            this.interval = setTimeout(() => {
                this.getList();
            }, 1000)
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
        newItem(id) {
            this.$dialog.open(this.$modalComponent.AddEditAccredited, {
                props: {
                    header: this.$store.getters['languageStore/translate']('Add/Edit Accredited'),
                    style: {
                        width: '30vw'
                    },
                    modal: true
                },
                onClose: (options) => {
                    this.getList()
                },
            });
        },
        async getList() {
            this.loading = true
            try {

                const reqParams = {
                    ...this.params,
                    user_id     : String(this.params.user_id ?? ''),
                    page        : String(this.params.page),
                    limit       : String(this.params.limit)
                }
                
                const res   = await api.postChangeList(reqParams)
                const code  = parseInt(res.data.code);
                const msg   = res.data.message;
                if(code !== 1) {
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
        CategoryFilter
    }
}
</script>