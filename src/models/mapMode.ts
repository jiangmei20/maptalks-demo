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
            // 投影类型Code
            projection:'baidu',
            config:{
                zIndex: 1,
                maxZoom: 18,
                minZoom: 5,
            },
            baseLayerOption:{
                // urlTemplate:'https://gss{s}.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20170927&ak=NXaC860BMSChRjVpbEyldiErCDX3nW9T.png',
                urlTemplate:'https://maponline{s}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&from=jsapi2_0',
                subdomains:[0, 1, 2, 3],
                attribution :  '&copy; <a target="_blank" href="http://map.baidu.com">百度</a>'
            },
            // 路况图层配置
            trafficLayerOption:{
                //'urlTemplate': 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl',
                urlTemplate: function(x, y, z) {
                    return 'https://its.map.baidu.com/traffic/TrafficTileService?label=web2D&v=081&smallflow=1&time=' + (new Date().getTime().toString()) + '&x=' + x + '&y=' + y + '&level=' + z;
                },
                //zoomOffset: 1,
                zIndex: 5,
                maxZoom: 18,
                minZoom: 6,
                background: false,
                spatialReference: {
                    projection: 'BAIDU'
                }
            }
        },
        {
            label:'高德地图',
            value:'AMap',
            mapKey:'',
            baseLayerOption:{
                // 地址来源于官网XYZ栅格图层，https://lbs.amap.com/demo/jsapi-v2/example/thirdlayer/custom-grid-map
                urlTemplate:'https://wprd{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7.png',
                // urlTemplate: 'https://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
                subdomains: ['01','02','03','04'],
                attribution :  '&copy; <a target="_blank" href="https://www.amap.com/">高德</a>'
            }
        },
        {
            label:'openstreetmap',
            value:'openstreetmap',
            mapKey:'',
            baseLayerOption:{
                urlTemplate:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
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
