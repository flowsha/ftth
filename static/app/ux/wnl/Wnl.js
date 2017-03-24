/**
 * File: app/ux/wnl/Wnl.js
 * Author: liusha
 */
 
Ext.define('xdfn.ux.wnl.Wnl', {
    extend: 'Ext.container.Container',
    alias: 'widget.wnl',
    
    layout: {
        type: 'fit'
    },
    initComponent: function() {
    	var me = this;
    	me.html = '<div id="cal"><div id="top">公元&nbsp;<select></select>&nbsp;年&nbsp;<select></select>&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;农历<span></span>年&nbsp;[&nbsp;<span></span>年&nbsp;]<input type="button" value="今天" title="点击后跳转回今天" style="padding:0px"></div><ul id="wk"><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li><b>六</b></li><li><b>日</b></li></ul><div id="cm"></div><div id="bm"><a target="_blank" onMouseDown="return c({"fm":"alop","title":this.innerHTML,"url":this.href,"p1":al_c(this),"p2":1})" href="javascript:void(0)">历史上的今天</a></div></div>',
    	me.callParent(arguments);
    	me.listeners = {
        	'afterrender': function(self, eOpts) {
        		me.createWnl();
        	},
        	'resize': function(self, adjWidth, adjHeight, eOpts) {
        		if (me.O != undefined) {
        			me.O.draw(me.I);
        		}
        	}
        }
    },
    
    createWnl: function() {
    	var me = this;
    	var T = navigator.userAgent.indexOf("MSIE") != -1 && !window.opera;
		function N(C) {
			return document.getElementById(C)
		}
		function S(C) {
			return document.createElement(C)
		}
    	var Q = [19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632,
				21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450,
				38320, 84343, 18800, 42160, 46261, 27216, 27968, 109396, 11104,
				38256, 21234, 18800, 25958, 54432, 59984, 28309, 23248, 11104,
				100067, 37600, 116951, 51536, 54432, 120998, 46416, 22176, 107956,
				9680, 37584, 53938, 43344, 46423, 27808, 46416, 86869, 19872,
				42416, 83315, 21168, 43432, 59728, 27296, 44710, 43856, 19296,
				43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925,
				19152, 42192, 54484, 53840, 54616, 46400, 46752, 103846, 38320,
				18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256,
				19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613,
				37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680,
				37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416,
				86390, 21168, 43312, 31060, 27296, 44368, 23378, 19296, 42726,
				42208, 53856, 60005, 54576, 23200, 30371, 38608, 19415, 19152,
				42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864,
				42359, 42160, 43600, 111189, 27936, 44448, 84835];
		var K = "甲乙丙丁戊己庚辛壬癸";
		var J = "子丑寅卯辰巳午未申酉戌亥";
		var P = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
		var L = ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种",
				"夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪",
				"大雪", "冬至"];
		var B = [0, 21208, 43467, 63836, 85337, 107014, 128867, 150921, 173149,
				195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350,
				375494, 397447, 419210, 440795, 462224, 483532, 504758];
		var A = "日一二三四五六七八九十";
		var F = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "腊"];
		var D = "初十廿卅";
		var W = {
			"0101" : "*1元旦节",
			"0214" : "情人节",
			"0305" : "学雷锋纪念日",
			"0308" : "妇女节",
			"0312" : "植树节",
			"0315" : "消费者权益日",
			"0401" : "愚人节",
			"0501" : "*1劳动节",
			"0504" : "青年节",
			"0601" : "国际儿童节",
			"0701" : "中国共产党诞辰",
			"0801" : "建军节",
			"0910" : "中国教师节",
			"1001" : "*3国庆节",
			"1224" : "平安夜",
			"1225" : "圣诞节"
		};
		var U = {
			"0101" : "*2春节",
			"0115" : "元宵节",
			"0505" : "*1端午节",
			"0815" : "*1中秋节",
			"0909" : "重阳节",
			"1208" : "腊八节",
			"0100" : "除夕"
		};
		function V(Z) {
			function d(k, j) {
				var i = new Date((31556925974.7 * (k - 1900) + B[j] * 60000)
						+ Date.UTC(1900, 0, 6, 2, 5));
				return (i.getUTCDate())
			}
			function e(l) {
				var j, k = 348;
				for (j = 32768; j > 8; j >>= 1) {
					k += (Q[l - 1900] & j) ? 1 : 0
				}
				return (k + c(l))
			}
			function b(i) {
				return (K.charAt(i % 10) + J.charAt(i % 12))
			}
			function c(i) {
				if (h(i)) {
					return ((Q[i - 1900] & 65536) ? 30 : 29)
				} else {
					return (0)
				}
			}
			function h(i) {
				return (Q[i - 1900] & 15)
			}
			function f(j, i) {
				return ((Q[j - 1900] & (65536 >> i)) ? 30 : 29)
			}
			function C(n) {
				var l, k = 0, j = 0;
				var m = new Date(1900, 0, 31);
				var o = (n - m) / 86400000;
				this.dayCyl = o + 40;
				this.monCyl = 14;
				for (l = 1900; l < 2050 && o > 0; l++) {
					j = e(l);
					o -= j;
					this.monCyl += 12
				}
				if (o < 0) {
					o += j;
					l--;
					this.monCyl -= 12
				}
				this.year = l;
				this.yearCyl = l - 1864;
				k = h(l);
				this.isLeap = false;
				for (l = 1; l < 13 && o > 0; l++) {
					if (k > 0 && l == (k + 1) && this.isLeap == false) {
						--l;
						this.isLeap = true;
						j = c(this.year)
					} else {
						j = f(this.year, l)
					}
					if (this.isLeap == true && l == (k + 1)) {
						this.isLeap = false
					}
					o -= j;
					if (this.isLeap == false) {
						this.monCyl++
					}
				}
				if (o == 0 && k > 0 && l == k + 1) {
					if (this.isLeap) {
						this.isLeap = false
					} else {
						this.isLeap = true;
						--l;
						--this.monCyl
					}
				}
				if (o < 0) {
					o += j;
					--l;
					--this.monCyl
				}
				this.month = l;
				this.day = o + 1
			}
			function G(i) {
				return i < 10 ? "0" + i : i
			}
			function g(j, k) {
				var i = j;
				return k.replace(/dd?d?d?|MM?M?M?|yy?y?y?/g, function(l) {
							switch (l) {
								case "yyyy" :
									var m = "000" + i.getFullYear();
									return m.substring(m.length - 4);
								case "dd" :
									return G(i.getDate());
								case "d" :
									return i.getDate().toString();
								case "MM" :
									return G((i.getMonth() + 1));
								case "M" :
									return i.getMonth() + 1
							}
						})
			}
			function a(j, i) {
				var k;
				switch (j, i) {
					case 10 :
						k = "初十";
						break;
					case 20 :
						k = "二十";
						break;
					case 30 :
						k = "三十";
						break;
					default :
						k = D.charAt(Math.floor(i / 10));
						k += A.charAt(i % 10)
				}
				return (k)
			}
			this.date = Z;
			this.isToday = false;
			this.isRestDay = false;
			this.solarYear = g(Z, "yyyy");
			this.solarMonth = g(Z, "M");
			this.solarDate = g(Z, "d");
			this.solarWeekDay = Z.getDay();
			this.solarWeekDayInChinese = "星期" + A.charAt(this.solarWeekDay);
			var Y = new C(Z);
			this.lunarYear = Y.year;
			this.shengxiao = P.charAt((this.lunarYear - 4) % 12);
			this.lunarMonth = Y.month;
			this.lunarIsLeapMonth = Y.isLeap;
			this.lunarMonthInChinese = this.lunarIsLeapMonth
					? "闰" + F[Y.month - 1]
					: F[Y.month - 1];
			this.lunarDate = Y.day;
			this.showInLunar = this.lunarDateInChinese = a(this.lunarMonth,
					this.lunarDate);
			if (this.lunarDate == 1) {
				this.showInLunar = this.lunarMonthInChinese + "月"
			}
			this.ganzhiYear = b(Y.yearCyl);
			this.ganzhiMonth = b(Y.monCyl);
			this.ganzhiDate = b(Y.dayCyl++);
			this.jieqi = "";
			this.restDays = 0;
			if (d(this.solarYear, (this.solarMonth - 1) * 2) == g(Z, "d")) {
				this.showInLunar = this.jieqi = L[(this.solarMonth - 1) * 2]
			}
			if (d(this.solarYear, (this.solarMonth - 1) * 2 + 1) == g(Z, "d")) {
				this.showInLunar = this.jieqi = L[(this.solarMonth - 1) * 2 + 1]
			}
			if (this.showInLunar == "清明") {
				this.showInLunar = "清明节";
				this.restDays = 1
			}
			this.solarFestival = W[g(Z, "MM") + g(Z, "dd")];
			if (typeof this.solarFestival == "undefined") {
				this.solarFestival = ""
			} else {
				if (/\*(\d)/.test(this.solarFestival)) {
					this.restDays = parseInt(RegExp.$1);
					this.solarFestival = this.solarFestival.replace(/\*\d/, "")
				}
			}
			this.showInLunar = (this.solarFestival == "")
					? this.showInLunar
					: this.solarFestival;
			this.lunarFestival = U[this.lunarIsLeapMonth
					? "00"
					: G(this.lunarMonth) + G(this.lunarDate)];
			if (typeof this.lunarFestival == "undefined") {
				this.lunarFestival = ""
			} else {
				if (/\*(\d)/.test(this.lunarFestival)) {
					this.restDays = (this.restDays > parseInt(RegExp.$1))
							? this.restDays
							: parseInt(RegExp.$1);
					this.lunarFestival = this.lunarFestival.replace(/\*\d/, "")
				}
			}
			if (this.lunarMonth == 12 && this.lunarDate == f(this.lunarYear, 12)) {
				this.lunarFestival = U["0100"];
				this.restDays = 1
			}
			this.showInLunar = (this.lunarFestival == "")
					? this.showInLunar
					: this.lunarFestival;
			this.showInLunar = (this.showInLunar.length > 4) ? this.showInLunar
					.substr(0, 2)
					+ "..." : this.showInLunar
		}
		var R = (function() {
			var Y = {};
			Y.lines = 0;
			Y.dateArray = new Array(42);
			function Z(b) {
				return (((b % 4 === 0) && (b % 100 !== 0)) || (b % 400 === 0))
			}
			function G(b, c) {
				return [31, (Z(b) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30,
						31][c]
			}
			function C(b, c) {
				b.setDate(b.getDate() + c);
				return b
			}
			function a(b) {
				var g = 0;
				var d = new V(new Date(b.solarYear, b.solarMonth - 1, 1));
				var e = (d.solarWeekDay - 1 == -1) ? 6 : d.solarWeekDay - 1;
				Y.lines = Math.ceil((e + G(b.solarYear, b.solarMonth - 1)) / 7);
				for (var f = 0; f < Y.dateArray.length; f++) {
					if (d.restDays != 0) {
						g = d.restDays
					}
					if (g > 0) {
						d.isRest = true
					}
					if (e-- > 0 || d.solarMonth != b.solarMonth) {
						Y.dateArray[f] = null;
						continue
					}
					var c = new V(new Date());
					if (d.solarYear == c.solarYear && d.solarMonth == c.solarMonth
							&& d.solarDate == c.solarDate) {
						d.isToday = true
					}
					Y.dateArray[f] = d;
					d = new V(C(d.date, 1));
					g--
				}
			}
			return {
				init : function(b) {
					a(b)
				},
				getJson : function() {
					return Y
				}
			}
		})();
		var X = (function() {
			var C = N("top").getElementsByTagName("SELECT")[0];
			var Y = N("top").getElementsByTagName("SELECT")[1];
			var G = N("top").getElementsByTagName("SPAN")[0];
			var d = N("top").getElementsByTagName("SPAN")[1];
			var Z = N("top").getElementsByTagName("INPUT")[0];
			function b(h) {
				G.innerHTML = h.ganzhiYear;
				d.innerHTML = h.shengxiao
			}
			function c(h) {
				C[h.solarYear - 1901].selected = true;
				Y[h.solarMonth - 1].selected = true
			}
			function g() {
				var k = C.value;
				var h = Y.value;
				var j = new V(new Date(k, h - 1, 1));
				R.init(j);
				O.draw();
				if (this == C) {
					j = new V(new Date(k, 3, 1));
					G.innerHTML = j.ganzhiYear;
					d.innerHTML = j.shengxiao
				}
				var i = new V(new Date());
				Z.style.visibility = (k == i.solarYear && h == i.solarMonth)
						? "hidden"
						: "visible"
			}
			function a() {
				var h = new V(new Date());
				b(h);
				c(h);
				R.init(h);
				O.draw();
				Z.style.visibility = "hidden"
			}
			function e(l, h) {
				for (var k = 1901; k < 2050; k++) {
					var j = S("OPTION");
					j.value = k;
					j.innerHTML = k;
					if (k == l) {
						j.selected = "selected"
					}
					C.appendChild(j)
				}
				for (var k = 1; k < 13; k++) {
					var j = S("OPTION");
					j.value = k;
					j.innerHTML = k;
					if (k == h) {
						j.selected = "selected"
					}
					Y.appendChild(j)
				}
				C.onchange = g;
				Y.onchange = g
			}
			function f(h) {
				e(h.solarYear, h.solarMonth);
				G.innerHTML = h.ganzhiYear;
				d.innerHTML = h.shengxiao;
				Z.onclick = a;
				var i = new V(new Date());
				Z.style.visibility = (h.solarYear === i.solarYear
						&& h.solarMonth === i.solarMonth && h.solarDate === i.solarDate)
						? "hidden"
						: "visible"
			}
			return {
				init : function(h) {
					f(h)
				},
				reset : function(h) {
					c(h)
				}
			}
		})();
		var O = (function() {
			function C(e) {
				var a = R.getJson();
				var d = a.dateArray;
				N("cm").style.height = a.lines * 38 + 2 + "px";
				N("cm").innerHTML = "";
				for (var b = 0; b < d.length; b++) {
					var i = 0;
					if (d[b] == null) {
						i++;
						continue
					}
					var Y = S("DIV");
					if (e) {
						if (e.solarDate === d[b].solarDate) {
							Y.style.cssText = "border:1px solid #a5b9da;background:#c1d9ff"
						}
					} else {
						if (d[b].isToday) {
							Y.style.cssText = "border:1px solid #a5b9da;background:#c1d9ff"
						}
					}
					Y.className = "cell";
					var wk = Ext.query("#wk li:first-child");
					var w = Ext.get(wk[0]).getWidth();
					Y.style.width = w;
					Y.style.left = (b % 7) * w + "px";
					Y.style.top = Math.floor(b / 7) * 38 + 2 + "px";
					var c = S("DIV");
					c.className = "so";
					c.style.color = ((b % 7) > 4 || d[b].isRest)
							? "#c60b02"
							: "#313131";
					c.innerHTML = d[b].solarDate;
					Y.appendChild(c);
					var Z = S("DIV");
					Z.style.color = "#666";
					Z.innerHTML = d[b].showInLunar;
					Y.appendChild(Z);
					Y.onmouseover = (function(f) {
						return function(g) {
							E.show({
										dateIndex : f,
										cell : this
									})
						}
					})(b);
					Y.onmouseout = function() {
						E.hide()
					};
					N("cm").appendChild(Y)
				}
				var G = S("DIV");
				G.id = "fd";
				N("cm").appendChild(G);
				E.init(G)
			}
			return {
				draw : function(G) {
					C(G)
				}
			}
		})();
		var E = (function() {
			var C;
			function Z(f, d) {
				if (arguments.length > 1) {
					var c = /([.*+?^=!:${}()|[\]\/\\])/g, a = "{"
							.replace(c, "\\$1"), e = "}".replace(c, "\\$1");
					var b = new RegExp("#" + a + "([^" + a + e + "]+)" + e, "g");
					if (typeof(d) == "object") {
						return f.replace(b, function(g, i) {
									var h = d[i];
									return typeof(h) == "undefined" ? "" : h
								})
					}
				}
				return f
			}
			function G(c) {
				var b = R.getJson().dateArray[c.dateIndex];
				var a = c.cell;
				var d = "#{solarYear}&nbsp;年&nbsp;#{solarMonth}&nbsp;月&nbsp;#{solarDate}&nbsp;日&nbsp;#{solarWeekDayInChinese}";
				d += "<br><b>农历&nbsp;#{lunarMonthInChinese}月#{lunarDateInChinese}</b>";
				d += "<br>#{ganzhiYear}年&nbsp;#{ganzhiMonth}月&nbsp;#{ganzhiDate}日";
				if (b.solarFestival != "" || b.lunarFestival != "" || b.jieqi != "") {
					d += "<br><b>#{lunarFestival} #{solarFestival} #{jieqi}</b>"
				}
				C.innerHTML = Z(d, b);
				C.style.top = a.offsetTop + a.offsetHeight - 5 + "px";
				C.style.left = a.offsetLeft + a.offsetWidth - 5 + "px";
				C.style.display = "block";
			}
			function Y() {
				C.style.display = "none"
			}
			return {
				show : function(a) {
					G(a)
				},
				hide : function() {
					Y()
				},
				init : function(a) {
					C = a
				}
			}
		})();
		var H = (function() {
			var G = N("bm").getElementsByTagName("A")[0];
			function C(Y) {
				G.href = "http://baike.baidu.com/list-php/dispose/searchword.php?word="
						+ Y.solarMonth + "%D4%C2" + Y.solarDate + "%C8%D5&pic=1"
			}
			return {
				setLink : function(Y) {
					C(Y)
				}
			}
		})();
		var M = new V(new Date());
		var I = (function() {
			if (window.op_calendar && window.op_calendar.year
					&& window.op_calendar.month && window.op_calendar.day) {
				var C = new Date([window.op_calendar.year,
						window.op_calendar.month, window.op_calendar.day].join("/"));
				if ((C.toString().toLowerCase() !== "invalid date")
						&& (Object.prototype.toString.apply(C).toLowerCase() === "[object date]")) {
					return new V(C)
				} else {
					return M
				}
			} else {
				return M
			}
		})();
		X.init(I);
		if (T && window.attachEvent) {
			window.attachEvent("onload", function() {
						X.reset(I)
					})
		}
		R.init(I);
		O.draw(I);
		H.setLink(M)
		me.O = O;
		me.I = I;
    }
});