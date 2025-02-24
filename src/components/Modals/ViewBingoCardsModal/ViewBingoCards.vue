<template>
    <div class="b-cards mt-5">
        <BingoCard :item="items" />
    </div>
</template>

<script>
import { api } from '@/axios/api';
import BingoCard from '@/components/BingoCard.vue';


export default {
    inject: ['dialogRef'],
    data() {
        return {
            items    : this.dialogRef.data ? JSON.parse(this.dialogRef.data.items) : null,
        }
    },
    mounted() {
        console.log('ITEMS',this.items)
    },
    components: {
        BingoCard
    },
}
</script>