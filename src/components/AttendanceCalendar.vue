<template>
  <div class="flex justify-center" v-if="loading"><ProgressSpinner /></div>
  <div v-else>
    <FullCalendar :options="calendarOptions">
      <template #dayCellContent="{ date, dayNumberText }">
        <div class="day-cell-content">
          <p>{{ dayNumberText }}</p>
          <img
            v-if="date <= now"
            :class="`star-attendance ${cellStyleFormatter(date).class}`"
            :src="cellStyleFormatter(date).symbol"
          />
        </div>
      </template>
    </FullCalendar>
    <!-- <TitleComponent class="mt-6" :title="`History ${selectedMonth}`" /> -->
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import star from "@/assets/img/cal/star.webp";
import seventhDay from "@/assets/img/cal/7th.webp";
import thirtyDay from "@/assets/img/cal/30th.webp";
import { api } from '@/axios/api';

export default {
  props: ['userID'],
  components: {
    FullCalendar,
  },
  data: function () {
    return {
      star,
      seventhDay,
      thirtyDay,
      selectedMonth: "",
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: "dayGridMonth",
        weekends: true,
        dayCellContent: this.customDayCellContent,
        datesSet: this.onDatesSet,
        validRange: {
          end: new Date(),
        },
        height: 550,
      },
      now: new Date(),
      dates: [],
      loading: true,
    };
  },
  mounted() {
    var s = setTimeout(() => {
      this.loading = false;
      clearTimeout(s);
    }, [1000]);
    this.getAttendance();
  },
  methods: {
    async getAttendance(month, year) {
      const body = {
        tu_user_id: this.userID,
        month: month || String(moment().format("MM")),
        year: year || String(moment().year()),
      };
      try {
        const { data } = await api.getUserAttendance(body);
        this.dates = data.data;
      } catch (err) {
        console.log(err);
      }
    },
    onDatesSet(data) {
      const date = this.$GF.getMonthWithMostDays(data);
      const formattedDate = moment(date);
      const month = moment(formattedDate).format("MM");
      const year = String(moment(formattedDate).year());
      this.selectedMonth = this.$GF.formatDate(date);
      this.getAttendance(month, year);
    },
    cellStyleFormatter(date) {
      let result = {
        class: "absent",
        symbol: this.star,
      };
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const item = this.dates.find((item) => item.date === formattedDate);

      if (item?.id) {
        result.class = "present";
      }
      if (item?.is_weekly) {
        result.symbol = this.seventhDay;
      }
      if (item?.is_monthly) {
        result.symbol = this.thirtyDay;
      }

      return result;
    },
  },
};
</script>
