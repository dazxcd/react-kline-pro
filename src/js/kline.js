import {Control} from './control'
import {ChartManager} from './chart_manager'
import {ChartSettings} from './chart_settings'
import $ from 'jquery'

export default class Kline {

    constructor(option) {
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
        this.depthWidth=100;

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
        this.onResize=null;
        this.onLangChange=null;
        this.onSymbolChange=null;
        this.onThemeChange=null;
        this.onRangeChange=null;
        this.onRequestData=null;

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

    draw() {
        Kline.chartMgr = new ChartManager();

        let view = $(this.element);
        for (let k in this.ranges) {
            let res = $(view).find('[name="' + this.ranges[k] + '"]');
            res.each(function (i, e) {
                $(e).attr("style", "display:inline-block");
            });
        }

        setInterval(Control.refreshFunction, this.intervalTime);

        this.registerMouseEvent();
        ChartManager.instance.bindCanvas("main", document.getElementById("chart_mainCanvas"));
        ChartManager.instance.bindCanvas("overlay", document.getElementById("chart_overlayCanvas"));
        Control.refreshTemplate();
        Control.onSize(this.width, this.height);
        Control.readCookie();

        this.setTheme(this.theme);
        this.setLanguage(this.language);
        this.setSymbol(this.symbol,this.symbolName);

        $(this.element).css({visibility: "visible"});
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        Control.onSize(this.width, this.height);
    }

    setSymbol(symbol, symbolName) {
        this.symbol = symbol;
        this.symbolName = symbolName;
        this.onSymbolChangeFunc(symbol, symbolName);
        Control.switchSymbol(symbol,symbolName);
    }

    setTheme(style) {
        this.theme = style;
        Control.switchTheme(style);
    }

    setLanguage(lang) {
        this.language = lang;
        Control.chartSwitchLanguage(lang);
    }

    setIntervalTime(intervalTime) {
        this.intervalTime = intervalTime;
        if (this.debug) {
            console.log('DEBUG: interval time changed to ' + intervalTime);
        }
    }

    setDepthWidth(width){
        this.depthWidth = width;
        ChartManager.instance.redraw('All', false);
    }

    /*********************************************
     * Events
     *********************************************/

    onResizeFunc(width, height) {
        if (this.debug) {
            console.log("DEBUG: chart resized to width: " + width + " height: " + height);
        }
        this.onResize && this.onResize(width,height);
    }

    onLangChangeFunc(lang) {
        if (this.debug) {
            console.log("DEBUG: language changed to " + lang);
        }
        this.onLangChange && this.onLangChange(lang);
    }

    onSymbolChangeFunc(symbol, symbolName) {
        if (this.debug) {
            console.log("DEBUG: symbol changed to " + symbol + " " + symbolName);
        }
        this.onSymbolChange && this.onSymbolChange(symbol,symbolName);
    }

    onThemeChangeFunc(theme) {
        if (this.debug) {
            console.log("DEBUG: themes changed to : " + theme);
        }
        this.onThemeChange && this.onThemeChange(theme);
    }

    onRangeChangeFunc(range) {
        if (this.debug) {
            console.log("DEBUG: range changed to " + range);
        }
        this.onRangeChange && this.onRangeChange(range);
    }

    onRequestDataFunc(param,callback){
        if (this.debug) {
            console.log("DEBUG: request data to " + JSON.stringify(param));
        }
        this.onRequestData && this.onRequestData(param,callback);
    }

    registerMouseEvent() {
        $(document).ready(function () {
            function __resize() {
                if (navigator.userAgent.indexOf('Firefox') >= 0) {
                    setTimeout(function () {
                        Control.onSize(this.width, this.height)
                    }, 200);
                } else {
                    Control.onSize(this.width, this.height)
                }
            }
            $('#chart_overlayCanvas').bind("contextmenu", function (e) {
                e.cancelBubble = true;
                e.returnValue = false;
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            $(".chart_container .chart_dropdown .chart_dropdown_t")
                .mouseover(function () {
                    let container = $(".chart_container");
                    let title = $(this);
                    let dropdown = title.next();
                    let containerLeft = container.offset().left;
                    let titleLeft = title.offset().left;
                    let containerWidth = container.width();
                    let titleWidth = title.width();
                    let dropdownWidth = dropdown.width();
                    let d = ((dropdownWidth - titleWidth) / 2) << 0;
                    if (titleLeft - d < containerLeft + 4) {
                        d = titleLeft - containerLeft - 4;
                    } else if (titleLeft + titleWidth + d > containerLeft + containerWidth - 4) {
                        d += titleLeft + titleWidth + d - (containerLeft + containerWidth - 4) + 19;
                    } else {
                        d += 4;
                    }
                    dropdown.css({"margin-left": -d});
                    title.addClass("chart_dropdown-hover");
                    dropdown.addClass("chart_dropdown-hover");
                })
                .mouseout(function () {
                    $(this).next().removeClass("chart_dropdown-hover");
                    $(this).removeClass("chart_dropdown-hover");
                });
            $(".chart_dropdown_data")
                .mouseover(function () {
                    $(this).addClass("chart_dropdown-hover");
                    $(this).prev().addClass("chart_dropdown-hover");
                })
                .mouseout(function () {
                    $(this).prev().removeClass("chart_dropdown-hover");
                    $(this).removeClass("chart_dropdown-hover");
                });
            $("#chart_btn_parameter_settings").click(function () {
                $('#chart_parameter_settings').addClass("clicked");
                $(".chart_dropdown_data").removeClass("chart_dropdown-hover");
                $("#chart_parameter_settings").find("th").each(function () {
                    let name = $(this).html();
                    let index = 0;
                    let tmp = ChartSettings.get();
                    let value = tmp.indics[name];
                    $(this.nextElementSibling).find("input").each(function () {
                        if (value !== null && index < value.length) {
                            $(this).val(value[index]);
                        }
                        index++;
                    });
                });
            });
            $("#close_settings").click(function () {
                $('#chart_parameter_settings').removeClass("clicked");
            });
            $(".chart_container .chart_toolbar_tabgroup a")
                .click(function () {
                    Control.switchPeriod($(this).parent().attr('name'));
                });
            $("#chart_toolbar_periods_vert ul a").click(function () {
                Control.switchPeriod($(this).parent().attr('name'));
            });
            $("#chart_show_depth")
                .click(function(){
                    if($(this).hasClass('selected')){
                        Control.switchDepth("off");
                    }else{
                        Control.switchDepth("on");
                    }
                });
            $("#chart_show_tools")
                .click(function () {
                    if ($(this).hasClass('selected')) {
                        Control.switchTools('off');
                    } else {
                        Control.switchTools('on');
                    }
                });
            $("#chart_toolpanel .chart_toolpanel_button")
                .click(function () {
                    $(".chart_dropdown_data").removeClass("chart_dropdown-hover");
                    $("#chart_toolpanel .chart_toolpanel_button").removeClass("selected");
                    $(this).addClass("selected");
                    let name = $(this).children().attr('name');
                    Kline.instance.chartMgr.setRunningMode(ChartManager.DrawingTool[name]);
                });
            $('#chart_show_indicator')
                .click(function () {
                    if ($(this).hasClass('selected')) {
                        Control.switchIndic('off');
                    } else {
                        Control.switchIndic('on');
                    }
                });
            $("#chart_tabbar li a")
                .click(function () {
                    $("#chart_tabbar li a").removeClass('selected');
                    $(this).addClass('selected');
                    let name = $(this).attr('name');
                    let tmp = ChartSettings.get();
                    tmp.charts.indics[1] = name;
                    ChartSettings.save();
                    ChartManager.instance.getChart().setIndicator(1, name);
                });
            $("#chart_select_chart_style a")
                .click(function () {
                    $("#chart_select_chart_style a").removeClass('selected');
                    $(this).addClass("selected");
                    let tmp = ChartSettings.get();
                    tmp.charts.chartStyle = $(this)[0].innerHTML;
                    ChartSettings.save();
                    let mgr = ChartManager.instance;
                    mgr.setChartStyle("frame0.k0", $(this).html());
                    mgr.redraw();
                });
            $('#chart_dropdown_themes li').click(function () {
                $('#chart_dropdown_themes li a').removeClass('selected');
                let name = $(this).attr('name');
                if (name === 'chart_themes_dark') {
                    Control.switchTheme('dark');
                } else if (name === 'chart_themes_light') {
                    Control.switchTheme('light');
                }
            });
            $("#chart_select_main_indicator a")
                .click(function () {
                    $("#chart_select_main_indicator a").removeClass('selected');
                    $(this).addClass("selected");
                    let name = $(this).attr('name');
                    let tmp = ChartSettings.get();
                    tmp.charts.mIndic = name;
                    ChartSettings.save();
                    let mgr = ChartManager.instance;
                    if (!mgr.setMainIndicator("frame0.k0", name))
                        mgr.removeMainIndicator("frame0.k0");
                    mgr.redraw();
                });
            $('#chart_toolbar_theme a').click(function () {
                $('#chart_toolbar_theme a').removeClass('selected');
                if ($(this).attr('name') === 'dark') {
                    Control.switchTheme('dark');
                } else if ($(this).attr('name') === 'light') {
                    Control.switchTheme('light');
                }
            });
            $('#chart_select_theme li a').click(function () {
                $('#chart_select_theme a').removeClass('selected');
                if ($(this).attr('name') === 'dark') {
                    Control.switchTheme('dark');
                } else if ($(this).attr('name') === 'light') {
                    Control.switchTheme('light');
                }
            });
            $('#chart_enable_tools li a').click(function () {
                $('#chart_enable_tools a').removeClass('selected');
                if ($(this).attr('name') === 'on') {
                    Control.switchTools('on');
                } else if ($(this).attr('name') === 'off') {
                    Control.switchTools('off');
                }
            });
            $('#chart_enable_indicator li a').click(function () {
                $('#chart_enable_indicator a').removeClass('selected');
                if ($(this).attr('name') === 'on') {
                    Control.switchIndic('on');
                } else if ($(this).attr('name') === 'off') {
                    Control.switchIndic('off');
                }
            });
            $('#chart_language_setting_div li a').click(function () {

                $('#chart_language_setting_div a').removeClass('selected');
                if ($(this).attr('name') === 'zh-cn') {
                    Control.chartSwitchLanguage('zh-cn');
                } else if ($(this).attr('name') === 'en-us') {

                    Control.chartSwitchLanguage('en-us');
                } else if ($(this).attr('name') === 'zh-tw') {
                    Control.chartSwitchLanguage('zh-tw');
                }
            });
            $(document).keyup(function (e) {
                if (e.keyCode === 46) {
                    ChartManager.instance.deleteToolObject();
                    ChartManager.instance.redraw('OverlayCanvas', false);
                }
            });
            $("#clearCanvas").click(function () {
                let pDPTool = ChartManager.instance.getDataSource("frame0.k0");
                let len = pDPTool.getToolObjectCount();
                for (let i = 0; i < len; i++) {
                    pDPTool.delToolObject();
                }
                ChartManager.instance.redraw('OverlayCanvas', false);
            });
            $("#chart_overlayCanvas")
                .on("touchstart", function(e) {
                    // if (e.which !== 1) {
                    //     ChartManager.instance.deleteToolObject();
                    //     ChartManager.instance.redraw('OverlayCanvas', false);
                    //     return;
                    // }
                    if (window.IsPC){return;}
                    let r = e.target.getBoundingClientRect();
                    let x = (e.originalEvent.changedTouches[0].pageX - r.left)*1;
                    let y = (e.originalEvent.changedTouches[0].pageY - r.top)*1;
                    function longPress(){
                        Kline.instance.buttonDown = true;
                        window.timeOutEvent = 0;
                        ChartManager.instance.onMouseUp("frame0", x, y);
                        clearTimeout(window.timeOutEvent);
                        ChartManager.instance.redraw("All");
                    }
                    Kline.instance.buttonDown = false;
                    ChartManager.instance.onMouseDown("frame0", x, y);
                    ChartManager.instance.onTouchMove("frame0", x, y, true);
                    ChartManager.instance.redraw("All", false);
                    if (e.touches.length >= 2) { //判断是否有两个点在屏幕上
                        var starttouches = e.touches; //得到第一组两个点
                    }
                    window.timeOutEvent = setTimeout(longPress, 400);
                })
                .on("touchmove", function(e) {
                    if (window.IsPC){return;}
                    let r = e.target.getBoundingClientRect();
                    let x = (e.originalEvent.changedTouches[0].pageX - r.left)*1;
                    let y = (e.originalEvent.changedTouches[0].pageY - r.top)*1;
                    let mgr = ChartManager.instance;
                    function getDistance(p1, p2) {
                        var x = p2.pageX - p1.pageX,
                            y = p2.pageY - p1.pageY;
                        return Math.sqrt((x * x) + (y * y));
                    }
                    if(e.touches.length >= 2){
                        //得到第二组两个点
                        var now = e.touches;
                        //得到缩放比例， getDistance 是勾股定理的一个方法
                        var scale = (getDistance(now[0], now[1]) / getDistance(start[0], start[1]));
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
                    if(window.timeOutEvent !== 0){clearTimeout( window.timeOutEvent); window.timeOutEvent = 0;}
                })
                .on("touchend", function(e) {
                    if (window.IsPC){return;}
                    Kline.instance.buttonDown = false;
                    let r = e.target.getBoundingClientRect();
                    let x = (e.clientX - r.left)*1;
                    let y = (e.clientY - r.top)*1;
                    let mgr = ChartManager.instance;
                    mgr.onMouseUp("frame0", x, y);
                    mgr.redraw("All");
                    if(window.timeOutEvent !== 0){clearTimeout( window.timeOutEvent); window.timeOutEvent = 0;}
                })


                .mousemove(function (e) {
                    if (!window.IsPC){return;}

                    let r = e.target.getBoundingClientRect();
                    let x = e.clientX - r.left;
                    let y = e.clientY - r.top;
                    let mgr = ChartManager.instance;
                    if (Kline.instance.buttonDown === true) {
                        mgr.onMouseMove("frame0", x, y, true);
                        mgr.redraw("All", false);
                    } else {
                        mgr.onMouseMove("frame0", x, y, false);
                        mgr.redraw("OverlayCanvas");
                    }
                })
                .mouseleave(function (e) {
                    if (!window.IsPC){return;}

                    let r = e.target.getBoundingClientRect();
                    let x = e.clientX - r.left;
                    let y = e.clientY - r.top;
                    let mgr = ChartManager.instance;
                    mgr.onMouseLeave("frame0", x, y, false);
                    mgr.redraw("OverlayCanvas");
                })
                .mouseup(function (e) {
                    if (!window.IsPC){return;}

                    if (e.which !== 1) {
                        return;
                    }
                    Kline.instance.buttonDown = false;
                    let r = e.target.getBoundingClientRect();
                    let x = e.clientX - r.left;
                    let y = e.clientY - r.top;
                    let mgr = ChartManager.instance;
                    mgr.onMouseUp("frame0", x, y);
                    mgr.redraw("All");
                })
                .mousedown(function (e) {
                    if (!window.IsPC){return;}

                    if (e.which !== 1) {
                        ChartManager.instance.deleteToolObject();
                        ChartManager.instance.redraw('OverlayCanvas', false);
                        return;
                    }
                    Kline.instance.buttonDown = true;
                    let r = e.target.getBoundingClientRect();
                    let x = e.clientX - r.left;
                    let y = e.clientY - r.top;
                    ChartManager.instance.onMouseDown("frame0", x, y);
                });
            $("#chart_parameter_settings :input").change(function () {
                let name = $(this).attr("name");
                let index = 0;
                let valueArray = [];
                let mgr = ChartManager.instance;
                // debugger
                $("#chart_parameter_settings :input").each(function () {
                    if ($(this).attr("name") === name) {
                        if ($(this).val() !== "" && $(this).val() !== null && $(this).val() !== undefined) {
                            let i = parseInt($(this).val());
                            valueArray.push(i);
                        }
                        index++;
                    }
                });
                if (valueArray.length !== 0) {
                    mgr.setIndicatorParameters(name, valueArray);
                    let value = mgr.getIndicatorParameters(name);
                    let cookieArray = [];
                    index = 0;
                    $("#chart_parameter_settings :input").each(function () {
                        if ($(this).attr("name") === name) {
                            if ($(this).val() !== "" && $(this).val() !== null && $(this).val() !== undefined) {
                                $(this).val(value[index].getValue());
                                cookieArray.push(value[index].getValue());
                            }
                            index++;
                        }
                    });
                    let tmp = ChartSettings.get();
                    tmp.indics[name] = cookieArray;
                    ChartSettings.save();
                    mgr.redraw('All',true);
                }
            });
            $("#chart_parameter_settings button").click(function () {
                let name = $(this).parents("tr").children("th").html();
                let index = 0;
                let value = ChartManager.instance.getIndicatorParameters(name);
                let valueArray = [];
                $(this).parent().prev().children('input').each(function () {
                    if (value !== null && index < value.length) {
                        $(this).val(value[index].getDefaultValue());
                        valueArray.push(value[index].getDefaultValue());
                    }
                    index++;
                });
                ChartManager.instance.setIndicatorParameters(name, valueArray);
                let tmp = ChartSettings.get();
                tmp.indics[name] = valueArray;
                ChartSettings.save();
                ChartManager.instance.redraw('All', false);
            });

            $('body').on('click', '#sizeIcon', function () {
                Kline.instance.isSized = !Kline.instance.isSized;
                if (Kline.instance.isSized) {
                    $(Kline.instance.element).css({
                        position: 'fixed',
                        left: '0',
                        right: '0',
                        top: '0',
                        bottom: '0',
                        width: document.body.clientWidth,
                        height: document.body.clientHeight,
                        zIndex: '10000'
                    });

                    Control.onSize();
                    $('html,body').css({width: '100%', height: '100%', overflow: 'hidden'});
                } else {
                    $(Kline.instance.element).attr('style', '');

                    $('html,body').attr('style', '');

                    Control.onSize(Kline.instance.width, Kline.instance.height);
                    $(Kline.instance.element).css({visibility: 'visible', height: Kline.instance.height + 'px'});
                }
            });
        })

    }

}
Kline.created = false;
Kline.instance = null;
