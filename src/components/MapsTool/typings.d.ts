/**
 * @description 地图工具组件的数据类型
 * @author jmm
 * @email 1229961908@qq.com
 * @creatTime  2023/6/8
 */
declare namespace API {
    type MapsToolProps = {
        /** 渲染地图的容器 */
        id:string;
        /** 地图模式 */
        mode?:string;
        /** 加载地图完成 */
        onloadMapComplete:(map:any)=>void
    };
    type ModeItem = {
        label:string;
        value:string;
        mapKey?:string;
        projection?:string;
        baseLayerOption:{
            urlTemplate:string;
            [propName:string]:any;
        }
    }
}
