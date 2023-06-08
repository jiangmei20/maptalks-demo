import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import {useEffect} from "react";
import {Map,TileLayer,VectorLayer,Label} from 'maptalks';

const HomePage: React.FC = () => {
  useEffect(()=>{
          const map=new Map('map', {
              center: [105.08052356963802, 36.04231948670001],
              zoom: 5,
              minZoom:1,
              maxZoom:19,
              spatialReference:{
                  projection : 'baidu'
              },
              baseLayer: new TileLayer('base', {
                  'urlTemplate' : 'https://gss{s}.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20170927&ak=NXaC860BMSChRjVpbEyldiErCDX3nW9T',
                  'subdomains':[0, 1, 2, 3],
                  'attribution' :  '&copy; <a target="_blank" href="http://map.baidu.com">Baidu</a>'
              })
          });
      // let label = new Label('label without box',
      //     [105.08052356963802, 36.04231948670001],
      //     {
      //         'draggable' : true,
      //         'textSymbol': {
      //             'textFaceName' : 'monospace',
      //             'textFill' : '#34495e',
      //             'textHaloFill' : '#fff',
      //             'textHaloRadius' : 4,
      //             'textSize' : 18,
      //             'textWeight' : 'bold',
      //             'textVerticalAlignment' : 'top'
      //         }
      //     });

      let labelBox = new Label('label with box',
          [105.08052356963802, 36.04231948670001],
          {
              'draggable' : true,
              'boxStyle' : {
                  'padding' : [12, 8],
                  'verticalAlignment' : 'top',
                  'horizontalAlignment' : 'left',
                  'minWidth' : 200,
                  'minHeight' : 30,
                  'symbol' : {
                      'markerType' : 'square',
                      'markerFill' : 'rgb(135,196,240)',
                      'markerFillOpacity' : 0.9,
                      'markerLineColor' : '#34495e',
                      'markerLineWidth' : 1
                  }
              },
              'textSymbol': {
                  'textFaceName' : 'monospace',
                  'textFill' : '#34495e',
                  'textHaloFill' : '#fff',
                  'textHaloRadius' : 4,
                  'textSize' : 18,
                  'textWeight' : 'bold',
                  'textVerticalAlignment' : 'top'
              }
          });

      new VectorLayer('vector', [labelBox]).addTo(map);

  },[])
  return (
    <PageContainer ghost>
      <div className={styles.container}>
          <div id={'map'} style={{width:'100%',height:'80vh'}}></div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
