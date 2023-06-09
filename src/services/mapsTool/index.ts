/**
 * @description 地图工具接口
 * @author jmm
 * @email 1229961908@qq.com
 * @creatTime  2023/6/9
 */
import { request } from '@umijs/max';

/**
 * 获取行政区域
 * @param params 参数
 * @param options
 */
export async function queryDistrict(
    params: {
        /** 区域code */
        code: string;
    },
    options?: { [key: string]: any },
) {
    return request<any>('https://geo.datav.aliyun.com/areas_v3/bound/geojson', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}
