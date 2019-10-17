'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _control = require('./control');

var _chart_manager = require('./chart_manager');

var _chart_settings = require('./chart_settings');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Kline = function () {
    function Kline(option) {
        _classCallCheck(this, Kline);

        this.element = "#kline_container";
        this.chartMgr = null;
        this.timer = null;
        this.buttonDown = false;
        this.init = false;
        this.requestParam = "";
        this.isSized = false;
        this.data = {};
        this.width = 1200;
        this.height = 650;
        this.symbol = "";
        this.symbolName = "";
        this.range = null;
        this.url = "";
        this.limit = 1000;
        this.intervalTime = 5000;
        this.debug = true;
        this.language = "zh-cn";
        this.theme = "dark";
        this.ranges = ["1w", "1d", "1h", "30m", "15m", "5m", "1m", "line"];
        this.depthWidth = 100;

        this.periodMap = {
            "01w": 7 * 86400 * 1000,
            "03d": 3 * 86400 * 1000,
            "01d": 86400 * 1000,
            "12h": 12 * 3600 * 1000,
            "06h": 6 * 3600 * 1000,
            "04h": 4 * 3600 * 1000,
            "02h": 2 * 3600 * 1000,
            "01h": 3600 * 1000,
            "30m": 30 * 60 * 1000,
            "15m": 15 * 60 * 1000,
            "05m": 5 * 60 * 1000,
            "03m": 3 * 60 * 1000,
            "01m": 60 * 1000,
            "line": 60 * 1000
        };
        this.tagMapPeriod = {
            "1w": "01w",
            "3d": "03d",
            "1d": "01d",
            "12h": "12h",
            "6h": "06h",
            "4h": "04h",
            "2h": "02h",
            "1h": "01h",
            "30m": "30m",
            "15m": "15m",
            "5m": "05m",
            "3m": "03m",
            "1m": "01m",
            "line": "line"
        };
        //event
        this.onResize = null;
        this.onLangChange = null;
        this.onSymbolChange = null;
        this.onThemeChange = null;
        this.onRangeChange = null;
        this.onRequestData = null;

        Object.assign(this, option);

        if (!Kline.created) {
            Kline.instance = this;
            Kline.created = true;
        }
        return Kline.instance;
    }

    /*********************************************
     * Methods
     *********************************************/

    _createClass(Kline, [{
        key: 'draw',
        value: function draw() {
            Kline.chartMgr = new _chart_manager.ChartManager();

            var view = (0, _jquery2.default)(this.element);
            for (var k in this.ranges) {
                var res = (0, _jquery2.default)(view).find('[name="' + this.ranges[k] + '"]');
                res.each(function (i, e) {
                    (0, _jquery2.default)(e).attr("style", "display:inline-block");
                });
            }

            setInterval(_control.Control.refreshFunction, this.intervalTime);

            this.registerMouseEvent();
            _chart_manager.ChartManager.instance.bindCanvas("main", document.getElementById("chart_mainCanvas"));
            _chart_manager.ChartManager.instance.bindCanvas("overlay", document.getElementById("chart_overlayCanvas"));
            _control.Control.refreshTemplate();
            _control.Control.onSize(this.width, this.height);
            _control.Control.readCookie();

            this.setTheme(this.theme);
            this.setLanguage(this.language);
            this.setSymbol(this.symbol, this.symbolName);

            (0, _jquery2.default)(this.element).css({ visibility: "visible" });
        }
    }, {
        key: 'resize',
        value: function resize(width, height) {
            this.width = width;
            this.height = height;
            _control.Control.onSize(this.width, this.height);
        }
    }, {
        key: 'setSymbol',
        value: function setSymbol(symbol, symbolName) {
            this.symbol = symbol;
            this.symbolName = symbolName;
            this.onSymbolChangeFunc(symbol, symbolName);
            _control.Control.switchSymbol(symbol, symbolName);
        }
    }, {
        key: 'setTheme',
        value: function setTheme(style) {
            this.theme = style;
            _control.Control.switchTheme(style);
        }
    }, {
        key: 'setLanguage',
        value: function setLanguage(lang) {
            this.language = lang;
            _control.Control.chartSwitchLanguage(lang);
        }
    }, {
        key: 'setIntervalTime',
        value: function setIntervalTime(intervalTime) {
            this.intervalTime = intervalTime;
            if (this.debug) {
                console.log('DEBUG: interval time changed to ' + intervalTime);
            }
        }
    }, {
        key: 'setDepthWidth',
        value: function setDepthWidth(width) {
            this.depthWidth = width;
            _chart_manager.ChartManager.instance.redraw('All', false);
        }

        /*********************************************
         * Events
         *********************************************/

    }, {
        key: 'onResizeFunc',
        value: function onResizeFunc(width, height) {
            if (this.debug) {
                console.log("DEBUG: chart resized to width: " + width + " height: " + height);
            }
            this.onResize && this.onResize(width, height);
        }
    }, {
        key: 'onLangChangeFunc',
        value: function onLangChangeFunc(lang) {
            if (this.debug) {
                console.log("DEBUG: language changed to " + lang);
            }
            this.onLangChange && this.onLangChange(lang);
        }
    }, {
        key: 'onSymbolChangeFunc',
        value: function onSymbolChangeFunc(symbol, symbolName) {
            if (this.debug) {
                console.log("DEBUG: symbol changed to " + symbol + " " + symbolName);
            }
            this.onSymbolChange && this.onSymbolChange(symbol, symbolName);
        }
    }, {
        key: 'onThemeChangeFunc',
        value: function onThemeChangeFunc(theme) {
            if (this.debug) {
                console.log("DEBUG: themes changed to : " + theme);
            }
            this.onThemeChange && this.onThemeChange(theme);
        }
    }, {
        key: 'onRangeChangeFunc',
        value: function onRangeChangeFunc(range) {
            if (this.debug) {
                console.log("DEBUG: range changed to " + range);
            }
            this.onRangeChange && this.onRangeChange(range);
        }
    }, {
        key: 'onRequestDataFunc',
        value: function onRequestDataFunc(param, callback) {
            if (this.debug) {
                console.log("DEBUG: request data to " + JSON.stringify(param));
            }
            this.onRequestData && this.onRequestData(param, callback);
        }
    }, {
        key: 'registerMouseEvent',
        value: function registerMouseEvent() {
            (0, _jquery2.default)(document).ready(function () {
                function __resize() {
                    if (navigator.userAgent.indexOf('Firefox') >= 0) {
                        setTimeout(function () {
                            _control.Control.onSize(this.width, this.height);
                        }, 200);
                    } else {
                        _control.Control.onSize(this.width, this.height);
                    }
                }
                (0, _jquery2.default)('#chart_overlayCanvas').bind("contextmenu", function (e) {
                    e.cancelBubble = true;
                    e.returnValue = false;
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
                (0, _jquery2.default)(".chart_container .chart_dropdown .chart_dropdown_t").mouseover(function () {
                    var container = (0, _jquery2.default)(".chart_container");
                    var title = (0, _jquery2.default)(this);
                    var dropdown = title.next();
                    var containerLeft = container.offset().left;
                    var titleLeft = title.offset().left;
                    var containerWidth = container.width();
                    var titleWidth = title.width();
                    var dropdownWidth = dropdown.width();
                    var d = (dropdownWidth - titleWidth) / 2 << 0;
                    if (titleLeft - d < containerLeft + 4) {
                        d = titleLeft - containerLeft - 4;
                    } else if (titleLeft + titleWidth + d > containerLeft + containerWidth - 4) {
                        d += titleLeft + titleWidth + d - (containerLeft + containerWidth - 4) + 19;
                    } else {
                        d += 4;
                    }
                    dropdown.css({ "margin-left": -d });
                    title.addClass("chart_dropdown-hover");
                    dropdown.addClass("chart_dropdown-hover");
                }).mouseout(function () {
                    (0, _jquery2.default)(this).next().removeClass("chart_dropdown-hover");
                    (0, _jquery2.default)(this).removeClass("chart_dropdown-hover");
                });
                (0, _jquery2.default)(".chart_dropdown_data").mouseover(function () {
                    (0, _jquery2.default)(this).addClass("chart_dropdown-hover");
                    (0, _jquery2.default)(this).prev().addClass("chart_dropdown-hover");
                }).mouseout(function () {
                    (0, _jquery2.default)(this).prev().removeClass("chart_dropdown-hover");
                    (0, _jquery2.default)(this).removeClass("chart_dropdown-hover");
                });
                (0, _jquery2.default)("#chart_btn_parameter_settings").click(function () {
                    (0, _jquery2.default)('#chart_parameter_settings').addClass("clicked");
                    (0, _jquery2.default)(".chart_dropdown_data").removeClass("chart_dropdown-hover");
                    (0, _jquery2.default)("#chart_parameter_settings").find("th").each(function () {
                        var name = (0, _jquery2.default)(this).html();
                        var index = 0;
                        var tmp = _chart_settings.ChartSettings.get();
                        var value = tmp.indics[name];
                        (0, _jquery2.default)(this.nextElementSibling).find("input").each(function () {
                            if (value !== null && index < value.length) {
                                (0, _jquery2.default)(this).val(value[index]);
                            }
                            index++;
                        });
                    });
                });
                (0, _jquery2.default)("#close_settings").click(function () {
                    (0, _jquery2.default)('#chart_parameter_settings').removeClass("clicked");
                });
                (0, _jquery2.default)(".chart_container .chart_toolbar_tabgroup a").click(function () {
                    _control.Control.switchPeriod((0, _jquery2.default)(this).parent().attr('name'));
                });
                (0, _jquery2.default)("#chart_toolbar_periods_vert ul a").click(function () {
                    _control.Control.switchPeriod((0, _jquery2.default)(this).parent().attr('name'));
                });
                (0, _jquery2.default)("#chart_show_depth").click(function () {
                    if ((0, _jquery2.default)(this).hasClass('selected')) {
                        _control.Control.switchDepth("off");
                    } else {
                        _control.Control.switchDepth("on");
                    }
                });
                (0, _jquery2.default)("#chart_show_tools").click(function () {
                    if ((0, _jquery2.default)(this).hasClass('selected')) {
                        _control.Control.switchTools('off');
                    } else {
                        _control.Control.switchTools('on');
                    }
                });
                (0, _jquery2.default)("#chart_toolpanel .chart_toolpanel_button").click(function () {
                    (0, _jquery2.default)(".chart_dropdown_data").removeClass("chart_dropdown-hover");
                    (0, _jquery2.default)("#chart_toolpanel .chart_toolpanel_button").removeClass("selected");
                    (0, _jquery2.default)(this).addClass("selected");
                    var name = (0, _jquery2.default)(this).children().attr('name');
                    Kline.instance.chartMgr.setRunningMode(_chart_manager.ChartManager.DrawingTool[name]);
                });
                (0, _jquery2.default)('#chart_show_indicator').click(function () {
                    if ((0, _jquery2.default)(this).hasClass('selected')) {
                        _control.Control.switchIndic('off');
                    } else {
                        _control.Control.switchIndic('on');
                    }
                });
                (0, _jquery2.default)("#chart_tabbar li a").click(function () {
                    (0, _jquery2.default)("#chart_tabbar li a").removeClass('selected');
                    (0, _jquery2.default)(this).addClass('selected');
                    var name = (0, _jquery2.default)(this).attr('name');
                    var tmp = _chart_settings.ChartSettings.get();
                    tmp.charts.indics[1] = name;
                    _chart_settings.ChartSettings.save();
                    _chart_manager.ChartManager.instance.getChart().setIndicator(1, name);
                });
                (0, _jquery2.default)("#chart_select_chart_style a").click(function () {
                    (0, _jquery2.default)("#chart_select_chart_style a").removeClass('selected');
                    (0, _jquery2.default)(this).addClass("selected");
                    var tmp = _chart_settings.ChartSettings.get();
                    tmp.charts.chartStyle = (0, _jquery2.default)(this)[0].innerHTML;
                    _chart_settings.ChartSettings.save();
                    var mgr = _chart_manager.ChartManager.instance;
                    mgr.setChartStyle("frame0.k0", (0, _jquery2.default)(this).html());
                    mgr.redraw();
                });
                (0, _jquery2.default)('#chart_dropdown_themes li').click(function () {
                    (0, _jquery2.default)('#chart_dropdown_themes li a').removeClass('selected');
                    var name = (0, _jquery2.default)(this).attr('name');
                    if (name === 'chart_themes_dark') {
                        _control.Control.switchTheme('dark');
                    } else if (name === 'chart_themes_light') {
                        _control.Control.switchTheme('light');
                    }
                });
                (0, _jquery2.default)("#chart_select_main_indicator a").click(function () {
                    (0, _jquery2.default)("#chart_select_main_indicator a").removeClass('selected');
                    (0, _jquery2.default)(this).addClass("selected");
                    var name = (0, _jquery2.default)(this).attr('name');
                    var tmp = _chart_settings.ChartSettings.get();
                    tmp.charts.mIndic = name;
                    _chart_settings.ChartSettings.save();
                    var mgr = _chart_manager.ChartManager.instance;
                    if (!mgr.setMainIndicator("frame0.k0", name)) mgr.removeMainIndicator("frame0.k0");
                    mgr.redraw();
                });
                (0, _jquery2.default)('#chart_toolbar_theme a').click(function () {
                    (0, _jquery2.default)('#chart_toolbar_theme a').removeClass('selected');
                    if ((0, _jquery2.default)(this).attr('name') === 'dark') {
                        _control.Control.switchTheme('dark');
                    } else if ((0, _jquery2.default)(this).attr('name') === 'light') {
                        _control.Control.switchTheme('light');
                    }
                });
                (0, _jquery2.default)('#chart_select_theme li a').click(function () {
                    (0, _jquery2.default)('#chart_select_theme a').removeClass('selected');
                    if ((0, _jquery2.default)(this).attr('name') === 'dark') {
                        _control.Control.switchTheme('dark');
                    } else if ((0, _jquery2.default)(this).attr('name') === 'light') {
                        _control.Control.switchTheme('light');
                    }
                });
                (0, _jquery2.default)('#chart_enable_tools li a').click(function () {
                    (0, _jquery2.default)('#chart_enable_tools a').removeClass('selected');
                    if ((0, _jquery2.default)(this).attr('name') === 'on') {
                        _control.Control.switchTools('on');
                    } else if ((0, _jquery2.default)(this).attr('name') === 'off') {
                        _control.Control.switchTools('off');
                    }
                });
                (0, _jquery2.default)('#chart_enable_indicator li a').click(function () {
                    (0, _jquery2.default)('#chart_enable_indicator a').removeClass('selected');
                    if ((0, _jquery2.default)(this).attr('name') === 'on') {
                        _control.Control.switchIndic('on');
                    } else if ((0, _jquery2.default)(this).attr('name') === 'off') {
                        _control.Control.switchIndic('off');
                    }
                });
                (0, _jquery2.default)('#chart_language_setting_div li a').click(function () {

                    (0, _jquery2.default)('#chart_language_setting_div a').removeClass('selected');
                    if ((0, _jquery2.default)(this).attr('name') === 'zh-cn') {
                        _control.Control.chartSwitchLanguage('zh-cn');
                    } else if ((0, _jquery2.default)(this).attr('name') === 'en-us') {

                        _control.Control.chartSwitchLanguage('en-us');
                    } else if ((0, _jquery2.default)(this).attr('name') === 'zh-tw') {
                        _control.Control.chartSwitchLanguage('zh-tw');
                    }
                });
                (0, _jquery2.default)(document).keyup(function (e) {
                    if (e.keyCode === 46) {
                        _chart_manager.ChartManager.instance.deleteToolObject();
                        _chart_manager.ChartManager.instance.redraw('OverlayCanvas', false);
                    }
                });
                (0, _jquery2.default)("#clearCanvas").click(function () {
                    var pDPTool = _chart_manager.ChartManager.instance.getDataSource("frame0.k0");
                    var len = pDPTool.getToolObjectCount();
                    for (var i = 0; i < len; i++) {
                        pDPTool.delToolObject();
                    }
                    _chart_manager.ChartManager.instance.redraw('OverlayCanvas', false);
                });
                (0, _jquery2.default)("#chart_overlayCanvas").on("touchstart", function (e) {
                    // if (e.which !== 1) {
                    //     ChartManager.instance.deleteToolObject();
                    //     ChartManager.instance.redraw('OverlayCanvas', false);
                    //     return;
                    // }
                    if (window.IsPC) {
                        return;
                    }
                    var r = e.target.getBoundingClientRect();
                    var x = (e.originalEvent.changedTouches[0].pageX - r.left) * 1;
                    var y = (e.originalEvent.changedTouches[0].pageY - r.top) * 1;
                    function longPress() {
                        Kline.instance.buttonDown = true;
                        window.timeOutEvent = 0;
                        _chart_manager.ChartManager.instance.onMouseUp("frame0", x, y);
                        clearTimeout(window.timeOutEvent);
                        _chart_manager.ChartManager.instance.redraw("All");
                    }
                    Kline.instance.buttonDown = false;
                    _chart_manager.ChartManager.instance.onMouseDown("frame0", x, y);
                    _chart_manager.ChartManager.instance.onTouchMove("frame0", x, y, true);
                    _chart_manager.ChartManager.instance.redraw("All", false);
                    if (e.touches.length >= 2) {
                        //判断是否有两个点在屏幕上
                        var starttouches = e.touches; //得到第一组两个点
                    }
                    window.timeOutEvent = setTimeout(longPress, 400);
                }).on("touchmove", function (e) {
                    if (window.IsPC) {
                        return;
                    }
                    var r = e.target.getBoundingClientRect();
                    var x = (e.originalEvent.changedTouches[0].pageX - r.left) * 1;
                    var y = (e.originalEvent.changedTouches[0].pageY - r.top) * 1;
                    var mgr = _chart_manager.ChartManager.instance;
                    function getDistance(p1, p2) {
                        var x = p2.pageX - p1.pageX,
                            y = p2.pageY - p1.pageY;
                        return Math.sqrt(x * x + y * y);
                    }
                    if (e.touches.length >= 2) {
                        //得到第二组两个点
                        var now = e.touches;
                        //得到缩放比例， getDistance 是勾股定理的一个方法
                        var scale = getDistance(now[0], now[1]) / getDistance(start[0], start[1]);
                        // 对缩放 比例 取整
                        mgr.scale(scale > 1 ? 1 : -1);
                        mgr.redraw("All", true);
                    }

                    if (Kline.instance.buttonDown === false) {
                        mgr.onMouseMove("frame0", x, y, true);
                        mgr.redraw("All", false);
                    } else {
                        mgr.onMouseMove("frame0", x, y, false);
                        mgr.redraw("OverlayCanvas");
                    }
                    if (window.timeOutEvent !== 0) {
                        clearTimeout(window.timeOutEvent);window.timeOutEvent = 0;
                    }
                }).on("touchend", function (e) {
                    if (window.IsPC) {
                        return;
                    }
                    Kline.instance.buttonDown = false;
                    var r = e.target.getBoundingClientRect();
                    var x = (e.clientX - r.left) * 1;
                    var y = (e.clientY - r.top) * 1;
                    var mgr = _chart_manager.ChartManager.instance;
                    mgr.onMouseUp("frame0", x, y);
                    mgr.redraw("All");
                    if (window.timeOutEvent !== 0) {
                        clearTimeout(window.timeOutEvent);window.timeOutEvent = 0;
                    }
                }).mousemove(function (e) {
                    if (!window.IsPC) {
                        return;
                    }

                    var r = e.target.getBoundingClientRect();
                    var x = e.clientX - r.left;
                    var y = e.clientY - r.top;
                    var mgr = _chart_manager.ChartManager.instance;
                    if (Kline.instance.buttonDown === true) {
                        mgr.onMouseMove("frame0", x, y, true);
                        mgr.redraw("All", false);
                    } else {
                        mgr.onMouseMove("frame0", x, y, false);
                        mgr.redraw("OverlayCanvas");
                    }
                }).mouseleave(function (e) {
                    if (!window.IsPC) {
                        return;
                    }

                    var r = e.target.getBoundingClientRect();
                    var x = e.clientX - r.left;
                    var y = e.clientY - r.top;
                    var mgr = _chart_manager.ChartManager.instance;
                    mgr.onMouseLeave("frame0", x, y, false);
                    mgr.redraw("OverlayCanvas");
                }).mouseup(function (e) {
                    if (!window.IsPC) {
                        return;
                    }

                    if (e.which !== 1) {
                        return;
                    }
                    Kline.instance.buttonDown = false;
                    var r = e.target.getBoundingClientRect();
                    var x = e.clientX - r.left;
                    var y = e.clientY - r.top;
                    var mgr = _chart_manager.ChartManager.instance;
                    mgr.onMouseUp("frame0", x, y);
                    mgr.redraw("All");
                }).mousedown(function (e) {
                    if (!window.IsPC) {
                        return;
                    }

                    if (e.which !== 1) {
                        _chart_manager.ChartManager.instance.deleteToolObject();
                        _chart_manager.ChartManager.instance.redraw('OverlayCanvas', false);
                        return;
                    }
                    Kline.instance.buttonDown = true;
                    var r = e.target.getBoundingClientRect();
                    var x = e.clientX - r.left;
                    var y = e.clientY - r.top;
                    _chart_manager.ChartManager.instance.onMouseDown("frame0", x, y);
                });
                (0, _jquery2.default)("#chart_parameter_settings :input").change(function () {
                    var name = (0, _jquery2.default)(this).attr("name");
                    var index = 0;
                    var valueArray = [];
                    var mgr = _chart_manager.ChartManager.instance;
                    // debugger
                    (0, _jquery2.default)("#chart_parameter_settings :input").each(function () {
                        if ((0, _jquery2.default)(this).attr("name") === name) {
                            if ((0, _jquery2.default)(this).val() !== "" && (0, _jquery2.default)(this).val() !== null && (0, _jquery2.default)(this).val() !== undefined) {
                                var i = parseInt((0, _jquery2.default)(this).val());
                                valueArray.push(i);
                            }
                            index++;
                        }
                    });
                    if (valueArray.length !== 0) {
                        mgr.setIndicatorParameters(name, valueArray);
                        var value = mgr.getIndicatorParameters(name);
                        var cookieArray = [];
                        index = 0;
                        (0, _jquery2.default)("#chart_parameter_settings :input").each(function () {
                            if ((0, _jquery2.default)(this).attr("name") === name) {
                                if ((0, _jquery2.default)(this).val() !== "" && (0, _jquery2.default)(this).val() !== null && (0, _jquery2.default)(this).val() !== undefined) {
                                    (0, _jquery2.default)(this).val(value[index].getValue());
                                    cookieArray.push(value[index].getValue());
                                }
                                index++;
                            }
                        });
                        var tmp = _chart_settings.ChartSettings.get();
                        tmp.indics[name] = cookieArray;
                        _chart_settings.ChartSettings.save();
                        mgr.redraw('All', true);
                    }
                });
                (0, _jquery2.default)("#chart_parameter_settings button").click(function () {
                    var name = (0, _jquery2.default)(this).parents("tr").children("th").html();
                    var index = 0;
                    var value = _chart_manager.ChartManager.instance.getIndicatorParameters(name);
                    var valueArray = [];
                    (0, _jquery2.default)(this).parent().prev().children('input').each(function () {
                        if (value !== null && index < value.length) {
                            (0, _jquery2.default)(this).val(value[index].getDefaultValue());
                            valueArray.push(value[index].getDefaultValue());
                        }
                        index++;
                    });
                    _chart_manager.ChartManager.instance.setIndicatorParameters(name, valueArray);
                    var tmp = _chart_settings.ChartSettings.get();
                    tmp.indics[name] = valueArray;
                    _chart_settings.ChartSettings.save();
                    _chart_manager.ChartManager.instance.redraw('All', false);
                });

                (0, _jquery2.default)('body').on('click', '#sizeIcon', function () {
                    Kline.instance.isSized = !Kline.instance.isSized;
                    if (Kline.instance.isSized) {
                        (0, _jquery2.default)(Kline.instance.element).css({
                            position: 'fixed',
                            left: '0',
                            right: '0',
                            top: '0',
                            bottom: '0',
                            width: document.body.clientWidth,
                            height: document.body.clientHeight,
                            zIndex: '10000'
                        });

                        _control.Control.onSize();
                        (0, _jquery2.default)('html,body').css({ width: '100%', height: '100%', overflow: 'hidden' });
                    } else {
                        (0, _jquery2.default)(Kline.instance.element).attr('style', '');

                        (0, _jquery2.default)('html,body').attr('style', '');

                        _control.Control.onSize(Kline.instance.width, Kline.instance.height);
                        (0, _jquery2.default)(Kline.instance.element).css({ visibility: 'visible', height: Kline.instance.height + 'px' });
                    }
                });
            });
        }
    }]);

    return Kline;
}();

exports.default = Kline;

Kline.created = false;
Kline.instance = null;