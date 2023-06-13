/**
 * @description 画行政区域选择区域的modal
 * @author jmm
 * @email
 * @creatTime  2023/6/13
 */
import {Modal, Form, Cascader} from 'antd'
import {useEffect} from "react";
import china from '../../../../assets/js/china.json'
interface DistrictModalProps{
    isModalOpen:boolean;
    setIsModalOpen:(val:boolean)=>void;
    formData?:{
        areaCodeList?:any[];
        areaCode?:string|number;
        areaName?:string;
    };
    drawDistrict:(values:any)=>any;
}
const DistrictModal=(props:DistrictModalProps)=>{
    const [form] = Form.useForm();
    useEffect(()=>{
        if(props?.formData?.areaCode){
            form.setFieldsValue(props.formData);
        }
    },[props?.formData])
    const handleOk=()=>{
        let data=form.getFieldsValue();
        const {areaCodeList} = data||{};
        if(areaCodeList?.length){
           data={
               ...data,
               areaCode:areaCodeList[areaCodeList.length-1],
            }
        }
        props?.drawDistrict(data);
    }
    const handleCancel=()=>{
        props?.setIsModalOpen(false);
    }
    return (
        <Modal
            title={props?.formData?.areaCode?'编辑行政区域':'绘制行政区域'}
            open={props?.isModalOpen} onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form form={form}>
                <Form.Item name={'areaCodeList'} label={'行政区域'}>
                    <Cascader options={china} changeOnSelect />
                </Form.Item>

            </Form>
        </Modal>
    )
}
export default DistrictModal;
