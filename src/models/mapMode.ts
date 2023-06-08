import {useState} from "react";

/**
 * @description 地图模式
 * @author jmm
 * @email
 * @creatTime  2023/6/8
 */
export default ()=>{
    const [currentMap,setCurrent] = useState<string>('BMap');
    const switchMapList = [
        {
            label:'百度地图',
            value:'BMap',
            mapKey:'NXaC860BMSChRjVpbEyldiErCDX3nW9T',
            projection:'baidu',
            baseLayerOption:{
                urlTemplate:'https://gss{s}.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20170927&ak=NXaC860BMSChRjVpbEyldiErCDX3nW9T.png',
                subdomains:[0, 1, 2, 3],
            }
        },
        {
            label:'高德地图',
            value:'AMap',
            mapKey:'',
            baseLayerOption:{
                urlTemplate:'http://wprd{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7.png',
                subdomains: ['01','02','03','04'],
            }
        },
        {
            label:'openstreetmap',
            value:'openstreetmap',
            mapKey:'',
            baseLayerOption:{
                urlTemplate:'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                subdomains:['a','b','c']
            }
        }
    ];
    return {
        currentMap,
        setCurrent,
        switchMapList,
    }
}