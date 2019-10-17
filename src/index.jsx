import React from 'react';
import './css/main.css';
import Kline from './js/kline.js';

class ReactKline extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            props: props,
            kline: null,
            change:false,
        }
    }

    componentDidMount(){
        function IsPC() {
            let userAgentInfo = navigator.userAgent;
            let Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
            let flag = true;
            for (let v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }

        window.IsPC = IsPC();
        /**
         *  Describe:新增resize自动
         *  Created by xjc on 2019/7/24
         */
        /*quoteTime: rawData[0],
                    preClose: rawData[1],
                    open: rawData[2],
                    high: rawData[3],
                    low: rawData[4],
                    close: rawData[5],
                    volume: rawData[6],
                    amount: rawData[7]*/
        //时间(ms), 开盘价, 最高价, 最低价, 收盘价, 成交量
        let cfg={
            element: "#kline_container",
            width: document.getElementById("resize_container").offsetWidth,
            height: document.getElementById("resize_container").offsetHeight,
            theme: 'dark',
            language: 'zh-cn',
            ranges: ["1w", "1d", "1h", "30m", "15m", "5m", "1m", "line"],
            symbol: "BTC",
            symbolName: "BTC/USD",
            limit: 1000,
            intervalTime: 5000,
            debug: false,
            depthWidth: 50,
        };
        Object.assign(cfg,this.state.props);
        window.stock = this.state.props.symbol;
        this.state.kline = new Kline(cfg);
        this.state.kline.draw();
        window.addEventListener('resize', ()=>{
            this.state.kline.resize(document.getElementById("resize_container").offsetWidth, document.getElementById("resize_container").offsetHeight);
        })
    }

    resize(w,h){
        this.state.kline.resize(w, h);
    }

    setSymbol(symbol,symbolName){
        this.state.kline.setSymbol(symbol,symbolName);
    }

    setTheme(style){
        this.state.kline.setTheme(style);
    }

    setLanguage(lang){
        this.state.kline.setLanguage(lang);
    }

    setIntervalTime(intervalTime){
        this.state.kline.setIntervalTime(intervalTime);
    }

    componentWillReceiveProps(nextProps){
        if(this.props.symbol!==nextProps.symbol){
            this.setSymbol(nextProps.symbol.toUpperCase(),nextProps.symbol.toUpperCase())
        }
    }

    render() {

        return (
            <div id='resize_container' style={{width:'100%', height:'100%'}}>
                <div id="kline_container">
                    <div className="chart_container dark">
                        <div id="chart_dom_elem_cache"></div>
                        <div id="chart_toolbar">
                            <div className="symbol-title" id="symbol_title"/>
                            <div className="chart_dropdown" id="chart_toolbar_periods_vert">
                                <div className="chart_dropdown_t"><a className="chart_str_period">周期</a></div>
                                <div className="chart_dropdown_data" style={{marginLeft:-58+"px"}}>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td>
                                                <ul>
                                                    <li id="chart_period_1w_v" style={{display:"none"}} name="1w"><a className="chart_str_period_1w">周线</a></li>
                                                    <li id="chart_period_3d_v" style={{display:"none"}} name="3d"><a className="chart_str_period_3d">3日</a></li>
                                                    <li id="chart_period_1d_v" style={{display:"none"}} name="1d"><a className="chart_str_period_1d">日线</a></li>
                                                    <li id="chart_period_12h_v" style={{display:"none"}} name="12h"><a className="chart_str_period_12h">12小时</a></li>
                                                    <li id="chart_period_6h_v" style={{display:"none"}} name="6h"><a className="chart_str_period_6h">6小时</a></li>
                                                    <li id="chart_period_4h_v" style={{display:"none"}} name="4h"><a className="chart_str_period_4h">4小时</a></li>
                                                    <li id="chart_period_2h_v" style={{display:"none"}} name="2h"><a className="chart_str_period_2h">2小时</a></li>
                                                    <li id="chart_period_1h_v" style={{display:"none"}} name="1h"><a className="chart_str_period_1h">1小时</a></li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <ul>
                                                    <li id="chart_period_30m_v" style={{display:"none"}} name="30m"><a className="chart_str_period_30m">30分钟</a></li>
                                                    <li id="chart_period_15m_v" style={{display:"none"}} name="15m"><a className="chart_str_period_15m">15分钟</a></li>
                                                    <li id="chart_period_5m_v" style={{display:"none"}} name="5m"><a className="chart_str_period_5m">5分钟</a></li>
                                                    <li id="chart_period_3m_v" style={{display:"none"}} name="3m"><a className="chart_str_period_3m">3分钟</a></li>
                                                    <li id="chart_period_1m_v" style={{display:"none"}} name="1m"><a className="chart_str_period_1m selected">1分钟</a></li>
                                                    <li id="chart_period_line_v" style={{display:"none"}} name="line"><a className="chart_str_period_line">分时</a></li>
                                                </ul>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div id="chart_toolbar_periods_horz">
                                <ul className="chart_toolbar_tabgroup" style={{paddingLeft:5+"px", paddingRight:11+"px"}}>
                                    <li id="chart_period_1w_h" name="1w" style={{display:"none"}}><a className="chart_str_period_1w">周线</a></li>
                                    <li id="chart_period_3d_h" name="3d" style={{display:"none"}}><a className="chart_str_period_3d">3日</a></li>
                                    <li id="chart_period_1d_h" name="1d" style={{display:"none"}}><a className="chart_str_period_1d">日线</a></li>
                                    <li id="chart_period_12h_h" name="12h" style={{display:"none"}}><a className="chart_str_period_12h">12小时</a></li>
                                    <li id="chart_period_6h_h" name="6h" style={{display:"none"}}><a className="chart_str_period_6h">6小时</a></li>
                                    <li id="chart_period_4h_h" name="4h" style={{display:"none"}}><a className="chart_str_period_4h">4小时</a></li>
                                    <li id="chart_period_2h_h" name="2h" style={{display:"none"}}><a className="chart_str_period_2h">2小时</a></li>
                                    <li id="chart_period_1h_h" name="1h" style={{display:"none"}}><a className="chart_str_period_1h">1小时</a></li>
                                    <li id="chart_period_30m_h" name="30m" style={{display:"none"}}><a className="chart_str_period_30m">30分钟</a></li>
                                    <li id="chart_period_15m_h" name="15m" style={{display:"none"}}><a className="chart_str_period_15m">15分钟</a></li>
                                    <li id="chart_period_5m_h" name="5m" style={{display:"none"}}><a className="chart_str_period_5m">5分钟</a></li>
                                    <li id="chart_period_3m_h" name="3m" style={{display:"none"}}><a className="chart_str_period_3m">3分钟</a></li>
                                    <li id="chart_period_1m_h" name="1m" style={{display:"none"}}><a className="chart_str_period_1m selected">1分钟</a></li>
                                    <li id="chart_period_line_h" name="line" style={{display:"none"}}><a className="chart_str_period_line">分时</a></li>
                                </ul>
                            </div>
                            <div id="chart_show_indicator" className="chart_toolbar_button chart_str_indicator_cap selected">技术指标</div>
                            <div id="chart_show_tools" className="chart_toolbar_button chart_str_tools_cap">画线工具</div>
                            <div id="chart_toolbar_theme">
                                <div className="chart_toolbar_label chart_str_theme_cap">主题选择</div>
                                <a name="dark" className="chart_icon chart_icon_theme_dark selected"></a>
                                <a name="light" className="chart_icon chart_icon_theme_light"></a>
                            </div>
                            <div className="chart_dropdown" id="chart_dropdown_settings">
                                <div className="chart_dropdown_t"><a className="chart_str_settings">更多</a></div>
                                <div className="chart_dropdown_data" style={{marginLeft: -142+"px"}}>
                                    <table>
                                        <tbody>
                                        <tr id="chart_select_main_indicator">
                                            <td className="chart_str_main_indicator">主指标</td>
                                            <td>
                                                <ul>
                                                    <li><a name="MA" className="selected">MA</a></li>
                                                    <li><a name="EMA" className="">EMA</a></li>
                                                    <li><a name="BOLL" className="">BOLL</a></li>
                                                    <li><a name="SAR" className="">SAR</a></li>
                                                    <li><a name="NONE" className="">None</a></li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr id="chart_select_chart_style">
                                            <td className="chart_str_chart_style">主图样式</td>
                                            <td>
                                                <ul>
                                                    <li><a className="selected">CandleStick</a></li>
                                                    <li><a className="">CandleStickHLC</a></li>
                                                    <li><a className="">OHLC</a></li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr id="chart_select_theme" style={{display:"none"}}>
                                            <td className="chart_str_theme">主题选择</td>
                                            <td>
                                                <ul>
                                                    <li><a name="dark" className="chart_icon chart_icon_theme_dark selected"></a></li>
                                                    <li><a name="light" className="chart_icon chart_icon_theme_light"></a></li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr id="chart_enable_tools" style={{display:"none"}}>
                                            <td className="chart_str_tools">画线工具</td>
                                            <td>
                                                <ul>
                                                    <li><a name="on" className="chart_str_on">开启</a></li>
                                                    <li><a name="off" className="chart_str_off selected">关闭</a></li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr id="chart_enable_indicator" style={{display:"none"}}>
                                            <td className="chart_str_indicator">技术指标</td>
                                            <td>
                                                <ul>
                                                    <li><a name="on" className="chart_str_on selected">开启</a></li>
                                                    <li><a name="off" className="chart_str_off">关闭</a></li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <ul>
                                                    <li><a id="chart_btn_parameter_settings" className="chart_str_indicator_parameters">指标参数设置</a></li>
                                                </ul>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="chart_dropdown" id="chart_language_setting_div" style={{paddingLeft:5+"px"}}>
                                <div className="chart_dropdown_t"><a className="chart_language_setting">语言(LANG)</a></div>
                                <div className="chart_dropdown_data" style={{paddingTop:15+"px",marginLeft:-12+"px"}}>
                                    <ul>
                                        <li style={{height: 25+"px"}}><a name="zh-cn" className="selected">简体中文(zh-CN)</a></li>
                                        <li style={{height: 25+"px"}}><a name="en-us">English(en-US)</a></li>
                                        <li style={{height: 25+"px"}}><a name="zh-tw">繁體中文(zh-HK)</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div id="chart_updated_time">
                                <div id="sizeIcon" className="chart_BoxSize"></div>
                            </div>

                        </div>
                        <div id="chart_toolpanel">
                            <div className="chart_toolpanel_separator"></div>
                            <div className="clear_all">
                                <div className="clear_all_icon" id="clearCanvas"></div>
                                <div className="chart_toolpanel_tip chart_str_clear_all">清除全部</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_Cursor" name="Cursor"></div>
                                <div className="chart_toolpanel_tip chart_str_cursor">光标</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_CrossCursor" name="CrossCursor"></div>
                                <div className="chart_toolpanel_tip chart_str_cross_cursor">十字光标</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_SegLine" name="SegLine"></div>
                                <div className="chart_toolpanel_tip chart_str_seg_line">线段</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_StraightLine" name="StraightLine"></div>
                                <div className="chart_toolpanel_tip chart_str_straight_line">直线</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_RayLine" name="RayLine"></div>
                                <div className="chart_toolpanel_tip chart_str_ray_line">射线</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_ArrowLine" name="ArrowLine"></div>
                                <div className="chart_toolpanel_tip chart_str_arrow_line">箭头</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_HoriSegLine" name="HoriSegLine"></div>
                                <div className="chart_toolpanel_tip chart_str_horz_seg_line">水平线段</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_HoriStraightLine" name="HoriStraightLine"></div>
                                <div className="chart_toolpanel_tip chart_str_horz_straight_line">水平直线</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_HoriRayLine" name="HoriRayLine"></div>
                                <div className="chart_toolpanel_tip chart_str_horz_ray_line">水平射线</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_VertiStraightLine" name="VertiStraightLine"></div>
                                <div className="chart_toolpanel_tip chart_str_vert_straight_line">垂直直线</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_PriceLine" name="PriceLine"></div>
                                <div className="chart_toolpanel_tip chart_str_price_line">价格线</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_TriParallelLine" name="TriParallelLine"></div>
                                <div className="chart_toolpanel_tip chart_str_tri_parallel_line">价格通道线</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_BiParallelLine" name="BiParallelLine"></div>
                                <div className="chart_toolpanel_tip chart_str_bi_parallel_line">平行直线</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_BiParallelRayLine" name="BiParallelRayLine"></div>
                                <div className="chart_toolpanel_tip chart_str_bi_parallel_ray">平行射线</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_DrawFibRetrace" name="DrawFibRetrace"></div>
                                <div className="chart_toolpanel_tip chart_str_fib_retrace">斐波纳契回调</div>
                            </div>
                            <div className="chart_toolpanel_button">
                                <div className="chart_toolpanel_icon" id="chart_DrawFibFans" name="DrawFibFans"></div>
                                <div className="chart_toolpanel_tip chart_str_fib_fans">斐波纳契扇形</div>
                            </div>
                        </div>
                        <div id="chart_canvasGroup" className="temp">
                            <canvas className="chart_canvas" id="chart_mainCanvas" style={{cursor:"default"}}></canvas>
                            <canvas className="chart_canvas" id="chart_overlayCanvas" style={{cursor:"default"}}></canvas>
                        </div>
                        <div id="chart_tabbar">
                            <ul>
                                <li><a name="VOLUME" className="">VOLUME</a></li>
                                <li><a name="MACD" className="">MACD</a></li>
                                <li><a name="KDJ" className="">KDJ</a></li>
                                <li><a name="StochRSI" className="">StochRSI</a></li>
                                <li><a name="RSI" className="">RSI</a></li>
                                <li><a name="DMI" className="">DMI</a></li>
                                <li><a name="OBV" className="">OBV</a></li>
                                <li><a name="BOLL" className="">BOLL</a></li>
                                <li><a name="SAR" className="">SAR</a></li>
                                <li><a name="DMA" className="">DMA</a></li>
                                <li><a name="TRIX" className="">TRIX</a></li>
                                <li><a name="BRAR" className="">BRAR</a></li>
                                <li><a name="VR" className="">VR</a></li>
                                <li><a name="EMV" className="">EMV</a></li>
                                <li><a name="WR" className="">WR</a></li>
                                <li><a name="ROC" className="">ROC</a></li>
                                <li><a name="MTM" className="">MTM</a></li>
                                <li><a name="PSY">PSY</a></li>
                            </ul>
                        </div>
                        <div id="chart_parameter_settings">
                            <h2 className="chart_str_indicator_parameters">指标参数设置</h2>
                            <table>
                                <tbody>
                                <tr>
                                    <th>MA</th>
                                    <td><input name="MA"/><input name="MA"/><input name="MA"/><input name="MA"/><input name="MA"/><input name="MA"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                    <th>DMA</th>
                                    <td><input name="DMA"/><input name="DMA"/><input name="DMA"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                </tr>
                                <tr>
                                    <th>EMA</th>
                                    <td><input name="EMA"/><input name="EMA"/><input name="EMA"/><input name="EMA"/><input name="EMA"/><input name="EMA"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                    <th>TRIX</th>
                                    <td><input name="TRIX"/><input name="TRIX"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                </tr>

                                <tr>
                                    <th>VOLUME</th>
                                    <td><input name="VOLUME"/><input name="VOLUME"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                    <th>BRAR</th>
                                    <td><input name="BRAR"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                </tr>
                                <tr>
                                    <th>MACD</th>
                                    <td><input name="MACD"/><input name="MACD"/><input name="MACD"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                    <th>VR</th>
                                    <td><input name="VR"/><input name="VR"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                </tr>
                                <tr>
                                    <th>KDJ</th>
                                    <td><input name="KDJ"/><input name="KDJ"/><input name="KDJ"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                    <th>EMV</th>
                                    <td><input name="EMV"/><input name="EMV"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                </tr>
                                <tr>
                                    <th>StochRSI</th>
                                    <td><input name="StochRSI"/><input name="StochRSI"/><input name="StochRSI"/><input name="StochRSI"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                    <th>WR</th>
                                    <td><input name="WR"/><input name="WR"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                </tr>
                                <tr>
                                    <th>RSI</th>
                                    <td><input name="RSI"/><input name="RSI"/><input name="RSI"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                    <th>ROC</th>
                                    <td><input name="ROC"/><input name="ROC"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                </tr>
                                <tr>
                                    <th>DMI</th>
                                    <td><input name="DMI"/><input name="DMI"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                    <th>MTM</th>
                                    <td><input name="MTM"/><input name="MTM"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                </tr>
                                <tr>
                                    <th>OBV</th>
                                    <td><input name="OBV"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                    <th>PSY</th>
                                    <td><input name="PSY"/><input name="PSY"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                </tr>
                                <tr>
                                    <th>BOLL</th>
                                    <td><input name="BOLL"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                    <th>TREND</th>
                                    <td><input name="TREND"/><input name="TREND"/></td>
                                    <td><button className="chart_str_default">默认值</button></td>
                                </tr>
                                </tbody>
                            </table>
                            <div id="close_settings"><a className="chart_str_close">关闭</a></div>
                        </div>
                        <div id="chart_loading" className="chart_str_loading">正在读取数据...</div>
                    </div>
                    <div style={{display: "none"}} id="chart_language_switch_tmp">
                        <span name="chart_str_period" zh_tw="週期" zh_cn="周期" en_us="TIME"></span>
                        <span name="chart_str_period_line" zh_tw="分時" zh_cn="分时" en_us="Line"></span>
                        <span name="chart_str_period_1m" zh_tw="1分鐘" zh_cn="1分钟" en_us="1m"></span>
                        <span name="chart_str_period_3m" zh_tw="3分鐘" zh_cn="3分钟" en_us="3m"></span>
                        <span name="chart_str_period_5m" zh_tw="5分鐘" zh_cn="5分钟" en_us="5m"></span>
                        <span name="chart_str_period_15m" zh_tw="15分鐘" zh_cn="15分钟" en_us="15m"></span>
                        <span name="chart_str_period_30m" zh_tw="30分鐘" zh_cn="30分钟" en_us="30m"></span>
                        <span name="chart_str_period_1h" zh_tw="1小時" zh_cn="1小时" en_us="1h"></span>
                        <span name="chart_str_period_2h" zh_tw="2小時" zh_cn="2小时" en_us="2h"></span>
                        <span name="chart_str_period_4h" zh_tw="4小時" zh_cn="4小时" en_us="4h"></span>
                        <span name="chart_str_period_6h" zh_tw="6小時" zh_cn="6小时" en_us="6h"></span>
                        <span name="chart_str_period_12h" zh_tw="12小時" zh_cn="12小时" en_us="12h"></span>
                        <span name="chart_str_period_1d" zh_tw="日線" zh_cn="日线" en_us="1d"></span>
                        <span name="chart_str_period_3d" zh_tw="3日" zh_cn="3日" en_us="3d"></span>
                        <span name="chart_str_period_1w" zh_tw="周線" zh_cn="周线" en_us="1w"></span>
                        <span name="chart_str_settings" zh_tw="更多" zh_cn="更多" en_us="MORE"></span>
                        <span name="chart_setting_main_indicator" zh_tw="均線設置" zh_cn="均线设置" en_us="Main Indicator"></span>
                        <span name="chart_setting_main_indicator_none" zh_tw="關閉均線" zh_cn="关闭均线" en_us="None"></span>
                        <span name="chart_setting_indicator_parameters" zh_tw="指標參數設置" zh_cn="指标参数设置" en_us="Indicator Parameters"></span>
                        <span name="chart_str_chart_style" zh_tw="主圖樣式" zh_cn="主图样式" en_us="Chart Style"></span>
                        <span name="chart_str_main_indicator" zh_tw="主指標" zh_cn="主指标" en_us="Main Indicator"></span>
                        <span name="chart_str_indicator" zh_tw="技術指標" zh_cn="技术指标" en_us="Indicator"></span>
                        <span name="chart_str_indicator_cap" zh_tw="技術指標" zh_cn="技术指标" en_us="INDICATOR"></span>
                        <span name="chart_str_tools" zh_tw="畫線工具" zh_cn="画线工具" en_us="Tools"></span>
                        <span name="chart_str_tools_cap" zh_tw="畫線工具" zh_cn="画线工具" en_us="TOOLS"></span>
                        <span name="chart_str_theme" zh_tw="主題選擇" zh_cn="主题选择" en_us="Theme"></span>
                        <span name="chart_str_theme_cap" zh_tw="主題選擇" zh_cn="主题选择" en_us="THEME"></span>
                        <span name="chart_language_setting" zh_tw="語言(LANG)" zh_cn="语言(LANG)" en_us="LANGUAGE"></span>
                        <span name="chart_str_depth_cap" zh_tw="深度圖" zh_cn="深度图" en_us="DEPTH"></span>

                        <span name="chart_str_none" zh_tw="關閉" zh_cn="关闭" en_us="None"></span>
                        <span name="chart_str_theme_dark" zh_tw="深色主題" zh_cn="深色主题" en_us="Dark"></span>
                        <span name="chart_str_theme_light" zh_tw="淺色主題" zh_cn="浅色主题" en_us="Light"></span>
                        <span name="chart_str_on" zh_tw="開啟" zh_cn="开启" en_us="On"></span>
                        <span name="chart_str_off" zh_tw="關閉" zh_cn="关闭" en_us="Off"></span>
                        <span name="chart_str_close" zh_tw="關閉" zh_cn="关闭" en_us="CLOSE"></span>
                        <span name="chart_str_default" zh_tw="默認值" zh_cn="默认值" en_us="default"></span>
                        <span name="chart_str_loading" zh_tw="正在讀取數據..." zh_cn="正在读取数据..." en_us="Loading..."></span>
                        <span name="chart_str_indicator_parameters" zh_tw="指標參數設置" zh_cn="指标参数设置" en_us="Indicator Parameters"></span>
                        <span name="chart_str_cursor" zh_tw="光標" zh_cn="光标" en_us="Cursor"></span>
                        <span name="chart_str_cross_cursor" zh_tw="十字光標" zh_cn="十字光标" en_us="Cross Cursor"></span>
                        <span name="chart_str_seg_line" zh_tw="線段" zh_cn="线段" en_us="Trend Line"></span>
                        <span name="chart_str_straight_line" zh_tw="直線" zh_cn="直线" en_us="Extended"></span>
                        <span name="chart_str_ray_line" zh_tw="射線" zh_cn="射线" en_us="Ray"></span>
                        <span name="chart_str_arrow_line" zh_tw="箭頭" zh_cn="箭头" en_us="Arrow"></span>
                        <span name="chart_str_horz_seg_line" zh_tw="水平線段" zh_cn="水平线段" en_us="Horizontal Line"></span>
                        <span name="chart_str_horz_straight_line" zh_tw="水平直線" zh_cn="水平直线" en_us="Horizontal Extended"></span>
                        <span name="chart_str_horz_ray_line" zh_tw="水平射線" zh_cn="水平射线" en_us="Horizontal Ray"></span>
                        <span name="chart_str_vert_straight_line" zh_tw="垂直直線" zh_cn="垂直直线" en_us="Vertical Extended"></span>
                        <span name="chart_str_price_line" zh_tw="價格線" zh_cn="价格线" en_us="Price Line"></span>
                        <span name="chart_str_tri_parallel_line" zh_tw="價格通道線" zh_cn="价格通道线" en_us="Parallel Channel"></span>
                        <span name="chart_str_bi_parallel_line" zh_tw="平行直線" zh_cn="平行直线" en_us="Parallel Lines"></span>
                        <span name="chart_str_bi_parallel_ray" zh_tw="平行射線" zh_cn="平行射线" en_us="Parallel Rays"></span>
                        <span name="chart_str_fib_retrace" zh_tw="斐波納契回調" zh_cn="斐波纳契回调" en_us="Fibonacci Retracements"></span>
                        <span name="chart_str_fib_fans" zh_tw="斐波納契扇形" zh_cn="斐波纳契扇形" en_us="Fibonacci Fans"></span>
                        <span name="chart_str_clear_all" zh_tw="清除全部" zh_cn="清除全部" en_us="Clear All"></span>
                    </div>
                </div>
            </div>
        );
    }

}

export default ReactKline;
