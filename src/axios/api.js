import axios from 'axios';
import store from '@/store';
import GF from '@/utils/GlobalFunctions';

export const API_URL = `${import.meta.env.VITE_API_URL}/admin/`; // Replace with your actual API base URL

const axiosInstance = axios.create({
  // timeout: 15000,
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    // 'partnerid': `${ENV.PARTNER_ID}`,
    // 'Access-Control-Allow-Origin' : '*',
    'Authorization': 'Bearer 87ce13ba-ae6b-11ed-afa1-0242ac120002'
    // 'Authorization': store.state.userStore.TOKEN ? `Bearer ${store.state.userStore.TOKEN}` : null
    // 'partnerid': '87ce13ba-ae6b-11ed-afa1-0242ac120002'
    // Add any other headers as needed
  },
});

// Add an interceptor for handling token or other headers

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any logic before sending the request
    // For example, you can attach a token to the headers here
    
	return config;
  },
  (error) => {
    GF.customToast(1, `${error.code}: ${store.getters['languageStore/translate'](error.message) ? store.getters['languageStore/translate'](error.message) : error.message}`)
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Add any logic for handling the response
    // console.log(response.status)
    if (response.data.ecode && response.data.ecode === 510) {
      store.dispatch('logout');
    }
    return response;
  },
  (error) => {
    // Add any logic for handling errors
    console.log('aa');
    GF.customToast(1, `${error.code}: ${store.getters['languageStore/translate'](error.message) ? store.getters['languageStore/translate'](error.message) : error.message}`)
    if (error.config.url === 'token') {
      // GF.customToast(1, `Please login again!`)
      store.dispatch('logout');
    } 

    return Promise.reject(error);
  }
);

