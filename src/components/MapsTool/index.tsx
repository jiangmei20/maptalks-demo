/**
 * @description 地图工具组件
 * @author jmm
 * @email 1229961908@qq.com
 * @creatTime  2023/6/8
 */
import {Map, TileLayer, VectorLayer, DrawTool, control, GeoJSON} from 'maptalks';
import 'maptalks/dist/maptalks.css';
import styles from './index.less';
import {useEffect, useState, useRef} from 'react';
import {useModel} from '@umijs/max';
import {queryDistrict} from "@/services/mapsTool";

const MapsTool = (props: API.MapsToolProps) => {
    const {id = 'mapContainer'} = props || {};
    const {currentMap, switchMapList} = useModel('mapMode');
    const mapDOMRef = useRef<any>();
    // 当前绘制图形工具
    const drawToolLayerRef = useRef<any>();
    const drawToolRef = useRef<any>();
    const [mapObj, setMapObj] = useState();
    /**
     * 初始化创建地图
     * @param selectedMode 选择的地图模式
     */
    const initCreateMap = (selectedMode: API.ModeItem) => {
        const {baseLayerOption} = selectedMode || {}
        let config = {
            center: [105.08052356963802, 36.04231948670001],
            zoom: 5,
            minZoom: 1,
            maxZoom: 19,
            baseLayer: new TileLayer('base', baseLayerOption)
        }
        if (selectedMode?.projection) {
            config = {
                ...config,
                spatialReference: {
                    projection: selectedMode.projection
                },
            }
        }
        const map = new Map(id, config);
        setMapObj(map);
    }
    /**
     * 清除自定义变量
     */
    const clearDrawTool =()=>{
        drawToolLayerRef.current?.clear();
        drawToolLayerRef.current= undefined;
        drawToolRef.current?.remove();
        drawToolRef.current= undefined;
    }
    /**
     * 图层添加右键菜单
     * @param geometry 图层数据
     * @param layer 图层
     */
    const graphicRightMenu=(geometry:any,layer:any)=>{
        const options = {
            'items'  : [
                {
                    item: '图形编辑',
                    click: ()=> {
                        geometry?.startEdit();
                    }
                },
                '-',
                {item: '清除图形', click: function () { layer.clear(); }}
            ]
        };
        geometry.setMenu(options);
        geometry.on('contextmenu', function (e) {
            geometry.openMenu(e.coordinate);
        });
        geometry.on('handledragend',function (param){
            console.log('======编辑或移动图形后的数据',param);
        })
    }
    /**
     * 创建绘制工具
     * @param map 地图初始化完成后的地图数据
     */
    const createDrawTool = (map) => {
        /**
         * 画图
         * @param type 图的类型
         */
        const draw=(type:string)=>{
            clearDrawTool();
            const layer = new VectorLayer('vector').addTo(map);
            const drawTool = new DrawTool({
                mode: type||'Point',
                symbol : {
                    'lineColor' : '#ff0000',
                    'lineWidth' : 3,
                    'polygonFill' : '#ff0000',
                    'polygonOpacity' : 0.5
                },
            }).addTo(map).enable();

            drawTool.on('drawend', function (param) {
                const {geometry} = param||{};
                console.log('======绘制图形完成',geometry);
                layer.addGeometry(geometry);
                drawTool?.disable();
                if(geometry){
                    graphicRightMenu(geometry,layer);
                }
            });
            drawToolLayerRef.current= layer;
            drawToolRef.current= drawTool;
        }

        let items = [
            // {label:'点',value:'Point'},
            'Point', 'LineString', 'Polygon', 'Circle', 'Ellipse', 'Rectangle', 'FreeHandLineString', 'FreeHandPolygon'].map(function (value) {
            return {
                item: value,
                click: function () {
                    draw(value)
                }
            };
        });

        new control.Toolbar({
            position : 'top-left',
            items: [
                {
                    item: 'Shape',
                    children: items
                },
                {
                    item: 'Disable',
                    click: function () {
                        drawToolRef.current?.disable();
                    }
                },
                {
                    item: 'Clear',
                    click: function () {
                        drawToolLayerRef.current?.clear();
                    }
                },
                {
                    item: '行政区域',
                    click:async function (){
                        let districtData = await queryDistrict({code:'520102'});
                        const geometries = GeoJSON.toGeometry(districtData, geometry => { geometry.config('draggable', true); });
                        console.log('=========行政区域',districtData,geometries);
                        let multiPolygon  = new VectorLayer('v2', geometries).addTo(map);
                        // 自动适配区域
                        map.fitExtent(multiPolygon .getExtent(), 0)
                    }
                }
            ]
        }).addTo(map);
    }

    useEffect(() => {
        if (currentMap) {
            let selectedMode: API.ModeItem = switchMapList.find(item => item?.value === currentMap);
            initCreateMap(selectedMode || switchMapList[0]);
        }
    }, [currentMap])
    useEffect(() => {
        if (mapObj) {
            const initializedMapProps: API.InitializedMapProps = {
                mapObj,
                mapDOM: mapDOMRef.current,
                mapTools: {
                    createDrawTool,
                },
            }
            props?.onloadMapComplete?.(initializedMapProps);
        }
    }, [mapObj])
    return <div id={id} className={styles.mapsTool} ref={mapDOMRef}></div>
}
export default MapsTool;
