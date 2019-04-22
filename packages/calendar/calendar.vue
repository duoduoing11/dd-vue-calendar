<template>
	<div>
		<div class="bm bm-ac bm-pc bm-f1 inputDate selectedDate"
		     @click="calendarOpen()">
			<span>{{calendarVal}}</span>
		</div>
		<div ref="monthsIn"
		     class="picker-modal bm bm-ver picker-calendar remove-on-close"
		     :class="openClass">
			<div class="toolbar bm bm-ac">
				<div class="toolbar-inner bm bm-pc bm-f1">
					<div class="picker-calendar-year-picker"
					     style="display: none;">
						<div class="link icon-only picker-calendar-prev-year">
							<i class="icon icon-prev"></i>
						</div>
						<span class="current-year-value bm bm-ac bm-pc"></span>
						<div class="link icon-only picker-calendar-next-year">
							<i class="icon icon-next"></i>
						</div>
					</div>
					<div class="calendarBtn bm bm-ac bm-pc bm-f1 calendarClose"
					     v-if="calendarInitParams.params.btnShow"
					     @click="calendarEmpty($event)">清空</div>
					<div class="picker-calendar-month-picker bm">
						<div class="link icon-only picker-calendar-prev-month bm bm-ac bm-pc"
						     @click="prevMonth($event)">
							<i class="icon icon-prev"></i>
						</div>
						<div ref="currentMonthValue"
						     class="current-month-value bm bm-ac bm-pc"
						     v-text="toolbarYM"></div>
						<div class="link icon-only picker-calendar-next-month bm bm-ac bm-pc"
						     @click="nextMonth($event)">
							<i class="icon icon-next"></i>
						</div>
					</div>
					<div class="calendarBtn bm bm-ac bm-pc bm-f1 calendarComplete"
					     v-if="calendarInitParams.params.btnShow"
					     @click="calendarComplete($event)">完成</div>
				</div>
			</div>
			<div class="picker-modal-inner bm bm-ver">
				<div class="picker-calendar-week-days bm bm-ac"
				     v-html="weekHeader"></div>
				<div class="picker-calendar-months bm">
					<div ref="wrapper"
					     class="picker-calendar-months-wrapper bm">
						<div :ref="monthKey+'Wrapper'"
						     class="picker-calendar-month bm bm-ver"
						     :class="'picker-calendar-month-'+monthKey"
						     :year="thisMonth.year"
						     :month="thisMonth.month"
						     :key="monthKey"
						     v-for="(thisMonth, monthKey) in monthsData">
							<div class="picker-calendar-row bm"
							     :key="weekKey"
							     v-for="(weekRows, weekKey) in thisMonth.weekRows">
								<div :ref="monthKey+dayCols.dayYear+dayCols.dayMonth+dayCols.dayNumber"
								     :year="dayCols.dayYear"
								     :month="dayCols.dayMonth"
								     :day="dayCols.dayNumber"
								     :date="dayCols.dayYear+'-'+dayCols.dayMonth+'-'+dayCols.dayNumber"
								     class="picker-calendar-day bm bm-ac bm-pc"
								     :class="dayCols.addClass+' '+dayCols.selectedClass+' '+dayCols.dayTextObj.bLastTag.className"
								     :key="dayKey"
								     v-for="(dayCols, dayKey) in weekRows"
								     @click="handleDayClick(weekKey, dayCols, $event)">
									<span class="bm bm-ac bm-pc bm-ver"
									      v-if="dayCols.todayTag">
										<b class="bm bm-ac bm-pc number today"
										   :class="dayCols.LunarCalendar.class">{{dayCols.dayTextObj.todayTag.text}}</b>
										<b :ref="monthKey+dayCols.dayYear+'-'+dayCols.dayMonth+'-'+dayCols.dayNumber+'-b'"
										   class="bm bm-ac bm-pc lunar today tag"
										   :class="dayCols.dayTextObj.bLastTag.className+' '+dayCols.LunarCalendar.class"
										   :text="dayCols.LunarCalendar.text">{{dayCols.dayTextObj.bLastTag.text}}</b>
									</span>
									<span class="bm bm-ac bm-pc bm-ver"
									      v-else>
										<b class="bm bm-ac bm-pc number"
										   :class="dayCols.LunarCalendar.class">{{dayCols.dayTextObj.todayTag.text}}</b>
										<b :ref="monthKey+dayCols.dayYear+'-'+dayCols.dayMonth+'-'+dayCols.dayNumber+'-b'"
										   class="bm bm-ac bm-pc lunar tag"
										   :class="dayCols.dayTextObj.bLastTag.className+' '+dayCols.LunarCalendar.class"
										   :text="dayCols.LunarCalendar.text">{{dayCols.dayTextObj.bLastTag.text}}</b>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="backdropBg"
		     :class="bgOpen"
		     @click="calendarClose()"
		     style="background-color: rgba(0, 0, 0, 0.2);"></div>
		<div class="calendar-toast"
		     :class="toastClass">
			{{toastText}}
		</div>
		<slot></slot>
	</div>
</template>
<script>
import calendarInit from "./calendar.js";
export default {
	name: "calendar",
	props: ["multiple"],
	data() {
		return {
			openClass: "modal-out",
			bgOpen: "bg-out",
			toastClass: "toast-out",
			toastText: "",
			calendarVal: "请选择日期",
			toolbarYM: "",
			weekHeader: "",
			monthsData: {}
		};
	},
	created() {
		this.calendarInitParams = new calendarInit.Calendar({
			multiple: this.multiple,
			monthsVM: this,
			btnShow: false
		});
	},
	methods: {
		calendarOpen() {
			this.calendarInitParams.open(this);
		},
		calendarOnChange(p, values, displayValues) {
			let calendarVal = "";
			displayValues.map(function(val, num) {
				calendarVal = calendarVal + val;
			});
			this.calendarVal = calendarVal == "" ? "请选择日期" : calendarVal;
			this.$emit("change", p, values, displayValues);
		}
	}
};
</script>

<style scoped lang="stylus">
@import 'css/boxModel.css'
@import 'css/calendar_Sm.css'
@import 'css/calendar_Helper.css'
.backdropBg {
	position fixed
	z-index 1001
	top 0
	right 0
	bottom 0
	left 0
	width 100%
	height 100%
}
.backdropBg.bg-out {
	display none
}
.backdropBg.bg-in {
	display block
}
.calendar-toast {
	position fixed
	top 50%
	left 50%
	display -webkit-box
	display -webkit-flex
	display flex
	color #fff
	max-width 70%
	font-size 14px
	line-height 20px
	border-radius 4px
	word-break break-all
	-webkit-box-align center
	-webkit-align-items center
	align-items center
	-webkit-box-orient vertical
	-webkit-box-direction normal
	-webkit-flex-direction column
	flex-direction column
	-webkit-box-pack center
	-webkit-justify-content center
	justify-content center
	box-sizing content-box
	-webkit-transform translate3d(-50%, -50%, 0)
	transform translate3d(-50%, -50%, 0)
	background-color rgba(50, 50, 51, 0.88)
	width -webkit-fit-content
	width fit-content
	padding 8px 12px
	min-width 96px
	z-index 20001
}
.calendar-toast.toast-in {
	display block
}
.calendar-toast.toast-out {
	display none
}
</style>
