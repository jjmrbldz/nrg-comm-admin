<template>
    <DataTable v-model:expandedRows="expandedRows" :value="list" class="mt-4" dataKey="idx" stripedRows :loading="loading">
        <Column expander style="width: 5rem" />
        <Column :header="this.$store.getters['languageStore/translate'](`numberAbbrLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.idx }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`nicknameLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.user_nickname }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`contentLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.content }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`statusLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <StatusTag :status="data.status" />
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.getDateTime(data.reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <DeleteItemButton class="ml-2" :updateProps="{
                        params: {
                            id      : data.idx,
                            tp_id   : data.tp_id,
                            type    : 'comment',
                        },
                        api: 'deleteComment',
                        icon: 'mdi mdi-trash-can', 
                        callback: () => getList(), 
                        totalItems: totalRecords
                    }" 
                />
            </template>
        </Column>
        <template #expansion="slotProps">
            <div class="p-3">
                <h5 class="mt-0">Replies</h5>
                <DataTable v-model:expandedRows="expandedRowsReply" :value="slotProps.data.replies" dataKey="reply_id" >
                    <Column expander style="width: 5rem" />
                    <Column field="reply_id" :header="$store.getters['languageStore/translate'](`numberAbbrLang`)" ></Column>
                    <Column field="user_nickname" :header="$store.getters['languageStore/translate'](`nicknameLang`)" ></Column>
                    <Column field="content" :header="$store.getters['languageStore/translate'](`contentLang`)" ></Column>
                    <Column :header="$store.getters['languageStore/translate'](`dateLang`)">
                        <template #body="slotProps">
                            {{ this.$GF.getDateTime(slotProps.data.reg_datetime) }}
                        </template>
                    </Column>
                    <Column :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
                        <template #body="slotProps">
                            <DeleteItemButton class="ml-2" :updateProps="{
                                    params: {
                                        tp_id   : slotProps.data.tp_id,
                                        id      : slotProps.data.reply_id,
                                        type    : 'reply',
                                    },
                                    api: 'deleteComment',
                                    icon: 'mdi mdi-trash-can', 
                                    callback: () => getList(), 
                                    totalItems: totalRecords
                                }" 
                            />
                        </template>
                    </Column>
                    <template #expansion="slotProps">
                        <div class="p-3">
                            <h5 class="mt-0">More Replies</h5>
                            <DataTable :value="slotProps.data.replies" >
                                <Column field="reply_id" :header="$store.getters['languageStore/translate'](`numberAbbrLang`)" ></Column>
                                <Column field="user_nickname" :header="$store.getters['languageStore/translate'](`nicknameLang`)" ></Column>
                                <Column field="content" :header="$store.getters['languageStore/translate'](`contentLang`)" ></Column>
                                <Column :header="$store.getters['languageStore/translate'](`dateLang`)">
                                    <template #body="slotProps">
                                        {{ this.$GF.getDateTime(slotProps.data.reg_datetime) }}
                                    </template>
                                </Column>
                                <Column :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
                                    <template #body="slotProps">
                                        <DeleteItemButton class="ml-2" :updateProps="{
                                                params: {
                                                    tp_id   : slotProps.data.tp_id,
                                                    id      : slotProps.data.reply_id,
                                                    type    : 'reply',
                                                },
                                                api: 'deleteComment',
                                                icon: 'mdi mdi-trash-can', 
                                                callback: () => getList(), 
                                                totalItems: totalRecords
                                            }" 
                                        />
                                    </template>
                                </Column>
                                <template #empty> <div class="text-center text-red-500"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
                            </DataTable>
                        </div>
                    </template>
                    <template #empty> <div class="text-center text-red-500"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
                </DataTable>
            </div>
        </template>
        <template #empty> <div class="text-center text-red-500"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
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
                vid_id  : null,
                page    : 1,
                limit   : 999
            },
            expandedRows: {},
            expandedRowsReply: {}
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
        newItem(id) {
            this.$dialog.open(this.$modalComponent.AddEditCategory, {
                props: {
                    header: this.$store.getters['languageStore/translate']('Add/Edit Category'),
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
                
                const res   = await api.getCommentList(this.params)
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
        CategoryFilter
    }
}
</script>