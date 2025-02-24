<template>
    <div class="b-card">
      <div class="b-card-header">
        <div class="b-letter b-bg">B</div>
        <div class="b-letter i-bg">i</div>
        <div class="b-letter n-bg">n</div>
        <div class="b-letter g-bg">g</div>
        <div class="b-letter o-bg">o</div>
      </div>
      <div class="separator"></div>
      <div class="b-card-body">
        <div
          :class="{ 'b-body-no': true, 'no-active': cardItem.is_match != 0 }"
          v-for="cardItem in item"
        >
          <img v-if="cardItem.number == 'FREE'" class="center-star" :src="star" />
          <span v-else>{{ cardItem.number }}</span>
        </div>
      </div>
    </div>
  </template>
  <script> 
  import star from "@/assets/img/cal/star.webp";
  export default {
    props: {
      item: Array,
    },
    data() {
      return {
        star,
      };
    },
  };
  </script>
  