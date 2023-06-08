/**
 * @description 地图工具组件
 * @author jmm
 * @email 1229961908@qq.com
 * @creatTime  2023/6/8
 */
import {Map, TileLayer} from 'maptalks'
import styles from './index.less';
import {useEffect, useState} from "react";
import {useModel} from "@umijs/max";

const MapsTool = (props: API.MapsToolProps) => {
    const {id = 'mapContainer'} = props || {};
    const {currentMap, switchMapList} = useModel('mapMode');
    const [mapObj, setMapObj] = useState();
    /**
     * 初始化创建地图
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
    useEffect(() => {
        if (currentMap) {
            let selectedMode: API.ModeItem = switchMapList.find(item => item?.value === currentMap);
            initCreateMap(selectedMode || switchMapList[0]);
        }
    }, [currentMap])
    useEffect(() => {
        if (mapObj) {
            props?.onloadMapComplete?.(mapObj);
        }
    }, [mapObj])
    return <div id={id} className={styles.mapsTool}></div>
}
export default MapsTool;