export const api = {
  // AUTH
  createKey       : (data)          => axiosInstance.post('createkey', data),
  login           : (data)          => axiosInstance.post('login', data),
  logout          : (data, token)   => axiosInstance.post('logout', data, {headers: {Authorization: `Bearer ${store.state.userStore.TOKEN}`}}),
  register        : (data)          => axiosInstance.post('register', data),
  checkToken      : (data, token)   => axiosInstance.post('checktoken', data),
  
  // DASHBOARD
  getDashboardData: (data)          => axiosInstance.post('summary', data),


  // USER
  addAdmin        : (data)          => axiosInstance.post('createadmin', data),
  userList        : (data)          => axiosInstance.post('userlist', data),
  adminList       : (data)          => axiosInstance.post('adminlist', data),
  getUser         : (data)          => axiosInstance.post('getuser', data),
  getAdmin         : (data)          => axiosInstance.post('getadmin', data),
  updateUser      : (data)          => axiosInstance.post('updateuser', data),
  updateAdmin      : (data)          => axiosInstance.post('updateadmin', data),
  
  // CATEGORIES
  categoryList    : (data)          => axiosInstance.post('categorylist', data),
  getCategory     : (data)          => axiosInstance.post('getcategory', data),
  updateCategory  : (data)          => axiosInstance.post('updatecategory', data),
  addCategory     : (data)          => axiosInstance.post('createcategory', data),
  
  // TAG
  tagList         : (data)          => axiosInstance.post('tagslist', data),
  addTag          : (data)          => axiosInstance.post('addtags', data),
  getTag          : (data)          => axiosInstance.post('gettags', data),
  updateTag       : (data)          => axiosInstance.post('updatetags', data),
  
  // SUB CATEGORIES
  getSubCategoryList : (data)          => axiosInstance.post('subcategorylist', data),
  addSubCategory     : (data)          => axiosInstance.post('addsubcategory', data),
  updateSubCategory  : (data)          => axiosInstance.post('updatesubcategory', data),
  getSubCategory     : (data)          => axiosInstance.post('getsubcategory', data),
  
  // VIDEOS
  deletePost       : (data)        => axiosInstance.post('deleteposts', data),
  getPostList      : (data)        => axiosInstance.post('postlist', data),
  uploadPost       : (data)        => axiosInstance.post('addposts', data, {headers: {"Content-Type": 'multipart/form-data', "Access-Control-Allow-Origin": '*'},
    onUploadProgress: progressEvent => { 
      store.dispatch('listStore/setUploadProgress', Math.round((progressEvent.loaded / progressEvent.total) * 100)); 
    } 
  }),
  getPost          : (data)        => axiosInstance.post('getpost', data, {headers: {"Content-Type": 'multipart/form-data'}}),
  updatePost       : (data)        => axiosInstance.post('updateposts', data, {headers: {"Content-Type": 'multipart/form-data'},
    onUploadProgress: progressEvent => { 
      console.log(Math.round((progressEvent.loaded / progressEvent.total)));
      store.dispatch('listStore/setUploadProgress', Math.round((progressEvent.loaded / progressEvent.total) * 100)); 
    } 
  }),
  
  //BANNER
  addBanner       : (data)         => axiosInstance.post('createbanner', data, {headers: {"Content-Type": 'multipart/form-data'}}),
  updateBanner    : (data)         => axiosInstance.post('updatebanner', data, {headers: {"Content-Type": 'multipart/form-data'}}),
  bannerList      : (data)         => axiosInstance.post('bannerlist', data),
  getBanner       : (data)         => axiosInstance.post('getbanner', data),
  deleteBanner    : (data)         => axiosInstance.post('deletebanner', data),

  //POPUP
  addPopup       : (data)         => axiosInstance.post('createpopup', data, {headers: {"Content-Type": 'multipart/form-data'}}),
  updatePopup    : (data)         => axiosInstance.post('updatepopup', data, {headers: {"Content-Type": 'multipart/form-data'}}),
  popupList      : (data)         => axiosInstance.post('popuplist', data),
  getPopup       : (data)         => axiosInstance.post('getpopup', data),
  deletePopup    : (data)         => axiosInstance.post('deletepopup', data),

  // URL
  getURL    : (data)         => axiosInstance.post('urllist', data),
  updateURL    : (data)         => axiosInstance.post('updateurl', data),
  
  // ANNOUNCEMENT
  getAnnouncementList : (data)      => axiosInstance.post('announcementslist', data),
  deleteAnnouncement     : (data)      => axiosInstance.post('deleteannouncement', data),
  getAnnouncement     : (data)      => axiosInstance.post('getannouncement', data),
  updateAnnouncement  : (data)      => axiosInstance.post('updateannouncement', data, {headers: {"Content-Type": 'multipart/form-data'},
    onUploadProgress: progressEvent => { 
      store.dispatch('listStore/setUploadProgress', Math.round((progressEvent.loaded / progressEvent.total) * 100)); 
    } 
  }),
  addAnnouncement  : (data)      => axiosInstance.post('createannouncements', data, {headers: {"Content-Type": 'multipart/form-data'},
    onUploadProgress: progressEvent => { 
      store.dispatch('listStore/setUploadProgress', Math.round((progressEvent.loaded / progressEvent.total) * 100)); 
    } 
  }),

  // Events
  deleteEvent : (data)      => axiosInstance.post('deleteevent', data),
  getEventsList : (data)      => axiosInstance.post('eventslist', data),
  getEvent     : (data)      => axiosInstance.post('getevent', data),
  updateEvent  : (data)      => axiosInstance.post('updateevent', data, {headers: {"Content-Type": 'multipart/form-data'},
    onUploadProgress: progressEvent => { 
      store.dispatch('listStore/setUploadProgress', Math.round((progressEvent.loaded / progressEvent.total) * 100)); 
    } 
  }),
  addEvent  : (data)      => axiosInstance.post('createevents', data, {headers: {"Content-Type": 'multipart/form-data'},
    onUploadProgress: progressEvent => { 
      store.dispatch('listStore/setUploadProgress', Math.round((progressEvent.loaded / progressEvent.total) * 100)); 
    } 
  }),

  // TEMPLATE
  getTemplateList   : (data)      => axiosInstance.post('replytemplatelist', data),
  getTemplate       : (data)      => axiosInstance.post('getreplytemplate', data),
  addTemplate       : (data)      => axiosInstance.post('addreplytemplate', data, {headers: {"Content-Type": 'multipart/form-data'}}),
  updateTemplate    : (data)      => axiosInstance.post('updatereplytemplate', data, {headers: {"Content-Type": 'multipart/form-data'}}),
  
  // INQUIRY
  getInquiryList    : (data)      => axiosInstance.post('iniquirylist', data),
  getInquiry        : (data)      => axiosInstance.post('getinquiry', data),
  sendInquiry       : (data)      => axiosInstance.post('sendinquiry', data),
  replyInquiry      : (data)      => axiosInstance.post('replyinquiry', data),


  // LOGS
  getLoginLogs      : (data)       => axiosInstance.post('loginlist', data),
  getViewHistory    : (data)       => axiosInstance.post('viewhistory', data),
  getCommentList    : (data)       => axiosInstance.post('commentlist', data),
  deleteComment     : (data)       => axiosInstance.post('admindeletecomment', data),

  // POINTS
  getPointSettings    : (data)       => axiosInstance.post('getpointsettings', data),
  updatePointSettings : (data)       => axiosInstance.post('updatepointsettings', data),

  // ACCREDITED
  accreditedList    : (data)          => axiosInstance.post('accreditedlist', data),
  getAccredited     : (data)          => axiosInstance.post('getaccredited', data),
  updateAccredited  : (data)          => axiosInstance.post('updateaccredited', data),
  addAccredited     : (data)          => axiosInstance.post('createaccredited', data),
  deleteAccredited     : (data)          => axiosInstance.post('deleteaccredited', data),

  // POST CHANGE
  postChangeList    : (data)          => axiosInstance.post('postchangelist', data),
  getPostChange     : (data)          => axiosInstance.post('getpostchange', data),
  updatePostChange  : (data)          => axiosInstance.post('updatepostchange', data),
};
