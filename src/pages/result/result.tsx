import { Text, View, Button } from '@tarojs/components'
import { getStorageSync} from '@tarojs/taro'
import React, { useState, useEffect } from 'react'



export default function Result() {

    //语法：const [state, setState] = useState(initialState);
    // state：当前状态值
    // setState：更新状态的函数
    // initialState：初始状态值
    const [calculationResult, setCalculationResult] = useState(''); //将 result 设置到 calculationResult 状态中
    const [originalQuery, setOriginalQuery] = useState('');//将 conversation 设置到 originalQuery 状态中
    //useState('') 表示状态初始化为空字符串。此处为空字符串是为了防止在初次加载时访问未定义的值。

    useEffect(() => {
        const result = getStorageSync('result');
        const conversation = getStorageSync('conversation');
        console.log("result :" , result);

        console.log("conversation :" , conversation);
        if (result) {
          setCalculationResult(result);
        }
        
        if (conversation) {
          setOriginalQuery(conversation);
        }
      }, []); //useEffect 是一个 React Hook，它在组件渲染后执行，类似于 componentDidMount 生命周期方法（在类组件中）。
              //[] 作为依赖数组，表示 useEffect 只会在组件首次加载时执行一次（相当于只执行 componentDidMount）


    

    return (
        <View className='container mx-auto '>
           <View className='border-4 border-indigo-600 m-4 p-4 rounded-lg shadow-2xl bg-white relative'>
                <View className='absolute top-0 right-0 w-4 h-4 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-indigo-600' />
                    <Text className='text-lg font-bold mb-2'>用户输入：</Text>
                    <View className='space-y-2'>
                        <Text>
                            {originalQuery}
                        </Text>
                    </View>
                </View>
                <View className='border-4 border-green-600 m-4 p-4 rounded-lg shadow-2xl bg-white relative'>
                    {/* 添加一个小箭头指示这是系统的回答 */}
                    <View className='absolute top-0 left-0 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 rotate-45 bg-green-600' />
                    <Text className='text-lg font-bold mb-2'>计算结果：</Text>
                    <View className='space-y-2'>
                        <Text>
                            {calculationResult}
                        </Text>
                    </View>
                </View>



            <View className='p-4'>
                <Button className='bg-indigo-600 text-white m-4'
                    hoverClass="bg-green-500"
                    formType="submit">
                    修改查询
                </Button>
                <Button className='bg-indigo-600 text-white m-4'
                    hoverClass="bg-green-500"
                    formType="submit">
                    新建查询
                </Button>
            </View>

        </View>

    )

}