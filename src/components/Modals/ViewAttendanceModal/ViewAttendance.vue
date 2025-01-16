<template>
    <AttendanceCalendar :user-ID="userID"  />
</template>

<script>
import AttendanceCalendar from '@/components/AttendanceCalendar.vue';


export default {
    inject: ['dialogRef'],
    data() {
        return {
            userID    : this.dialogRef.data ? this.dialogRef.data.userID : null,
        }
    },
    components: {
        AttendanceCalendar
    }
}
</script>