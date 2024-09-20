<template>
    <div class="comment-section">
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <!-- Render the comment -->
        <Comment :comment="comment" />
      </div>
    </div>
  </template>
  
  <script>
  import Comment from './Comment.vue';
  
  export default {
    name: "CommentSection",
    components: {
      Comment
    },
    props: ['comments'],
  };
  </script>
  
  <style>
  .comment-section {
    max-width: 600px;
    /* margin: 0 auto; */
    padding: 20px;
  }
  
  .comment {
    margin-bottom: 20px;
  }
  </style>
  