<template>
    <div class="comment">
      <div class="comment-header">
        <img :src="getAvatar(comment.tu_avatar)" alt="avatar" class="avatar" />
        <span class="username">{{ comment.tu_user_id }}</span>
        <span class="timestamp">{{ formatDate(comment.p_reg_datetime) }}</span>
      </div>
      <div class="comment-content">
        {{ comment.p_content }}
      </div>
      <div class="comment-children" v-if="comment.children && comment.children.length">
        <Comment v-for="child in comment.children" :key="child.id" :comment="child" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Comment",
    props: {
      comment: {
        type: Object,
        required: true
      }
    },
    data() {
        return {
            mediaPath: import.meta.env.VITE_MEDIA_PATH,
        }
    },
    methods: {
      formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
      },
      getAvatar(avatarData) {
        try {
          const avatar = JSON.parse(avatarData);
          return `${this.mediaPath}${avatar[0]}`; // assuming first image is avatar
        } catch (error) {
          return 'default-avatar.png'; // fallback avatar
        }
      }
    }
  };
  </script>
  
  <style lang="scss" scoped>
  .comment {
    padding: 10px;
    /* border: 1px solid #ccc; */
    border-radius: 5px;
    margin-bottom: 10px;
  }
  
  .comment-header {
    display: flex;
    align-items: center;
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .username {
    font-weight: bold;
    margin-right: 10px;
  }
  
  .timestamp {
    color: gray;
    font-size: 0.9em;
  }
  
  .comment-children {
    margin-left: 20px;
    margin-top: 10px;
    position: relative;
    &::after {
        content: "";
        position: absolute;
        top: 0;
        left: -6px;
        z-index: 1;
        width: 1px;
        height: 100%;
        background-color: var(--surface-200);
    }
  }
  </style>
  