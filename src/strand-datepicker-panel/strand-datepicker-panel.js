/**
 * @license
 * Copyright (c) 2015 MediaMath Inc. All rights reserved.
 * This code may only be used under the BSD style license found at http://mediamath.github.io/strand/LICENSE.txt

*/
(function (scope) {

	var DataUtils = StrandLib.DataUtils;
	var BehaviorUtils = StrandLib.BehaviorUtils;

	scope.DatepickerPanel = Polymer({
		is: 'strand-datepicker-panel',

		properties: {
			// Configuration
			label: {
				type: String,
				value: 'start'
			},
			userEnabledLabel: {
				type: String,
				value: null
			},
			enabled: {
				type: Boolean,
				value: true
			},
			userEnabled: {
				type: Boolean,
				value: true
			},
			useTime: {
				type: Boolean,
				value: true
			},

			// Formatting
			dateFormat: {
				type: String,
				value: 'MM/DD/YYYY'
			},
			timeFormat: {
				type: String
			},

			// Values
			value: { // datetime as unix timestamp
				type: Number,
				value: null,
				notify: true,
				observer: '_valueChanged'
			},
			date: {
				type: Object,
				value: null,
				notify: true,
				observer: '_dateChanged',
			},
			dateString: { // Date as string
				type: String,
				value: null,
				notify: true,
				observer: '_dateStringChanged'
			},

			time: { // Seconds since midnight
				type: Number,
				notify: true,
				observer: '_timeChanged'
			},
			timeString: {
				type: String,
				notify: true
			},
			timePeriod: {
				type: String,
				notify: true
			},

			// Pass through for strand-calendar
			pairDate: {
				type: Object,
				notify: true
			},
			disablePast: {
				type: Object,
				notify: true
			},
			disableFuture: {
				type: Object,
				notify: true
			}
		},

		behaviors: [
			StrandTraits.Resolvable,
			StrandTraits.Falsifiable,
			StrandTraits.Refable
		],

		_dateChanged: function(newDate, oldDate) {
			if(DataUtils.isDef(newDate)) {
				var wrappedNew = moment(newDate);
				var wrappedOld = moment(oldDate);

				if(!wrappedNew.isSame(wrappedOld)) {
					var dateOnly = wrappedNew.startOf('day');
					this.dateString = dateOnly.format(this.dateFormat).toString();
					this.value = dateOnly.unix() + this.time;
				}
			}
		},

		_dateStringChanged: function(newDate, oldDate) {
			if(DataUtils.isDef(newDate) && newDate !== oldDate) {
				var wrappedNew = moment(newDate, this.dateFormat, true);
				var wrappedOld = moment(oldDate, this.dateFormat, true);

				// Wait until date is valid before doing anything
				if(wrappedNew.isValid()) {
					// Update String format if not consistent with this.dateFormat
					var formatted = wrappedNew.format(this.dateFormat).toString();
					if(newDate !== formatted) {
						this.dateString = formatted;
					}
					// Don't do anything if the date didn't actually change
					else if(!wrappedNew.isSame(wrappedOld)) {
						var dateOnly = wrappedNew.startOf('day');
						this.date = dateOnly.toDate();
						this.value = dateOnly.unix() + this.time;
					}
				}
			}
		},

		_valueChanged: function(newValue, oldValue) {
			if(DataUtils.isDef(newValue) && newValue !== oldValue) {
				var wrappedUnix = moment.unix(newValue);
				// dateString change handler will change Date object
				this.dateString = wrappedUnix.format(this.dateFormat).toString();
				// get seconds since midnight
				var startOfDay = wrappedUnix.clone().startOf('day');
				this.time = wrappedUnix.diff(startOfDay, 'seconds');
			}
		},

		_timeChanged: function(newTime, oldTime) {
			if(newTime && newTime !== oldTime) {
				var dateOnly = moment.unix(this.value).startOf('day');
				this.value = dateOnly.unix() + newTime;
			}
		},

	});

})(window.Strand = window.Strand || {});
