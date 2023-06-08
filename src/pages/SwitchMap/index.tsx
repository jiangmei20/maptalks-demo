/**
 * @description 地图切换
 * @author jmm
 * @email
 * @creatTime  2023/6/8
 */
import MapsTool from "@/components/MapsTool";
import styles from './index.less'
import {useEffect, useState} from "react";
import { useModel } from '@umijs/max';
import {Select} from 'antd';

const SwitchMap=()=>{
    const {currentMap,setCurrent,switchMapList} = useModel('mapMode');
    const [map,setMap]=useState<any>();
    useEffect(()=>{
        console.log('=======当前选择的地图',currentMap)
        console.log('=======切换地图列表',switchMapList)
    },[currentMap])
    const handleChange = (value: string) =>{
        map?.remove?.();
        setCurrent(value);
    }
    const onloadMapComplete = (mapObj:any)=>{
        setMap(mapObj);
    }
    return (
        <div className={styles.switchMap}>
            <div className={styles.switchMapMenu}>
                <Select
                    defaultValue={currentMap}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={switchMapList}
                />
            </div>
            <MapsTool
                id={'mapId'}
                onloadMapComplete={onloadMapComplete}
            />
        </div>
    )
}
export default SwitchMap;
