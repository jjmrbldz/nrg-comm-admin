<template>
    <div class="grid p-2">
        <div class="formgrid grid">
            <div class="field col-3">
                <label>{{ $store.getters['languageStore/translate']('statusLang') }}</label>
                <StatusSelect v-model="params.p_status" />
            </div>
            <div class="field col-3">
                <label>{{ $store.getters['languageStore/translate']('mainCategoryLang') }}</label>
                <CategorySelect v-model="p_category" returnValue="id" :single-select="true" />
            </div>
            <div  v-if="false" class="field col-3">
                <label>{{ $store.getters['languageStore/translate']('subcategoryLang') }}</label>
                <SubCategorySelect v-model="filter_subcat_id" returnValue="subcat_id" :single-select="true"  />
            </div>
            <div class="field col-3">
                <label>{{ $store.getters['languageStore/translate']('titleLang') }}</label>
                <InputText type="search" v-model="p_title" class="text-base text-color  p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @keyup.enter="getList()" />
            </div>
        </div>
        <div class="col"></div>
        <Button v-if="false" class="h-3rem my-auto bg-blue-500 text-white border-none outline-none" icon="pi pi-plus" :label="this.$store.getters['languageStore/translate']('New')" @click="newItem()" />
    </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="$store.getters['languageStore/translate']('ID')">
            <template #body="{ data, index }">
                <span>{{ data.event_id }}</span>
            </template>
        </Column>
        <Column field="title" :header="$store.getters['languageStore/translate']('Post')" style="min-width: 100px; max-width: 400px;">
            <template #body="{ data }">
                <div class="mb-1 font-bold">
                    {{ data.title }}
                </div>
                <div class="flex gap-1">
                    <Image :src="`${this.mediaPath}${JSON.parse(data.thumbnail)[0]}`" alt="Image" imageStyle="width: unset; max-height: 34px;" preview />
                    <div class="">
                        <StatusTag :status="data.status" />
                    </div>
                </div>
            </template>
        </Column>
        <Column :header="$store.getters['languageStore/translate']('mainCategoryLang')" style="min-width: 100px; max-width: 300px;">
            <template #body="{ data }">
                <div class="flex gap-1 flex-wrap">
                    <Chip v-for="item in JSON.parse(data.categories)" :label="item.category_name" class="text-xs" />
                </div>
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
                        <i class="mdi mdi-thumb-up mr-2 text-blue-500"></i>
                        <span>{{ data.like_count }}</span>
                    </div>
                    <div class="flex">
                        <i class="mdi mdi-thumb-down mr-2 text-red-500"></i>
                        <span>{{ data.dislike_count ? data.dislike_count : '0' }}</span>
                    </div>
                </div>
            </template>
        </Column>
        <Column :header="$store.getters['languageStore/translate']('Date Added')" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ $GF.getDateTime(data.reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <UpdateItemButton :updateProps="{itemID: data.event_id, getAPI: 'getPost', getParams: 'id', modalHeader: 'View Post', icon: 'mdi mdi-eye', modalType: 'ViewPost', callback: () => getList(), totalItems: totalRecords, width: '50vw'}" />
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

export default {
    data() {
        return {
            mediaPath: import.meta.env.VITE_MEDIA_PATH,
            loading: false,
            list: [],
            params: {
                p_title     : '',
                p_status    : '1',
                p_category  : '',
                orderby     : 'desc',
                page        : 1,
                limit       : 10,
            },
            totalRecords    : 0,
            p_title : '',
            p_category   : '',
            filter_subcat_id: '',
            videoOptions: {
                autoplay: true,
                controls: true,
                sources: [
                    {
                        src:'',
                        type: 'video/mp4'
                    }
                ]
            },
        }
    },
    watch: {
        'params.p_status'() {
            this.p_title = '',
            this.page = 1
            this.getList();
        },
        p_category: {
            handler(newValue, oldValue) {
                this.p_title = '',
                // this.filter_subcat_id = '',
                this.page = 1
                this.getList();
            },
        },
        filter_subcat_id: {
            handler(newValue, oldValue) {
                this.p_title = '',
                this.page = 1
                this.getList();
            },
        }
    },
    mounted() {
        this.getList()
        console.log(this.mediaPath);
    },
    methods: {
        handlePagination(data) {
            console.log(data);
            this.params.page     = data.page+1;
            this.params.limit    = data.rows;
            this.getList()
        },
        newItem(id) {
            this.$dialog.open(this.$modalComponent.AddEditVideo, {
                props: {
                    header: this.$store.getters['languageStore/translate']('Add/Edit Video'),
                    style: {
                        width: '50vw',
                        overflow: 'hidden'
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
            this.list = []
            try {
                this.params.p_title = this.p_title
                this.params.p_category = this.p_category ? `${this.p_category}` : ''
                // this.params.filter_subcat_id = this.filter_subcat_id ? `${this.filter_subcat_id}` : ''

                const reqParams = {
                    ...this.params,
                    page    : String(this.params.page),
                    limit   : String(this.params.limit)
                }

                const res   = await api.getPostList(reqParams)
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
                this.$store.dispatch('listStore/setUploadProgress', null)
            }
        },
    }
}
</script>