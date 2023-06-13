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
        /** 参考maptalks中创建地图的配置 */
        mapConfig?:{
            center?:[number,number];
            zoom?:number;
            [propName:string]:any;
        }
        /** 编辑图形和查看图形时传的数据 */
        graphData?: API.GraphData;
        /** 加载地图之前 */
        onloadMapStart?:()=>void;
        /** 加载地图完成 */
        onloadMapComplete?:(map:any)=>void;
        /** 绘制图形完成后 */
        finishDrawGraph?:(graphData:any)=>void;
    };
    // 编辑图形和查看图形时传的数据
    type GraphData={
        /** 矩形 */
        firstCoordinate:[number,number];
        width?:number;
        height?:number;
        /** 圆形 */
        center?:[number,number];
        radius?:number;
        /** 多边形 */
        path?:[number,number][];
        /** 行政区域 */
        areaCode:string | number;
        areaName:string;
        mode:string;
    }
    type ModeItem = {
        label:string;
        value:string;
        mapKey?:string;
        projection?:string;
        config?: {
            zIndex: number,
            maxZoom: number,
            minZoom: number,
            [propName:string]:any;
        };
        baseLayerOption:{
            urlTemplate:string;
            [propName:string]:any;
        }
    }
    type InitializedMapProps={
        mapObj:any;
        mapDOM: HTMLDivElement;
        mapTools:{
            /** 绘制图形工具 */
            createDrawTool:(map:any)=>void;
            graphViewOrEdit:(map:any,graphData:API.GraphData,editFlag:boolean)=>void
        }
    }
}
