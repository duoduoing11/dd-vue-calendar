<template>
	<calendar class="calendar bm bm-f1" v-on:change="calendarChange" :multiple="true"></calendar>
</template>


<script>
export default {
	name: "app",
	methods: {
		calendarChange(p, values, displayValues) {
			console.log("日历返回值：", p, values, displayValues)
		}
	}
};
</script>

<style lang="stylus">
.calendar{
	width 100%
	.inputDate{
		height 45px
		border 1px solid #333333
		margin 20px
	}
}
</style>
