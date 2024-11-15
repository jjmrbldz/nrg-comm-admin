import { defineAsyncComponent } from 'vue';

const MODAL = {
    AddEditVideo : defineAsyncComponent(() => import('./AddEditVideoModal/AddEditVideoModal.vue')),
    AddEditCategory : defineAsyncComponent(() => import('./AddEditCategoryModal/AddEditCategoryModal.vue')),
    AddEditSubCategory : defineAsyncComponent(() => import('./AddEditSubCategoryModal/AddEditSubCategoryModal.vue')),
    AddEditAdmin : defineAsyncComponent(() => import('./AddEditAdminModal/AddEditAdminModal.vue')),
    AddEditUser : defineAsyncComponent(() => import('./AddEditUserModal/AddEditUserModal.vue')),
    AddEditBanner : defineAsyncComponent(() => import('./AddEditBannerModal/AddEditBannerModal.vue')),
    AddEditTag : defineAsyncComponent(() => import('./AddEditTagModal/AddEditTagModal.vue')),
    AddEditAnnouncement : defineAsyncComponent(() => import('./AddEditAnnouncementModal/AddEditAnnouncementModal.vue')),
    AddEditEvent : defineAsyncComponent(() => import('./AddEditEventModal/AddEditEventModal.vue')),
    AddEditTemplate : defineAsyncComponent(() => import('./AddEditTemplateModal/AddEditTemplateModal.vue')),
    ReplyInquiry : defineAsyncComponent(() => import('./ReplyInquiryModal/ReplyInquiryModal.vue')),
    AddEditPopup : defineAsyncComponent(() => import('./AddEditPopupModal/AddEditPopupModal.vue')),
    ViewPost : defineAsyncComponent(() => import('./ViewPostModal/ViewPostModal.vue')),
    AddEditAccredited : defineAsyncComponent(() => import('./AddEditAccreditedModal/AddEditAccreditedModal.vue')),
}

export default MODAL