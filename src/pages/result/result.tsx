import { Text, View, Button } from '@tarojs/components'


export default function Result() {
    return (
        <View className='container mx-auto '>
           <View className='border-4 border-indigo-600 m-4 p-4 rounded-lg shadow-2xl bg-white relative'>
                <View className='absolute top-0 right-0 w-4 h-4 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-indigo-600' />
                    <Text className='text-lg font-bold mb-2'>用户输入：</Text>
                    <View className='space-y-2'>
                        
                    </View>
                </View>
                <View className='border-4 border-green-600 m-4 p-4 rounded-lg shadow-2xl bg-white relative'>
                    {/* 添加一个小箭头指示这是系统的回答 */}
                    <View className='absolute top-0 left-0 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 rotate-45 bg-green-600' />
                    <Text className='text-lg font-bold mb-2'>计算结果：</Text>
                    <View className='space-y-2'>
                        <Text>建议制冷设备:XX型号</Text>
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