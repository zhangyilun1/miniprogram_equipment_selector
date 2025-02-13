import { View, Text, Button, Form, Input, Picker } from '@tarojs/components'
import { useLoad, showToast,navigateTo, setStorageSync} from '@tarojs/taro'

import './index.scss'
import { createOpenAI } from '../../utils/openai'

import React, { useState } from 'react';

interface ValidationState {
  length: boolean;
  width: boolean;
  height: boolean;
  stuff_name: boolean;
  stuff_quality: boolean;
  begin_temp: boolean;
  aim_temp: boolean;
  consuming_time: boolean;
  location: boolean;
  device_type: boolean;
}

interface FormData {
  length: string;
  width: string;
  height: string;
  stuff_name: string;
  stuff_quality: string;
  begin_temp: string;
  aim_temp: string;
  consuming_time: string;
  location: string;
  device_type: string;
}

interface Response {
  choices: Array<{
    message: {
      content: string;
    }
  }>;
}

interface Process {
  conversation: string,
  result: string
}

export default function Index() {

  const apiKey = 'sk-Fv9HhUQCNj8e3hIg5IryIIowlVREnxn74XGBZWcoUiSR9tTJ';
  const openai = createOpenAI(apiKey);

  const [validation, setValidation] = useState<ValidationState>({
    length: true,
    width: true,
    height: true,
    stuff_name: true,
    stuff_quality: true,
    begin_temp: true,
    aim_temp: true,
    consuming_time: true,
    location: true,
    device_type: true
  });

  const [formData, setFormData] = useState<FormData>({
    length: '',
    width: '',
    height: '',
    stuff_name: '',
    stuff_quality: '',
    begin_temp: '',
    aim_temp: '',
    consuming_time: '',
    location: '',
    device_type: ''
  });


  
  const [process, setProcess] = useState<Process>({
    conversation:'',
    result: ''
  });

  const updateProcess = (fieldName: string, value: any) => {
    setProcess(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleInputClick = (e: any) => {
    console.log(e);
  }

  const handleInputChange = (e: any, fieldName: string) => {
    const value = e.detail.value;
    console.log("Input change:", fieldName, value);

    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    setValidation(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };


  const deviceType = {
    selector: ['铝排', '风机'],
  }

  const [selectedDeviceType, setSelectedDeviceType] = useState<string>("");

  const deviceTypeOnchange = (e) => {
    const index = e.detail.value;
    setSelectedDeviceType(deviceType.selector[index]);
    setFormData(prev => ({
      ...prev,
      'device_type': deviceType.selector[index]
    }));
  }

  const generatePrompt = (formData) =>{
    var type_sentence;
    if(formData.device_type == '铝排'){
      type_sentence = '所需铝排长度'
    }else if(formData.device_type == '风机') {
      type_sentence = '所需铝排长度'
    }
    return `请根据以下冷库参数进行设备选型计算：
  1. 冷库尺寸：长${formData.length}米 × 宽${formData.width}米 × 高${formData.height}米
  2. 储存物品：${formData.stuff_name}，数量${formData.stuff_quality}kg
  3. 温度要求：从${formData.begin_temp}°C降至${formData.aim_temp}°C，时间${formData.consuming_time}小时
  4. 地理位置：${formData.location}
  5. 制冷设备类型：${formData.device_type}

  请计算并提供：
  1. 冷库体积
  2. 物品总热量
  3. 所需压缩机机组大小
  4. 匹配的冷凝器大小
  5. ${type_sentence}
  `
  }



  const formSubmit = async (e) => {

    console.log(" === submit form ===")
    // 创建新的验证状态
    const newValidation = {
      length: !!formData.length,
      width: !!formData.width,
      height: !!formData.height,
      stuff_name: !!formData.stuff_name,
      stuff_quality: !!formData.stuff_quality,
      begin_temp: !!formData.begin_temp,
      aim_temp: !!formData.aim_temp,
      consuming_time: !!formData.consuming_time,
      location: !!formData.location,
      device_type: !!formData.device_type
    };
    console.log("newValidation: ", newValidation);
    setValidation(newValidation);

    // 检查是否所有字段都已填写
    const hasEmptyFields = Object.values(newValidation).some(valid => !valid);

    console.log("hasEmptyFields : ", hasEmptyFields)

    // if (hasEmptyFields) {
    //   showToast({
    //     title: '请填写完整所有信息',
    //     icon: 'none',
    //     duration: 200000
    //   });
    //   return;
    // }

    console.log("form submit", formData);
   
    try {
      const conversation = generatePrompt(formData);
      //updateProcess('conversation', conversation);
      // console.log("conversation", conversation);
      // setStorageSync('conversasion', conversation);
      const messages = [
        { role: 'user', content: conversation }
      ];
      console.log("messages :", messages);
      const completion = await openai.chatCompletion(messages) as Response;
      console.log("completion :", completion);
      const content = completion.choices[0].message.content;
      // console.log("content :", content);
      //updateProcess('result', content);
      setStorageSync('result', content);
      setStorageSync('conversation', conversation);
    } catch (error) {
      if (error instanceof Error) {
        showToast({
          title: error.message,
          icon: 'none'
        });
      }
    }
    console.log("navigateTo === >");




    navigateTo({
      url: '/pages/result/result', // 替换为目标页面的路径
      fail: (err) => {
        console.error('Navigation failed:', err);
        showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
      // success: function () {
      //   // console.log("process result : " , process.result);
      //   // console.log("process conversation : " , process.conversation);
      //   // setStorageSync('result',1); // 可以通过本地存储传递复杂数据
      //   // setStorageSync('conversation', 2);
      // }
    });

  }

  const formReset = (e) => {
    console.log(e)
  }

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className="container mx-auto">
      <Text className="text-lg font-bold">请提供以下数据用于计算：</Text>
      <Form onSubmit={formSubmit} onReset={formReset} className="p-4">
        <View className='border-4 border-indigo-600 m-4 p-4 rounded-lg shadow-2xl' >
          <Text className="text-left text-base font-bold">冷库尺寸：</Text>
          <View className="flex items-center my-1">
            <Text className="w-1/3 mr-2">长度：</Text>
            <View className="flex items-center w-2/3">
              <Input
                type="number"
                name="length"
                value={formData.length}
                onInput={(e) => handleInputChange(e, 'length')}  // 直接传入字段名
                placeholder="请输入长度"
                className={`pl-4 border-solid border-4 rounded w-full ${validation.length ? 'border-gray-500' : 'border-red-500'
              }`}
              />
              <Text className="ml-2 mr-2">米</Text>
            </View>
          </View>
          <View className="flex items-center my-1">
            <Text className="w-1/3 mr-2 ">宽度：</Text>
            <View className="flex items-center w-2/3">
              <Input
                type="number"
                name="width"
                value={formData.width}
                // onInput={handleInputChange}
                onInput={(e) => handleInputChange(e, 'width')}
                placeholder="请输入宽度"
                className={`pl-4 border-solid border-4 rounded w-full ${validation.width ? 'border-gray-500' : 'border-red-500'
              }`}
              />
              <Text className="ml-2 mr-2">米</Text>
            </View>
          </View>
          <View className="flex items-center my-1">
            <Text className="w-1/3 mr-2 ">高度：</Text>
            <View className="flex items-center w-2/3">
              <Input
                type="digit"
                name="height"
                value={formData.height}
                //onInput={handleInputChange}
                onInput={(e) => handleInputChange(e, 'height')}
                placeholder="请输入高度"
                className={`pl-4 border-solid border-4 rounded w-full ${validation.height ? 'border-gray-500' : 'border-red-500'
              }`}
              />
              <Text className="ml-2 mr-2">米</Text>
            </View>
          </View>
        </View>


        <View className='border-4 border-indigo-600 m-4 p-4 rounded-lg shadow-2xl' >
          <Text className="text-left text-base font-bold">所存物品信息：</Text>
          <View className="flex items-center my-2">
            <Text className="w-1/3 mr-2 whitespace-nowrap">物品名称：</Text>
            <View className="flex items-center w-2/3">
              <Input
                type="text"
                name="stuff_name"
                value={formData.stuff_name}
                onInput={(e) => handleInputChange(e, 'stuff_name')}
                // onInput={handleInputChange}
                className={`w-1/3 pl-4 border-solid border-4 rounded  ${validation.stuff_name ? 'border-gray-500' : 'border-red-500'
              }`}
              />
            </View>
          </View>
          <View className="flex items-center my-2">
            <Text className="w-1/3 mr-2">数量：</Text>
            <View className="flex items-center w-2/3">
              <Input
                type="number"
                name="stuff_quality"
                value={formData.stuff_quality}
                onInput={(e) => handleInputChange(e, 'stuff_quality')}
                //onInput={handleInputChange}
                placeholder="请输入物品数量"
                className={`pl-4 border-solid border-4 rounded w-full ${validation.stuff_quality ? 'border-gray-500' : 'border-red-500'
              }`}
              />
              <Text className="ml-2 flex-shrink-0">千克</Text>
            </View>
          </View>
        </View>


        <View className='border-4 border-indigo-600 m-4 p-4 rounded-lg shadow-2xl' >
          <Text className="text-left text-base font-bold">温度需求：</Text>
          <View className="flex items-center my-1">
            <Text className="w-1/3 mr-2 ">起始温度：</Text>
            <View className="flex items-center w-2/3">
              <Input
                type="number"
                name="begin_temp"
                value={formData.begin_temp}
                onInput={(e) => handleInputChange(e, 'begin_temp')}
                //onInput={handleInputChange}
                placeholder="请输入起始温度"
                className={`pl-4 border-solid border-4 rounded w-full ${validation.begin_temp ? 'border-gray-500' : 'border-red-500'
                  }`}
              />
              <Text className="ml-2 flex-shrink-0">摄氏度</Text>
            </View>
          </View>
          <View className="flex items-center my-2">
            <Text className="w-1/3 mr-2 whitespace-nowrap">目标温度：</Text>
            <View className="flex items-center w-2/3">
              <Input
                type="number"
                name="aim_temp"
                value={formData.aim_temp}
                onInput={(e) => handleInputChange(e, 'aim_temp')}
                placeholder="请输入目标温度"
                className={`pl-4 border-solid border-4 rounded w-full ${validation.aim_temp ? 'border-gray-500' : 'border-red-500'
                  }`}
              />
              <Text className="ml-2 flex-shrink-0">摄氏度</Text>
            </View>
          </View>
          <View className="flex items-center my-2">
            <Text className="w-1/3 mr-2">降温耗时：</Text>
            <View className="flex items-center w-2/3">
              <Input
                type="number"
                name="consuming_time"
                value={formData.consuming_time}
                onInput={(e) => handleInputChange(e, 'consuming_time')}
                placeholder="请输入预计耗时"
                className={`pl-4 border-solid border-4 rounded w-full ${validation.consuming_time ? 'border-gray-500' : 'border-red-500'
                  }`}
              />
              <Text className="ml-2 flex-shrink-0">小时</Text>
            </View>
          </View>
        </View>





        <View className='border-4 border-indigo-600 m-4 p-4 rounded-lg shadow-2xl' >
          <Text className="text-left text-base font-bold">预设地：</Text>
          <View className="flex items-center my-1">
            <Text className="w-1/3 mr-2 ">设备位置：</Text>
            <View className="flex items-center w-2/3">
              <Input
                type="text"
                name="location"
                value={formData.location}
                onInput={(e) => handleInputChange(e, 'location')}
                onClick={handleInputClick}
                className={`w-1/3 pl-4 border-solid border-4 rounded  ${validation.location ? 'border-gray-500' : 'border-red-500'
                  }`}
              />
              <Text className="ml-2 flex-shrink-0">省</Text>
            </View>
          </View>
        </View>


        <View className='border-4 border-indigo-600 m-4 p-4 rounded-lg shadow-2xl' >
          <Text className="text-left text-base font-bold">制冷机类型：</Text>
          <View className="flex items-center my-1">
            <Text className="w-1/3 mr-2 ">选择类型：</Text>
            <View className="flex items-center w-2/3">
              <Picker mode='selector' range={deviceType.selector} onChange={deviceTypeOnchange} className="w-full border-2 border-gray-500 rounded-md" >
                <View className={`pl-4 border-solid border-4 rounded w-full ${validation.device_type ? 'border-gray-500' : 'border-red-500'
                  }`}>
                  <Text className="text-gray-500">{selectedDeviceType || "请选择制冷机类型"}</Text>
                </View>
              </Picker>
            </View>
          </View>
        </View>

        <Button className="bg-indigo-600 text-white m-4 p-2"
          hoverClass="bg-green-500"
          formType="submit">
          提交计算
        </Button>
      </Form>
    </View>
  )
}
