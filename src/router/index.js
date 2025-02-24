import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import store from '@/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      meta: {
        title: 'Dashboard',
        requiresAuth: true,
      },
      component: () => import('@/views/DashboardView.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: 'Login',
      },
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/posts',
      name: 'posts',
      meta: {
        title: 'Posts List',
        requiresAuth: true,
      },
      component: () => import('@/views/PostListView.vue')
    },
    {
      path: '/category',
      name: 'category',
      meta: {
        title: 'Category List',
        requiresAuth: true,
      },
      component: () => import('@/views/CategoryListView.vue')
    },
    {
      path: '/subcategory',
      name: 'subcategory',
      meta: {
        title: 'Sub-Category List',
        requiresAuth: true,
      },
      component: () => import('@/views/SubCategoryListView.vue')
    },
    {
      path: '/tag',
      name: 'tag',
      meta: {
        title: 'Tag List',
        requiresAuth: true,
      },
      component: () => import('@/views/TagListView.vue')
    },
    {
      path: '/user',
      name: 'user',
      meta: {
        title: 'User List',
        requiresAuth: true,
      },
      component: () => import('@/views/UserListView.vue')
    },
    {
      path: '/user/bingolist',
      name: 'bingolist',
      meta: {
        title: 'Bingo List',
        requiresAuth: true,
      },
      component: () => import('@/views/BingoListView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      meta: {
        title: 'Admin List',
        requiresAuth: true,
      },
      component: () => import('@/views/AdminListView.vue')
    },
    {
      path: '/logslist',
      name: 'logslist',
      meta: {
        title: 'Logs List',
        requiresAuth: true,
      },
      component: () => import('@/views/LogsListView.vue')
    },
    {
      path: '/viewhistory',
      name: 'viewhistory',
      meta: {
        title: 'View History',
        requiresAuth: true,
      },
      component: () => import('@/views/ViewHistoryView.vue')
    },
    {
      path: '/banner/:addModal?',
      name: 'banner',
      meta: {
        title: 'Banner List',
        requiresAuth: true,
      },
      component: () => import('@/views/BannerListView.vue')
    },
    {
      path: '/popup',
      name: 'popup',
      meta: {
        title: 'Popup List',
        requiresAuth: true,
      },
      component: () => import('@/views/PopupListView.vue')
    },
    {
      path: '/announcement',
      name: 'announcement',
      meta: {
        title: 'Announcement List',
        requiresAuth: true,
      },
      component: () => import('@/views/AnnouncementListView.vue')
    },
    {
      path: '/event',
      name: 'event',
      meta: {
        title: 'Event List',
        requiresAuth: true,
      },
      component: () => import('@/views/EventListView.vue')
    },
    {
      path: '/comments',
      name: 'comments',
      meta: {
        title: 'Comment List',
        requiresAuth: true,
      },
      component: () => import('@/views/CommentListView.vue')
    },
    {
      path: '/template',
      name: 'template',
      meta: {
        title: 'Template List',
        requiresAuth: true,
      },
      component: () => import('@/views/TemplateListView.vue')
    },
    {
      path: '/inquiry',
      name: 'inquiry',
      meta: {
        title: 'Inquiry List',
        requiresAuth: true,
      },
      component: () => import('@/views/InquiryListView.vue')
    },
    {
      path: '/testupload',
      name: 'testupload',
      meta: {
        title: 'Test Upload',
        requiresAuth: true,
      },
      component: () => import('@/views/TestUploadView.vue')
    },
    {
      path: '/forwardurl',
      name: 'forwardurl',
      meta: {
        title: 'Forward URL',
        requiresAuth: true,
      },
      component: () => import('@/views/ForwardURLView.vue')
    },
    {
      path: '/pointsettings',
      name: 'pointsettings',
      meta: {
        title: 'Point Settings',
        requiresAuth: true,
      },
      component: () => import('@/views/PoinSettingsView.vue')
    },
    {
      path: '/postchange',
      name: 'postchange',
      meta: {
        title: 'Post Change',
        requiresAuth: true,
      },
      component: () => import('@/views/PostChangeView.vue')
    },
    {
      path: '/posttrade',
      name: 'posttrade',
      meta: {
        title: 'Post Trade',
        requiresAuth: true,
      },
      component: () => import('@/views/PostTradeView.vue')
    },
    {
      path: '/delaysettings',
      name: 'delaysettings',
      meta: {
        title: 'Delay Settings',
        requiresAuth: true,
      },
      component: () => import('@/views/DelaySettngsView.vue')
    },
    {
      path: '/roulette',
      name: 'roulette',
      meta: {
        title: 'Roulette List',
        requiresAuth: true,
      },
      component: () => import('@/views/RouletteListView.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
	if(to.path != '/login'){
		store.dispatch('userStore/checkToken');
	}
	if (to.path === '/login' && store.getters['userStore/isLoggedIn']) {
		next('/');
	} else if (to.meta.requiresAuth && !store.getters['userStore/isLoggedIn']) {
		next('/login');
		GF.customToast(0, store.getters['languageStore/translate']('Please login first!'));
	} else {
		next();
	}
});

export default router
