
<template>
    <div class="sidebar card flex justify-content-center fixed m-2">
        <Menu :model="items" class="w-full md:w-15rem sidemenu">
            <template #submenuheader="{ item }">
                <span class="text-primary font-bold">{{ $store.getters['languageStore/translate'](item.label) }}</span>
            </template>
            <template #item="{ item, props }">
                <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" class="flex align-items-center relative">
                    <a v-ripple :href="href" v-bind="props.action" class="relative w-full" @click="navigate">
                        <span :class="item.icon" />
                        <span class="ml-2">{{ $store.getters['languageStore/translate'](item.label) }}</span>
                    </a>
                </RouterLink>
                <a v-ripple v-else class="flex align-items-center relative" v-bind="props.action">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ $store.getters['languageStore/translate'](item.label) }}</span>
                    <Badge v-if="item.badge" class="ml-auto bg-red-500 text-white"  :value="item.badge" />
                </a>
            </template>
            <!-- <template #end>
                <button v-ripple class="relative overflow-hidden w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround">
                    <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="mr-2" shape="circle" />
                    <span class="inline-flex flex-column">
                        <span class="font-bold">Amy Elsner</span>
                        <span class="text-sm">Admin</span>
                    </span>
                </button>
            </template> -->
        </Menu>
    </div>
</template>

<style lang="scss" scoped>
.router-link-active {
    border-radius: 4px;
    background-color: var(--primary-color); 
    .p-menuitem-link{

        color: var(--primary-color-text) !important;
    }
}
.sidemenu {
   
    overflow-x: scroll;
}
</style>

<script>
import { reactive } from 'vue';
import { RouterLink } from 'vue-router';
import { mapState } from 'vuex';

