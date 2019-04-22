import Vue from "vue"
import Utils from "./utils.js";
export default {
    Calendar(params) {
        var p = this;
        p.monthsVM = params.monthsVM
        p.rtl = false;
        // 日期范围
        p.rangeValue = [];
        // 一天的时间戳
        p.oneDayTime = 86400000;
        p.daysDiffer;
        if (params.multiple == true) {
            params.btnShow = true;
        }
        p.defaults = {
            monthNames: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
            monthNamesShort: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
            dayNames: ['日', '一', '二', '三', '四', '五', '六'],
            dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
            firstDay: 0, // First day of the week, Monday
            weekendDays: [0, 6], // Sunday and Saturday
            multiple: false,
            dateFormat: 'yyyy-mm-dd',
            direction: 'horizontal', // or 'vertical'
            minDate: null,
            maxDate: null,
            range: false,
            touchMove: true,
            animate: true,
            closeOnSelect: true,
            yearPicker: true,
            yearPickerTemplate: '<div class="picker-calendar-year-picker" style="display: none;">' +
                '<a href="#" class="link icon-only picker-calendar-prev-year"><i class="icon icon-prev"></i></a>' +
                '<span class="current-year-value bm bm-ac bm-pc"></span>' +
                '<a href="#" class="link icon-only picker-calendar-next-year"><i class="icon icon-next"></i></a>' +
                '</div>',
            weekHeader: true,
            // Common settings
            scrollToInput: true,
            inputReadOnly: true,
            toolbar: true,
            toolbarCloseText: 'Done',
            toolbarTemplate: '<div class="toolbar-inner bm bm-pc bm-f1">' +
                '{{yearPicker}}' +
                '{{monthPicker}}' +
                // '<a href="#" class="link close-picker">{{closeText}}</a>' +
                '</div>',
            /* Callbacks
                onMonthAdd
                onChange
                onOpen
                onClose
                onDayClick
                onMonthYearChangeStart
                onMonthYearChangeEnd
                */
        };
        params = params || {};
        for (var def in p.defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = p.defaults[def];
            }
        }
        p.params = params;
        p.initialized = false;
        // Inline flag
        p.inline = p.params.container ? true : false;
        // Is horizontal
        p.isH = p.params.direction === 'horizontal';
        // RTL inverter
        p.inverter = p.isH ? (p.rtl ? -1 : 1) : 1;
        // Animating flag
        p.animating = false;
        // 根据样式名获取节点
        p.find = function (className) {
            return document.getElementsByClassName(className)
        };
        // 根据eq获取节点
        p.eq = function (arr, index) {
            return arr[index]
        };
        // 设置节点属性
        p.setAttr = function (dom, attrName, attrVal) {
            dom.setAttribute(attrName, attrVal)
        }
        // 循环添加class
        p.classAdd = function (oldClass, newClass) {
            if (oldClass != '') {
                return oldClass + ' ' + newClass
            } else {
                return newClass
            }
        };
        // 日历插件数据初始化
        p.layout = function () {
            var pickerHTML = '';
            var pickerClass = '';
            var i;
            var layoutDate = p.value && p.value.length ? p.value[0] : new Date().setHours(0, 0, 0, 0);
            p.monthHTML({
                layoutDate,
                dir: 'prev',
                init: true
            });
            p.monthHTML({
                layoutDate,
                dir: 'current',
                init: true
            });
            p.monthHTML({
                layoutDate,
                dir: 'next',
                init: true
            });
            var weekHeaderHTML = '';
            if (p.params.weekHeader) {
                for (i = 0; i < 7; i++) {
                    var weekDayIndex = (i + p.params.firstDay > 6) ? (i - 7 + p.params.firstDay) : (i + p.params.firstDay);
                    var dayName = p.params.dayNamesShort[weekDayIndex];
                    weekHeaderHTML += '<div class="picker-calendar-week-day bm bm-ac bm-pc ' + ((p.params.weekendDays.indexOf(weekDayIndex) >= 0) ? 'picker-calendar-week-day-weekend' : '') + '"> ' + dayName + '</div>';

                }
            }
            pickerClass = 'picker-modal bm bm-ver picker-calendar ' + (p.params.cssClass || '');
            var toolbarHTML = p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';
            if (p.params.toolbar) {
                toolbarHTML = p.params.toolbarTemplate
                    .replace(/{{closeText}}/g, p.params.toolbarCloseText)
                    .replace(/{{monthPicker}}/g, (p.params.monthPicker ? p.params.monthPickerTemplate : ''))
                    .replace(/{{yearPicker}}/g, (p.params.yearPicker ? p.params.yearPickerTemplate : ''));
            }
            p.monthsVM.toolbar = toolbarHTML;
            p.monthsVM.weekHeader = weekHeaderHTML;
            // Init events
            p.initCalendarEvents();
        };
        // open打开日历插件
        p.opened = false;
        p.open = function (monthsVM) {
            p.monthsVM = monthsVM;
            var updateValue = false;
            if (!p.opened) {
                if (p.params.costValue == true) {
                    p.params.values = [];
                    p.params.values.push(p.input.parent().getAttribute("value"))
                }
                if (!p.value && p.params.values) {
                    if (p.params.values.length) {
                        p.value = p.params.values;
                        updateValue = true;
                    }
                }
                if (p.params.multiple && p.value) {
                    p.rangeValue = [];
                    if (isNaN(p.value[0])) {
                        p.value[0] = new Date(p.value[0]).getTime()
                    }
                    if (isNaN(p.value[1])) {
                        p.value[1] = new Date(p.value[1]).getTime()
                    }
                    p.daysDiffer = (p.value[1] - p.value[0]) / p.oneDayTime;
                    p.rangeValue.push(p.value[0]);
                    for (var i = 1; i < p.daysDiffer; i++) {
                        var sum = p.value[0] + p.oneDayTime * i;
                        p.rangeValue.push(sum);
                    }
                    p.rangeValue.push(p.value[1]);
                } else {
                    p.rangeValue = [];
                }
                // Append
                if (p.inline) {
                    p.container = $(p.pickerHTML);
                    p.container.addClass('picker-modal-inline');
                    $(p.params.container).append(p.container);
                } else {
                    p.container = p.monthsVM.$refs.monthsIn;
                }
                // Store calendar instance
                p.container.f7Calendar = p;
                p.wrapper = p.monthsVM.$refs.wrapper;
                p.prevWrapper = p.monthsVM.$refs.prevWrapper[0];
                p.currentWrapper = p.monthsVM.$refs.currentWrapper[0];
                p.nextWrapper = p.monthsVM.$refs.nextWrapper[0];
                // Months
                p.months = p.find('picker-calendar-month');
                // Update current month and year
                p.updateCurrentMonthYear();
                // Set initial translate
                p.monthsTranslate = 0;
                p.setMonthsTranslate();
                // 绑定滑动事件
                if (p.params.touchMove) {
                    p.wrapper.addEventListener('touchstart', function (event) {
                        p.monthsVM.handleTouchStart()
                    })
                    p.wrapper.addEventListener('touchmove', function (event) {
                        p.monthsVM.handleTouchMove()
                    })
                    p.wrapper.addEventListener('touchend', function (event) {
                        p.monthsVM.handleTouchEnd()
                    })
                }
                // Update input value
                if (updateValue) p.updateValue(p.rangeValue);
            }
            // Set flag
            p.opened = true;
            p.initialized = true;
            if (p.params.onMonthAdd) {
                p.months.each(function () {
                    p.params.onMonthAdd(p, this);
                });
            }
            if (p.params.onOpen) p.params.onOpen(p);
            p.monthsVM.openClass = 'modal-in'
            p.monthsVM.bgOpen = 'bg-in'
        };
        // close关闭日历插件
        p.monthsVM.calendarClose = function () {
            if (!p.opened || p.inline) return;
            p.monthsVM.openClass = 'modal-out'
            p.monthsVM.bgOpen = 'bg-out'
            return;
        };
        // Format date
        p.formatDate = function (date) {
            date = new Date(date);
            const year = date.getFullYear();
            const month = date.getMonth();
            const month1 = month + 1;
            const day = date.getDate();
            const weekDay = date.getDay();
            return p.params.dateFormat
                .replace(/yyyy/g, year)
                .replace(/yy/g, (year + '').substring(2))
                .replace(/mm/g, month1 < 10 ? '0' + month1 : month1)
                .replace(/m/g, month1)
                .replace(/MM/g, p.params.monthNames[month])
                .replace(/M/g, p.params.monthNamesShort[month])
                .replace(/dd/g, day < 10 ? '0' + day : day)
                .replace(/d/g, day)
                .replace(/DD/g, p.params.dayNames[weekDay])
                .replace(/D/g, p.params.dayNamesShort[weekDay]);
        };
        // Value
        p.addValue = function (value) {
            if (p.params.multiple) {
                if (!p.value) p.value = [];
                if (p.value.length == 2) {
                    p.value = [];
                }
                if (p.value.indexOf(value) >= 0) {
                    p.value[1] = value;
                } else {
                    p.value.push(value);
                }
                p.value.sort(function (a, b) {
                    return a - b
                });
                if (p.value.length == 2) {
                    p.rangeValue = [];
                    p.daysDiffer = (p.value[1] - p.value[0]) / p.oneDayTime;
                    p.rangeValue.push(p.value[0]);
                    for (var i = 1; i < p.daysDiffer; i++) {
                        var sum = p.value[0] + p.oneDayTime * i;
                        p.rangeValue.push(sum);
                    }
                    p.rangeValue.push(p.value[1]);
                } else {
                    p.rangeValue = [];
                    p.rangeValue.push(p.value[0]);
                }
                p.updateValue(p.rangeValue);
            } else {
                p.value = [value];
                p.updateValue();
            }
        };
        p.setValue = function (arrValues) {
            p.value = arrValues;
            p.updateValue();
        };
        let rangeValue = p.rangeValue
        p.updateValue = function (rangeValue) {
            const monthsData = p.monthsVM.monthsData;
            const monthDir = ['prev', 'current', 'next']
            if (p.selectedRefTag && p.selectedRefTag.length > 0) {
                p.selectedRefTag.forEach(function (sArr, sIndex) {
					const dayColsTag = sArr.tag
                    monthDir.forEach(function (dir, dIndex) {
                        monthsData[dir].weekRows.forEach(function (rowArr, row) {
                            if (rowArr[dayColsTag]) {
                                rowArr[dayColsTag].selectedClass = ''
                                rowArr[dayColsTag].dayTextObj['bLastTag'].className = ''
                                const text = p.monthsVM.$refs[dir + dayColsTag + '-b'][0].getAttribute('text')
                                rowArr[dayColsTag].dayTextObj['bLastTag'].text = text
                            }
                        })
                    })
                })
            }
			var i, inputValue;
			const dayCols = p.handleTouchDayCols;
            if (p.params.multiple) {
                if (p.rangeValue.length == 2 && p.rangeValue[0] == p.rangeValue[1]) {
                    var valueDate = new Date(p.rangeValue[1]);
                    var dom = p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]');
                    dom.addClass('picker-calendar-day-selected picker-calendar-day-selectedBig');
                    dom.find("b.lunar").html("同天");
                    dom.find("b.lunar").addClass("rangeEnd");
                    if (p.params.btnShow == false) {
                        setTimeout(function () {
                            if (p.params.closeOnSelect) p.monthsVM.calendarClose();
                        }, 800);
                    }
                } else {
                    if (p.rangeValue.length == 1) {
                        p.selectedRefTag = []
						const dayColsTag = '' + dayCols.dayYear + '-' + dayCols.dayMonth + '-' + dayCols.dayNumber + ''
                        monthDir.forEach(function (dir, dIndex) {
                            monthsData[dir].weekRows.forEach(function (rowArr, row) {
                                if (dayCols.dayDir == dir && rowArr[dayColsTag]) {
                                    p.selectedRefTag.push({
                                        dir: dir,
                                        weekKey: row,
                                        tag: dayColsTag,
                                        bLastTag: rowArr[dayColsTag].dayTextObj['bLastTag']
                                    })
                                    rowArr[dayColsTag].selectedClass = 'picker-calendar-day-selected picker-calendar-day-selectedBig'
                                    rowArr[dayColsTag].dayTextObj['bLastTag'] = {
                                        className: 'rangeStart',
                                        text: '开始'
                                    }
                                }
                            })
                        })
                        p.monthsVM.monthsData = {
                            prev: p.monthsVM.monthsData.prev,
                            current: p.monthsVM.monthsData.current,
                            next: p.monthsVM.monthsData.next
                        }
                    } else {
                        p.selectedRefTag = []
                        p.rangeValue.forEach(function (rVal, rIndex) {
                            rVal = new Date(rVal)
							const dayTag = rVal.getFullYear() + '-' + Number(rVal.getMonth() + 1) + '-' + rVal.getDate()
                            monthDir.forEach(function (dir, dIndex) {
                                monthsData[dir].weekRows.forEach(function (rowArr, row) {
                                    if (rowArr[dayTag]) {
                                        p.selectedRefTag.push({
                                            dir: dir,
                                            weekKey: row,
                                            tag: '' + rowArr[dayTag].dayYear + '-' + rowArr[dayTag].dayMonth + '-' + rowArr[dayTag].dayNumber + '',
                                            bLastTag: rowArr[dayTag].dayTextObj['bLastTag']
                                        })
                                        rowArr[dayTag].selectedClass = 'picker-calendar-day-selected picker-calendar-day-selectedBig'
                                        // 开始
                                        if (rIndex == 0) {
                                            rowArr[dayTag].dayTextObj['bLastTag'] = {
                                                className: 'rangeStart',
                                                text: '开始'
                                            }
                                        }
                                        // 结束
                                        if (p.rangeValue.length > 1 && rIndex == p.rangeValue.length - 1) {
                                            rowArr[dayTag].dayTextObj['bLastTag'] = {
                                                className: 'rangeEnd',
                                                text: '结束'
                                            }
                                        }
                                    }
                                })
                            })
                        })
                    }
                }
            } else {
                dayCols.selectedClass = 'picker-calendar-day-selected picker-calendar-day-selectedBig'
                p.selectedRefTag = [{
                    dir: dayCols.dayDir,
                    weekKey: dayCols.weekKey,
                    tag: '' + dayCols.dayYear + '-' + dayCols.dayMonth + '-' + dayCols.dayNumber + ''
                }];
                monthsData.prev.weekRows.forEach(function (rowArr, row) {
                    if (rowArr[p.selectedRefTag.tag]) {
                        rowArr[p.selectedRefTag.tag].selectedClass = 'picker-calendar-day-selected picker-calendar-day-selectedBig'
                    }
                })
                monthsData.next.weekRows.forEach(function (rowArr, row) {
                    if (rowArr[p.selectedRefTag.tag]) {
                        rowArr[p.selectedRefTag.tag].selectedClass = 'picker-calendar-day-selected picker-calendar-day-selectedBig'
                    }
                })
            }
            if (p.params.btnShow == false) {
                if (p.params.multiple) {
                    if (p.value) {
                        if (p.value.length == 2) {
                            p.monthsVM.calendarOnChange(p, p.value, p.value.map(p.formatDate));
                        }
                    }
                } else {
                    p.monthsVM.calendarOnChange(p, p.value, p.value.map(p.formatDate));
                }
			}
			if (p.handleTouchDayCols.dayDir == 'prev') p.monthsVM.prevMonth();
            if (p.handleTouchDayCols.dayDir == 'next') p.monthsVM.nextMonth();
        };
        // Calendar Methods
        p.daysInMonth = function (date) {
            var d = new Date(date);
            return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        };
        p.monthHTML = function (params) {
            let date = params.layoutDate,
                offset = params.dir,
                init = params.init
            date = new Date(date);
            var year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate();
            if (offset === 'next') {
                if (month === 11) date = new Date(year + 1, 0);
                else date = new Date(year, month + 1, 1);
            }
            if (offset === 'prev') {
                if (month === 0) date = new Date(year - 1, 11);
                else date = new Date(year, month - 1, 1);
            }
            if (offset === 'next' || offset === 'prev') {
                month = date.getMonth();
                year = date.getFullYear();
            }
            var daysInPrevMonth = p.daysInMonth(new Date(date.getFullYear(), date.getMonth()).getTime() - 10 * 24 * 60 * 60 * 1000),
                daysInMonth = p.daysInMonth(date),
                firstDayOfMonthIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
            if (firstDayOfMonthIndex === 0) firstDayOfMonthIndex = 7;
            var dayDate, currentValues = [],
                i, j,
                rows = 6,
                cols = 7,
                monthHTML = '',
                dayIndex = 0 + (p.params.firstDay - 1),
                today = new Date().setHours(0, 0, 0, 0),
                minDate = p.params.minDate ? new Date(p.params.minDate).getTime() : null,
                maxDate = p.params.maxDate ? new Date(p.params.maxDate).getTime() : null;
            if (p.params.multiple) {
                for (i = 0; i < p.rangeValue.length; i++) {
                    currentValues.push(new Date(p.rangeValue[i]).setHours(0, 0, 0, 0));
                }
            } else {
                if (p.value && p.value.length) {
                    for (i = 0; i < p.value.length; i++) {
                        currentValues.push(new Date(p.value[i]).setHours(0, 0, 0, 0));
                    }
                }
            }
            var weekRows = [];
            for (i = 1; i <= rows; i++) {
                var rowHTML = '';
                var row = i;
                var dayCols = {};
                for (j = 1; j <= cols; j++) {
                    var col = j;
                    dayIndex++;
                    var dayNumber = dayIndex - firstDayOfMonthIndex;
                    var addClass = '';
                    var dayDir = '';
                    if (dayNumber < 0) {
                        dayNumber = daysInPrevMonth + dayNumber + 1;
                        dayDir = 'prev';
                        addClass = p.classAdd(addClass, 'picker-calendar-day-prev')
                        dayDate = new Date(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, dayNumber).getTime();
                    } else {
                        dayNumber = dayNumber + 1;
                        if (dayNumber > daysInMonth) {
                            dayNumber = dayNumber - daysInMonth;
                            dayDir = 'next';
                            addClass = p.classAdd(addClass, 'picker-calendar-day-next')
                            dayDate = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? 0 : month + 1, dayNumber).getTime();
                        } else {
                            dayDir = 'current';
                            addClass = p.classAdd(addClass, 'picker-calendar-day-current')
                            dayDate = new Date(year, month, dayNumber).getTime();
                        }
                    }
                    var equalTag = false;
                    if (p.rangeValue.length == 2 && p.rangeValue[0] == p.rangeValue[1] && dayDate == new Date(p.rangeValue[0]).setHours(0, 0, 0, 0)) {
                        equalTag = true
                    }
                    var todayTag = false;
                    // Today
                    if (dayDate === today) {
                        addClass = p.classAdd(addClass, 'picker-calendar-day-today')
                        todayTag = true;
                    }
                    var startDayTag = false;
                    var endDayTag = false;
                    var selectedTag = false;
                    var selectedClass = ''
                    // Selected
                    if (currentValues.indexOf(dayDate) >= 0) {
                        selectedTag = true;
                        selectedClass = 'picker-calendar-day-selected picker-calendar-day-selectedBig' //  picker-calendar-day-selectedBig
                    }
                    // Weekend
                    if (p.params.weekendDays.indexOf(col - 1) >= 0) {
                        addClass = p.classAdd(addClass, 'picker-calendar-day-weekend')
                    }
                    // Disabled
                    var Disabled = false;
                    if ((minDate && dayDate < minDate) || (maxDate && dayDate > maxDate)) {
                        Disabled = true
                        addClass = p.classAdd(addClass, 'picker-calendar-day-disabled')
                    }
                    dayDate = new Date(dayDate);
                    var dayYear = dayDate.getFullYear();
                    var dayMonth = dayDate.getMonth();
                    var LunarCalendar = Utils.getCalendarLunar(dayYear, dayMonth, dayNumber);
                    var dayTextObj = {}
                    if (todayTag === true) {
                        dayTextObj['todayTag'] = {
                            tag: true,
                            text: '今天'
                        }
                    } else {
                        dayTextObj['todayTag'] = {
                            tag: false,
                            text: dayNumber
                        }
                    }
                    if (equalTag == true) {
                        dayTextObj['bLastTag'] = {
                            className: 'rangeStart',
                            text: '同天'
                        }
                    } else {
                        if (startDayTag === true) {
                            dayTextObj['bLastTag'] = {
                                className: 'rangeStart',
                                text: '开始'
                            }
                        } else if (endDayTag === true) {
                            dayTextObj['bLastTag'] = {
                                className: 'rangeEnd',
                                text: '结束'
                            }
                        } else if (selectedTag == true) {
                            dayTextObj['bLastTag'] = {
                                className: '',
                                text: LunarCalendar.text
                            }
                        } else {
                            dayTextObj['bLastTag'] = {
                                className: '',
                                text: LunarCalendar.text
                            }
                        }
                    }
                    dayMonth = Number(dayMonth + 1)
                    dayCols['' + dayYear + '-' + dayMonth + '-' + dayNumber + ''] = {
                        selectedClass,
                        todayTag,
                        equalTag,
                        selectedTag,
                        Disabled,
                        dayDir,
                        dayYear,
                        dayMonth,
                        dayNumber,
                        addClass,
                        LunarCalendar,
                        dayTextObj,
                        startDayTag,
                        endDayTag
                    }
                }
                weekRows.push(dayCols)
            }
            if (init) {
                p.monthsVM.monthsData[offset] = {
                    year,
                    month,
                    weekRows
                }
            } else {
                if (offset === 'prev') {
                    p.monthsVM.monthsData['next'] = p.monthsVM.monthsData['current']
                    p.monthsVM.monthsData['current'] = p.monthsVM.monthsData['prev']
                    p.monthsVM.monthsData['prev'] = {
                        year,
                        month,
                        weekRows
                    }
                }
                if (offset === 'next') {
                    p.monthsVM.monthsData['prev'] = p.monthsVM.monthsData['current']
                    p.monthsVM.monthsData['current'] = p.monthsVM.monthsData['next']
                    p.monthsVM.monthsData['next'] = {
                        year,
                        month,
                        weekRows
                    }
                }
                if (offset === 'current') {
                    p.monthsVM.monthsData[offset] = {
                        year,
                        month,
                        weekRows
                    }
                }
            }
        };
        p.animating = false;
        p.updateCurrentMonthYear = function (dir) {
            let thisWrapper;
            if (typeof dir === 'undefined') {
                thisWrapper = p.currentWrapper
            } else {
                if (dir === 'prev') {
                    thisWrapper = p.prevWrapper
                }
                if (dir === 'next') {
                    thisWrapper = p.nextWrapper
                }
            }
            p.currentMonth = parseInt(thisWrapper.getAttribute('month'), 10);
            p.currentYear = parseInt(thisWrapper.getAttribute('year'), 10);
            p.monthsVM.toolbarYM = '' + p.currentYear + '年 ' + p.params.monthNames[p.currentMonth] + ''
        };
        p.onMonthChangeStart = function (dir) {
            p.updateCurrentMonthYear(dir);
            if (p.params.onMonthYearChangeStart) {
                p.params.onMonthYearChangeStart(p, p.currentYear, p.currentMonth);
            }
        };
        p.onMonthChangeEnd = function (dir, rebuildBoth) {
            p.animating = false;
            var nextMonthHTML, prevMonthHTML, newMonthHTML;
            if (typeof dir === 'undefined') {
                dir = 'next';
                rebuildBoth = true;
            }
            if (!rebuildBoth) {
                p.monthHTML({
                    layoutDate: new Date(p.currentYear, p.currentMonth),
                    dir
                });
            } else {
                p.wrapper.removeChild(p.find('picker-calendar-month-next')[0]);
                p.wrapper.removeChild(p.find('picker-calendar-month-prev')[0]);
                p.monthHTML({
                    layoutDate: new Date(p.currentYear, p.currentMonth),
                    dir: 'prev'
                });
                p.monthHTML({
                    layoutDate: new Date(p.currentYear, p.currentMonth),
                    dir: 'next'
                });
            }
            // p.months = p.find('picker-calendar-month');
            p.setMonthsTranslate(p.monthsTranslate);
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, dir === 'next' ? p.eq(p.months, p.months.length - 1) : p.eq(p.months, 0));
            }
            if (p.params.onMonthYearChangeEnd) {
                p.params.onMonthYearChangeEnd(p, p.currentYear, p.currentMonth);
            }
        };
        p.setMonthsTranslate = function (translate) {
            translate = translate || p.monthsTranslate || 0;
            if (typeof p.monthsTranslate === 'undefined') p.monthsTranslate = translate;
            p.setAttr(p.prevWrapper, 'class', 'picker-calendar-month bm bm-ver')
            p.setAttr(p.currentWrapper, 'class', 'picker-calendar-month bm bm-ver')
            p.setAttr(p.nextWrapper, 'class', 'picker-calendar-month bm bm-ver')
            var prevMonthTranslate = -(translate + 1) * 100 * p.inverter;
            var currentMonthTranslate = -translate * 100 * p.inverter;
            var nextMonthTranslate = -(translate - 1) * 100 * p.inverter;
            // prev
            p.setAttr(p.prevWrapper, 'class', 'picker-calendar-month bm bm-ver picker-calendar-month-prev')
            p.prevWrapper.style.transform = 'translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)'
            // current
            p.setAttr(p.currentWrapper, 'class', 'picker-calendar-month bm bm-ver picker-calendar-month-current')
            p.currentWrapper.style.transform = 'translate3d(' + (p.isH ? currentMonthTranslate : 0) + '%, ' + (p.isH ? 0 : currentMonthTranslate) + '%, 0)'
            // next
            p.setAttr(p.nextWrapper, 'class', 'picker-calendar-month bm bm-ver picker-calendar-month-next')
            p.nextWrapper.style.transform = 'translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)'
        };
        // Columns Handlers
        p.allowItemClick = true
        p.monthsVM.handleTouchStart = function (e) {
            if (p.handleTouchData.isMoved || p.handleTouchData.isTouched) return;
            // e.preventDefault();
            p.handleTouchData.isTouched = true;
            e = window.event;
            p.handleTouchData.touchStartX = p.handleTouchData.touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            p.handleTouchData.touchStartY = p.handleTouchData.touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            p.handleTouchData.touchStartTime = (new Date()).getTime();
            p.handleTouchData.percentage = 0;
            p.allowItemClick = true;
            p.handleTouchData.isScrolling = undefined;
            p.handleTouchData.startTranslate = p.handleTouchData.currentTranslate = p.monthsTranslate;
        }
        p.monthsVM.handleTouchMove = function (e) {
            if (!p.handleTouchData.isTouched) return;
            e = window.event;
            p.handleTouchData.touchCurrentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            p.handleTouchData.touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (typeof p.handleTouchData.isScrolling === 'undefined') {
                p.handleTouchData.isScrolling = !!(p.handleTouchData.isScrolling || Math.abs(p.handleTouchData.touchCurrentY - p.handleTouchData.touchStartY) > Math.abs(p.handleTouchData.touchCurrentX - p.handleTouchData.touchStartX));
            }
            if (p.isH && p.handleTouchData.isScrolling) {
                p.handleTouchData.isTouched = false;
                return;
            }
            e.preventDefault();
            if (p.animating) {
                p.handleTouchData.isTouched = false;
                return;
            }
            p.allowItemClick = false;
            if (!p.handleTouchData.isMoved) {
                // First move
                p.handleTouchData.isMoved = true;
                p.handleTouchData.wrapperWidth = p.wrapper.offsetWidth;
                p.handleTouchData.wrapperHeight = p.wrapper.offsetHeight;
                p.wrapper.style.transition = 0;
            }
            e.preventDefault();
            p.handleTouchData.touchesDiff = p.isH ? p.handleTouchData.touchCurrentX - p.handleTouchData.touchStartX : p.handleTouchData.touchCurrentY - p.handleTouchData.touchStartY;
            p.handleTouchData.percentage = p.handleTouchData.touchesDiff / (p.isH ? p.handleTouchData.wrapperWidth : p.handleTouchData.wrapperHeight);
            p.handleTouchData.currentTranslate = (p.monthsTranslate * p.inverter + p.handleTouchData.percentage) * 100;

            // Transform wrapper
            p.wrapper.style.transform = 'translate3d(' + (p.isH ? p.handleTouchData.currentTranslate : 0) + '%, ' + (p.isH ? 0 : p.handleTouchData.currentTranslate) + '%, 0)';
        }
        p.monthsVM.handleTouchEnd = function (e) {
            if (!p.handleTouchData.isTouched || !p.handleTouchData.isMoved) {
                p.handleTouchData.isTouched = p.handleTouchData.isMoved = false;
                return;
            }
            p.handleTouchData.isTouched = p.handleTouchData.isMoved = false;

            p.handleTouchData.touchEndTime = new Date().getTime();
            if (p.handleTouchData.touchEndTime - p.handleTouchData.touchStartTime < 300) {
                if (Math.abs(p.handleTouchData.touchesDiff) < 10) {
                    p.resetMonth();
                } else if (p.handleTouchData.touchesDiff >= 10) {
                    if (p.rtl) p.monthsVM.nextMonth();
                    else p.monthsVM.prevMonth();
                } else {
                    if (p.rtl) p.monthsVM.prevMonth();
                    else p.monthsVM.nextMonth();
                }
            } else {
                if (p.handleTouchData.percentage <= -0.5) {
                    if (p.rtl) p.monthsVM.prevMonth();
                    else p.monthsVM.nextMonth();
                } else if (p.handleTouchData.percentage >= 0.5) {
                    if (p.rtl) p.monthsVM.nextMonth();
                    else p.monthsVM.prevMonth();
                } else {
                    p.resetMonth();
                }
            }

            // Allow click
            setTimeout(function () {
                p.allowItemClick = true;
            }, 100);
        }
        p.monthsVM.handleDayClick = function (weekKey, dayCols, day) {
            dayCols.weekKey = weekKey
            p.handleTouchDayCols = dayCols
            if (dayCols.selectedTag && !p.params.multiple) return;
            if (dayCols.Disabled) return;
            p.addValue(new Date(dayCols.dayYear, dayCols.dayMonth - 1, dayCols.dayNumber).getTime());
            if (p.params.btnShow == false && p.params.multiple == false) {
                if (p.params.closeOnSelect) p.monthsVM.calendarClose();
            }
        }
        // 新增取消按钮
        p.monthsVM.calendarEmpty = function () {
            p.rangeValue = [];
            p.params.values = [];
            p.value = p.params.value;
            p.updateValue();
            p.monthsVM.calendarOnChange(p, [], []);
        }
        // 新增完成按钮
        p.monthsVM.calendarComplete = function () {
            if (p.params.multiple) {
                if (p.value) {
                    if (p.value.length == 2) {
                        p.monthsVM.calendarOnChange(p, p.value, p.value.map(p.formatDate));
                        p.monthsVM.calendarClose();
                    } else {
                        p.monthsVM.toastText = '请选择结束日期！'
                        p.monthsVM.toastClass = 'toast-in'
                        setTimeout(function () {
                            p.monthsVM.toastClass = 'toast-out'
                        }, 2000);
                    }
                } else {
                    p.monthsVM.calendarOnChange(p, p.value, []);
                    p.monthsVM.calendarClose();
                }
            } else {
                p.monthsVM.calendarOnChange(p, p.value, p.value.map(p.formatDate));
                p.monthsVM.calendarClose();
            }
        }
        p.initCalendarEvents = function () {
            var col;
            var isTouched, isMoved, touchStartX, touchStartY, touchCurrentX, touchCurrentY, touchStartTime, touchEndTime, startTranslate, currentTranslate, wrapperWidth, wrapperHeight, percentage, touchesDiff, isScrolling;
            p.handleTouchData = {
                isTouched,
                isMoved,
                touchStartX,
                touchStartY,
                touchCurrentX,
                touchCurrentY,
                touchStartTime,
                touchEndTime,
                startTranslate,
                currentTranslate,
                wrapperWidth,
                wrapperHeight,
                percentage,
                touchesDiff,
                isScrolling
            }
        };
        p.destroyCalendarEvents = function (colContainer) {
            if ('f7DestroyCalendarEvents' in p.container[0]) p.container[0].f7DestroyCalendarEvents();
        };
        p.monthsVM.nextMonth = function (transition) {
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var nextMonth = parseInt(p.eq(p.months, p.months.length - 1).getAttribute('data-month'), 10);
            var nextYear = parseInt(p.eq(p.months, p.months.length - 1).getAttribute('data-year'), 10);
            var nextDate = new Date(nextYear, nextMonth);
            var nextDateTime = nextDate.getTime();
            var transitionEndCallback = p.animating ? false : true;
            if (p.params.maxDate) {
                if (nextDateTime > new Date(p.params.maxDate).getTime()) {
                    return p.resetMonth();
                }
            }
            p.monthsTranslate--;
            if (nextMonth === p.currentMonth) {
                var nextMonthTranslate = -(p.monthsTranslate) * 100 * p.inverter;
                var nextMonthHTML = $(p.monthHTML(nextDateTime, 'next')).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
                p.wrapper.append(nextMonthHTML[0]);
                p.months = p.wrapper.find('.picker-calendar-month');
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, p.eq(p.months, p.months.length - 1)[0]);
                }
            }
            p.animating = true;
            p.onMonthChangeStart('next');
            var translate = (p.monthsTranslate * 100) * p.inverter;
            p.wrapper.style.transition = transition
            p.wrapper.style.transform = 'translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)'
            if (transitionEndCallback) {
                p.wrapper.addEventListener("webkitTransitionEnd", p.onMonthChangeEnd('next'));
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd('next');
            }
        };
        p.monthsVM.prevMonth = function (transition) {
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var prevMonth = parseInt(p.eq(p.months, 0).getAttribute('data-month'), 10);
            var prevYear = parseInt(p.eq(p.months, 0).getAttribute('data-year'), 10);
            var prevDate = new Date(prevYear, prevMonth + 1, -1);
            var prevDateTime = prevDate.getTime();
            var transitionEndCallback = p.animating ? false : true;
            if (p.params.minDate) {
                if (prevDateTime < new Date(p.params.minDate).getTime()) {
                    return p.resetMonth();
                }
            }
            p.monthsTranslate++;
            if (prevMonth === p.currentMonth) {
                var prevMonthTranslate = -(p.monthsTranslate) * 100 * p.inverter;
                var prevMonthHTML = $(p.monthHTML(prevDateTime, 'prev')).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
                p.wrapper.prepend(prevMonthHTML[0]);
                p.months = p.wrapper.find('.picker-calendar-month');
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, p.eq(p.months, 0)[0]);
                }
            }
            p.animating = true;
            p.onMonthChangeStart('prev');
            var translate = (p.monthsTranslate * 100) * p.inverter;
            p.wrapper.style.transition = transition
            p.wrapper.style.transform = 'translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)'
            if (transitionEndCallback) {
                p.wrapper.addEventListener("webkitTransitionEnd", p.onMonthChangeEnd('prev'));
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd('prev');
            }
        };
        p.resetMonth = function (transition) {
            if (typeof transition === 'undefined') transition = '';
            var translate = (p.monthsTranslate * 100) * p.inverter;
            p.wrapper.style.transition = transition
            p.wrapper.style.transform = 'translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)'
        };
        p.setYearMonth = function (year, month, transition) {
            if (typeof year === 'undefined') year = p.currentYear;
            if (typeof month === 'undefined') month = p.currentMonth;
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var targetDate;
            if (year < p.currentYear) {
                targetDate = new Date(year, month + 1, -1).getTime();
            } else {
                targetDate = new Date(year, month).getTime();
            }
            if (p.params.maxDate && targetDate > new Date(p.params.maxDate).getTime()) {
                return false;
            }
            if (p.params.minDate && targetDate < new Date(p.params.minDate).getTime()) {
                return false;
            }
            var currentDate = new Date(p.currentYear, p.currentMonth).getTime();
            var dir = targetDate > currentDate ? 'next' : 'prev';
            var newMonthHTML = p.monthHTML({
                layoutDate: new Date(year, month),
                dir: 'current'
            });
            p.monthsTranslate = p.monthsTranslate || 0;
            var prevTranslate = p.monthsTranslate;
            var monthTranslate, wrapperTranslate;
            var transitionEndCallback = p.animating ? false : true;
            if (targetDate > currentDate) {
                // To next
                p.monthsTranslate--;
                if (!p.animating) p.eq(p.months, p.months.length - 1).remove();
                p.wrapper.append(newMonthHTML);
                p.months = p.wrapper.find('.picker-calendar-month');
                monthTranslate = -(prevTranslate - 1) * 100 * p.inverter;
                p.eq(p.months, p.months.length - 1).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
            } else {
                // To prev
                p.monthsTranslate++;
                if (!p.animating) p.eq(p.months, 0).remove();
                p.wrapper.prepend(newMonthHTML);
                p.months = p.wrapper.find('.picker-calendar-month');
                monthTranslate = -(prevTranslate + 1) * 100 * p.inverter;
                p.eq(p.months, 0).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
            }
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, dir === 'next' ? p.eq(p.months, p.months.length - 1)[0] : p.eq(p.months, 0)[0]);
            }
            p.animating = true;
            p.onMonthChangeStart(dir);
            wrapperTranslate = (p.monthsTranslate * 100) * p.inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? wrapperTranslate : 0) + '%, ' + (p.isH ? 0 : wrapperTranslate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd(dir, true);
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd(dir);
            }
        };
        p.onPickerClose = function () {
            p.opened = false;
            if (p.input && p.input.length > 0) p.input.parents('.content').css({
                'padding-bottom': ''
            });
            if (p.params.onClose) p.params.onClose(p);
            // Destroy events
            p.destroyCalendarEvents();
        };
        // Layout
        p.layout();
    },
}