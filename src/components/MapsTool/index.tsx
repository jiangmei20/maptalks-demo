/**
 * @description 地图工具组件
 * @author jmm
 * @email 1229961908@qq.com
 * @creatTime  2023/6/8
 */
import {Map, TileLayer, VectorLayer,GroupTileLayer, DrawTool, Rectangle, Circle, Polygon, control, GeoJSON} from 'maptalks';
import 'maptalks/dist/maptalks.css';
import styles from './index.less';
import {useEffect, useState, useRef} from 'react';
import {useModel} from '@umijs/max';
import {queryDistrict} from "@/services/mapsTool";
import DistrictModal from "@/components/MapsTool/components/DistrictModal";
import {message} from "antd";

const MapsTool = (props: API.MapsToolProps) => {
    const {id = 'mapContainer', mapConfig = {}} = props || {};
    const {currentMap, switchMapList} = useModel('mapMode');
    const [isModalOpen,setIsModalOpen] =useState(false);
    // 画图工具颜色配置
    const toolSymbol = {
        'lineColor': '#ff0000',
        'lineWidth': 3,
        'polygonFill': '#ff0000',
        'polygonOpacity': 0.5
    }
    const mapDOMRef = useRef<any>();
    // 当前绘制图形工具
    const drawToolLayerRef = useRef<any>();
    const drawToolRef = useRef<any>();
    const [mapObj, setMapObj] = useState();
    /**
     * 初始化基本地图图层
     * @param mapModeStyle 地图模式图层样式
     */
    const initBaseLayer =(mapModeStyle:any)=>{
        if(Array.isArray(mapModeStyle?.baseLayerOption)){
            let layers=mapModeStyle.map((item,index)=>{
                return new TileLayer(`base-${mapModeStyle?.value}${index}`, item);
            })
            return new GroupTileLayer('base',layers);
        }else{
            return new TileLayer(`base-${mapModeStyle?.value}`, mapModeStyle?.baseLayerOption);
        }
    }
    /**
     * 初始化创建地图
     * @param selectedMode 选择的地图模式
     */
    const initCreateMap = (selectedMode: API.ModeItem) => {
        mapObj?.remove?.();
        props?.onloadMapStart?.();
        const configParam = selectedMode?.config ? {...selectedMode.config, ...mapConfig} : {...mapConfig};
        let config = {
            center: [105.08052356963802, 36.04231948670001],
            zoom: 5,
            minZoom: 1,
            maxZoom: 19,
            baseLayer: initBaseLayer(selectedMode),
            ...configParam,
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
    const clearDrawTool = () => {
        drawToolLayerRef.current?.clear();
        drawToolLayerRef.current = undefined;
        drawToolRef.current?.remove();
        drawToolRef.current = undefined;
    }

    /**
     * 图形数据处理成回写图形的数据
     * @param geometry 图形数据
     */
    function handleGraphData(geometry:any){
        let graphParam ={}
        if(geometry && drawToolRef?.current){
            let mode= drawToolRef.current?.getMode?.();
            switch (mode){
                case 'rectangle':
                    graphParam={
                        firstCoordinate:geometry?.getFirstCoordinate?.(),
                        coordinates: geometry?.getCoordinates?.(),
                        height:geometry?.getHeight?.(),
                        width:geometry?.getWidth?.(),
                        mode,
                    }
                    break;
                case 'circle':
                    graphParam={
                        center:geometry?.getCoordinates?.(),
                        radius:geometry?.getRadius?.(),
                        mode,
                    }
                    break;
                default:
                    graphParam={
                        path:geometry?.getCoordinates?.(),
                        mode,
                    }
            }
        }
        return graphParam;
    }

    /**
     * 图形的查看或编辑
     * @param map 地图
     * @param graphData 编辑和查看图形的数据
     * @param editflag 是否是编辑
     */
    const graphViewOrEdit=(map:any,graphData:API.GraphData,editflag?:boolean)=>{
        let drawGraphLayer = map.getLayer('drawGraph');
        drawGraphLayer?.remove?.();
        let geometry:any;
        switch (graphData?.mode){
            case 'rectangle':
                geometry = new Rectangle(graphData?.firstCoordinate, graphData?.width, graphData?.height, {
                    symbol: toolSymbol
                });
                break;
            case 'circle':
                geometry = new Circle(graphData?.center, graphData?.radius, {
                    symbol: toolSymbol
                });
                break;
            case 'District':
                // 调画行政区域方法
                break;
            default:
                geometry = new Polygon(graphData?.path);
                break;
        }
        if(drawGraphLayer){
            drawGraphLayer.addGeometry(geometry);
        }else {
            drawGraphLayer = new VectorLayer('drawGraph').addGeometry(geometry).addTo(map);
            drawToolLayerRef.current = drawGraphLayer;
        }
        if(editflag){
            drawGraphLayer?.startEdit()
        }
    }
    /**
     * 图层添加右键菜单
     * @param geometry 图层数据
     * @param layer 图层
     * @param mode 是否是行政区域
     */
    const graphicRightMenu = (geometry: any, layer: any,mode?:string) => {
        const options = {
            'items': [
                {
                    item: '图形编辑',
                    click: () => {
                        if(mode==='district'){
                            setIsModalOpen(true);
                        }else{
                            geometry?.startEdit();
                        }

                    }
                },
                '-',
                {
                    item: '清除图形', click: function () {
                        layer.clear();
                    }
                }
            ]
        };
        geometry.setMenu(options);
        // 添加右键事件
        geometry.on('contextmenu', function (e) {
            geometry.openMenu(e.coordinate);
        });
        // 监听编辑或移动图形后的数据
        geometry.on('handledragend', function (param) {
            props?.finishDrawGraph?.(handleGraphData(param.target))
        })
    }
    /**
     * 创建绘制工具
     * @param map 地图初始化完成后的地图数据
     */
    const createDrawTool = (map) => {
        clearDrawTool();
        const layer = new VectorLayer('drawGraph').addTo(map);
        const drawTool = new DrawTool({
            mode: 'rectangle',
            symbol: toolSymbol,
        }).addTo(map).disable();

        drawTool.on('drawend', function (param) {
            const {geometry} = param || {};
            layer.addGeometry(geometry);
            drawTool?.disable();
            if (geometry) {
                graphicRightMenu(geometry, layer);
            }
            props?.finishDrawGraph?.(handleGraphData(geometry))
        });
        drawToolLayerRef.current = layer;
        drawToolRef.current = drawTool;
        /**
         * 画图
         * @param graphItem 图的类型数据
         */
        const draw = (graphItem: { label: string; value: string }) => {
            drawToolLayerRef.current?.clear();
            const {value} = graphItem || {}
            if (value === 'district') {
                setIsModalOpen(true);
            } else {
                drawToolRef.current?.setMode(value).enable();
            }

        }

        let items = [
            {label: '点', value: 'Point'},
            {label: '线', value: 'LineString'},
            {label: '多边形', value: 'Polygon'},
            {label: '圆形', value: 'Circle'},
            {label: '椭圆形', value: 'Ellipse'},
            {label: '矩形', value: 'Rectangle'},
            {label: '行政区域', value: 'district'},
        ].map(function (item) {
            return {
                item: item?.label,
                click: function () {
                    draw(item);
                }
            };
        });

        new control.Toolbar({
            position: 'top-left',
            items: [
                {
                    item: '绘制区域',
                    children: items
                },
                {
                    item: 'Disable',
                    click: function () {
                        drawToolRef.current?.disable();
                    }
                },
                {
                    item: '清除',
                    click: function () {
                        drawToolLayerRef.current?.clear('drawGraph');
                    }
                },
            ]
        }).addTo(map);
    }

    const drawDistrict=async (values:API.GraphData)=>{
        const {areaCode = '520102'} = values||{};
        console.log('======区域参数',values)
        if(mapObj){
            setIsModalOpen(false);
            let layer= mapObj.getLayer('drawGraph');
            if(layer){
                layer?.clear?.();
            }else{
                layer = new VectorLayer('drawGraph').addTo(mapObj)
            }
            let districtData = await queryDistrict({code: areaCode});
            console.log('==========区域数据',districtData)
            let geometries = GeoJSON.toGeometry(districtData, geometry => {
                geometry.config('draggable', true);
                graphicRightMenu(geometry, layer,'district');
            });
            layer.addGeometry(geometries).setStyle({'symbol': [toolSymbol]})
            // 自动适配区域
            mapObj.fitExtent(layer.getExtent(), 0)
            drawToolLayerRef.current = layer;
        }else{
            message.info('地图未加载完成...')
        }
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
                    graphViewOrEdit,
                },
            }
            props?.onloadMapComplete?.(initializedMapProps);
        }
    }, [mapObj])
    return (
        <>
            <div id={id} className={styles.mapsTool} ref={mapDOMRef}></div>
            <DistrictModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                formData={props?.graphData}
                drawDistrict={drawDistrict}
            />
        </>

    )
}
export default MapsTool;