export default {
    data() {
        return {
            items: []
        };
    },
    // computed: {
    //     ...mapState('languageStore', ['lang'])
    // },
    // watch: {
    //     lang(newValue, oldValue) {
    //         this.handleSideBarLang();
    //     }
    // },
    mounted() {
        this.handleSideBarLang()
    },
    methods: {
        handleSideBarLang() {
            this.items = [
                {
                    label: 'Posts',
                    items: [
                        // {
                        //     label: 'New',
                        //     icon: 'pi pi-plus',
                        //     command: () => {
                        //         this.$dialog.open(this.$modalComponent.AddEditVideo, {
                        //             props: {
                        //                 header: this.$store.getters['languageStore/translate']('Add/Edit Video'),
                        //                 style: {
                        //                     width: '50vw',
                        //                     overflow: 'hidden'
                        //                 },
                        //                 breakpoints: {
                        //                     // '960px': '75vw',
                        //                     // '640px': '90vw'
                        //                 },
                        //                 modal: true
                        //             },
                        //         });
                        //     }
                        // },
                        {
                            label: 'Posts List',
                            icon: 'pi pi-play',
                            route: '/posts'
                        }
                    ]
                },
                {
                    separator: true
                },
                {
                    label: 'Categories',
                    items: [
                        // {
                        //     label: 'New',
                        //     icon: 'pi pi-plus',
                        //     command: () => {
                                
                        //     }
                        // },
                        {
                            label: 'Category List',
                            icon: 'pi pi-list',
                            route: '/category'
                        },
                        // {
                        //     label: 'Subcategory List',
                        //     icon: 'mdi mdi-format-list-text',
                        //     route: '/subcategory'
                        // },
                        // {
                        //     label: 'Tag List',
                        //     icon: 'mdi mdi-tag-outline',
                        //     route: '/tag'
                        // }
                    ]
                },
                {
                    separator: true
                },
                {
                    label: 'Users',
                    items: [
                        {
                            label: 'New Admin',
                            icon: 'pi pi-plus',
                            command: () => {
                                this.$dialog.open(this.$modalComponent.AddEditAdmin, {
                                    props: {
                                        header: this.$store.getters['languageStore/translate']('New Admin'),
                                        style: {
                                            width: '30vw'
                                        },
                                        breakpoints: {
                                            // '960px': '75vw',
                                            // '640px': '90vw'
                                        },
                                        modal: true
                                    },
                                    onClose: (options) => {
                                        console.log(options);
                                        this.$store.dispatch('listStore/getAdminList', this.$store.state.listStore.adminListParams)
                                    }
                                });
                            }
                        },
                        {
                            label: 'User List',
                            icon: 'pi pi-users',
                            route: '/user'
                        },
                        {
                            label: 'Admin List',
                            icon: 'mdi mdi-shield-account',
                            route: '/admin'
                        },
                        // {
                        //     label: 'Online Users',
                        //     icon: 'pi pi-user',
                        //     badge: 2
                        // },
                    ]
                },
                {
                    separator: true
                },
                {
                    label: 'contentManagementLang',
                    items: [
                        // {
                        //     label: 'Popup',
                        //     icon: 'pi pi-external-link',
                        // },
                        {
                            label: 'newBanner',
                            icon: 'pi pi-plus',
                            command: () => {
                                this.$router.push({path:"/banner", query:{addModal:true}})
                                this.$dialog.open(this.$modalComponent.AddEditBanner, {
                                    props: {
                                        header: this.$store.getters['languageStore/translate']('Add/Edit Banner'),
                                        style: {
                                            width: '30vw'
                                        },
                                        breakpoints: {
                                            // '960px': '75vw',
                                            // '640px': '90vw'
                                        },
                                        modal: true
                                    },
                                });
                            }
                        },
                        {
                            label: 'Banner',
                            icon: 'pi pi-images',
                            route: '/banner'
                            // badge: 2
                        },
                        {
                            label: 'Popup',
                            icon: 'mdi mdi-open-in-new',
                            route: '/Popup'
                            // badge: 2
                        },
                        {
                            label: 'Announcement',
                            icon: 'mdi mdi-bullhorn-outline',
                            route: '/announcement'
                            // badge: 2
                        },
                        {
                            label: 'Event',
                            icon: 'mdi mdi-bullhorn-outline',
                            route: '/event'
                            // badge: 2
                        },
                        // {
                        //     label: 'Template',
                        //     icon: 'mdi mdi-file-document-multiple-outline',
                        //     route: '/template'
                        //     // badge: 2
                        // },
                        {
                            label: 'Inquiry',
                            icon: 'mdi mdi mdi-headset',
                            route: '/inquiry'
                            // badge: 2
                        },
                        // {
                        //     label: 'Forward URL',
                        //     icon: 'mdi mdi-link-edit',
                        //     route: '/forwardurl'
                        //     // badge: 2
                        // },
                    ]
                },
                {
                    separator: true
                },
                {
                    label: 'Logs',
                    items: [
                        {
                            label: 'Login Logs',
                            icon: 'mdi mdi-clipboard-list-outline',
                            route: '/logslist'
                            // badge: 2
                        },
                        // {
                        //     label: 'View History',
                        //     icon: 'mdi mdi-eye-refresh',
                        //     route: '/viewhistory'
                        //     // badge: 2
                        // },
                        // {
                        //     label: 'Comment List',
                        //     icon: 'mdi mdi-comment',
                        //     route: '/comments'
                        //     // badge: 2
                        // },
                    ]
                },
                {
                    label: 'Settings',
                    items: [
                        {
                            label: 'Point Settings',
                            icon: 'mdi mdi-hexagram',
                            route: '/pointsettings'
                            // badge: 2
                        },
                        {
                            label: 'Post Change',
                            icon: 'mdi mdi-note-edit',
                            route: '/postchange'
                            // badge: 2
                        },
                        {
                            label: 'Delay Settings',
                            icon: 'mdi mdi-history',
                            route: '/delaysettings'
                            // badge: 2
                        },
                        // {
                        //     label: 'Post Trade',
                        //     icon: 'mdi mdi-note-edit-outline',
                        //     route: '/posttrade'
                        //     // badge: 2
                        // },
                        // {
                        //     label: 'View History',
                        //     icon: 'mdi mdi-eye-refresh',
                        //     route: '/viewhistory'
                        //     // badge: 2
                        // },
                        // {
                        //     label: 'Comment List',
                        //     icon: 'mdi mdi-comment',
                        //     route: '/comments'
                        //     // badge: 2
                        // },
                    ]
                },
                // {
                //     separator: true
                // },
            ]
        }
    },
};
</script>
