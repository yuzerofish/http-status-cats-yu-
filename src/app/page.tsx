"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, LayoutGridIcon, LayoutListIcon } from 'lucide-react'

interface HttpStatus {
  code: number;
  description: string;
  geekDescription: string;
}

const httpStatuses: HttpStatus[] = [
  { code: 100, description: "Continue", geekDescription: "就像你第一次约会，对方说'继续'，但你还是不确定要不要牵手。" },
  { code: 101, description: "Switching Protocols", geekDescription: "从 HTTP 切换到 HTTPS，就像从自行车换成电动车，突然感觉高大上了。" },
  { code: 200, description: "OK", geekDescription: "一切正常，就像你终于在 Stack Overflow 找到了完美答案，而且还不是过时的。" },
  { code: 201, description: "Created", geekDescription: "新建成功，就像你第一次用 Git 成功 push 代码，没有冲突，简直是奇迹。" },
  { code: 204, description: "No Content", geekDescription: "没有内容，就像你打开微信朋友圈，发现一片祥和，没人秀恩爱。" },
  { code: 301, description: "Moved Permanently", geekDescription: "永久移动，就像你终于下定决心把所有代码从 SVN 迁移到 Git。" },
  { code: 302, description: "Found", geekDescription: "临时跳转，就像你在 Google 搜索编程问题，被重定向到某个印度大神的博客。" },
  { code: 400, description: "Bad Request", geekDescription: "错误请求，就像你给 AI 下达了矛盾的指令，让它既要创新又要保守。" },
  { code: 401, description: "Unauthorized", geekDescription: "未经授权，就像你试图访问公司的薪资数据库，结果发现自己只有查看广告牌的权限。" },
  { code: 403, description: "Forbidden", geekDescription: "禁止访问，就像你想看源代码，但遇到了 'on error resume next'。" },
  { code: 404, description: "Not Found", geekDescription: "未找到，就像你在代码里搜索 bug，结果发现 bug 在你的逻辑里。" },
  { code: 500, description: "Internal Server Error", geekDescription: "服务器内部错误，就像你的大脑在被问及'你到底喜欢谁'时突然宕机。" },
  { code: 502, description: "Bad Gateway", geekDescription: "错误网关，就像你试图用 Excel 处理 Big Data，结果电脑直接罢工。" },
  { code: 503, description: "Service Unavailable", geekDescription: "服务不可用，就像你准备通宵写代码，结果发现咖啡机坏了。" },
]

const categories = [
  { value: "1xx", label: "1xx - 信息响应" },
  { value: "2xx", label: "2xx - 成功响应" },
  { value: "3xx", label: "3xx - 重定向" },
  { value: "4xx", label: "4xx - 客户端错误" },
  { value: "5xx", label: "5xx - 服务器错误" },
]

export default function Home() {
  const [filter, setFilter] = useState('')
  const [activeTab, setActiveTab] = useState('1xx')
  const [layout, setLayout] = useState<'grid' | 'large'>('grid')
  const [currentIndex, setCurrentIndex] = useState(0)

  const filteredStatuses = httpStatuses.filter(status => 
    status.code.toString().includes(filter)
  )

  useEffect(() => {
    const newIndex = filteredStatuses.findIndex(status => status.code.toString().startsWith(activeTab[0]))
    setCurrentIndex(newIndex >= 0 ? newIndex : 0)
  }, [activeTab, filter])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : filteredStatuses.length - 1
      const newActiveTab = `${Math.floor(filteredStatuses[newIndex].code / 100)}xx`
      setActiveTab(newActiveTab)
      return newIndex
    })
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex < filteredStatuses.length - 1 ? prevIndex + 1 : 0
      const newActiveTab = `${Math.floor(filteredStatuses[newIndex].code / 100)}xx`
      setActiveTab(newActiveTab)
      return newIndex
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-bold mb-8 text-center text-gray-900">HTTP 状态猫咪秀</h1>
      <div className="flex justify-between items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow">
          <TabsList className="grid w-full grid-cols-5 bg-white rounded-full shadow-md p-1">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.value} 
                value={category.value}
                className="rounded-full text-sm font-medium transition-colors"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setLayout(layout === 'grid' ? 'large' : 'grid')}
          className="ml-4 rounded-full"
        >
          {layout === 'grid' ? <LayoutListIcon /> : <LayoutGridIcon />}
        </Button>
      </div>
      <Input
        type="text"
        placeholder="搜索状态码..."
        value={filter}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
        className="mb-6 rounded-full bg-white shadow-md"
      />
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStatuses.map((status, index) => (
            <div
              key={status.code}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => {
                setLayout('large')
                setCurrentIndex(index)
                setActiveTab(`${Math.floor(status.code / 100)}xx`)
              }}
            >
              <Image
                src={`https://http.cat/${status.code}`}
                alt={`HTTP 状态 ${status.code}`}
                width={300}
                height={300}
                className="rounded-xl mb-4"
              />
              <h2 className="text-3xl font-bold mb-2 text-gray-900">{status.code}</h2>
              <p className="text-gray-600 mb-2">{status.description}</p>
              <p className="text-sm text-gray-500 italic">{status.geekDescription}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="bg-white p-8 rounded-3xl shadow-lg max-w-3xl w-full relative">
            <Button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full"
            >
              <ChevronLeftIcon />
            </Button>
            <Image
              src={`https://http.cat/${filteredStatuses[currentIndex].code}`}
              alt={`HTTP 状态 ${filteredStatuses[currentIndex].code}`}
              width={600}
              height={600}
              className="rounded-2xl mb-6"
            />
            <Button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full"
            >
              <ChevronRightIcon />
            </Button>
            <h2 className="text-4xl font-bold mb-3 text-gray-900">{filteredStatuses[currentIndex].code}</h2>
            <p className="text-xl text-gray-600 mb-3">{filteredStatuses[currentIndex].description}</p>
            <p className="text-base text-gray-500 italic">{filteredStatuses[currentIndex].geekDescription}</p>
          </div>
        </div>
      )}
      <div className="mt-10 overflow-x-auto">
        <div className="flex space-x-4 pb-4">
          {httpStatuses.map((status, index) => (
            <div
              key={status.code}
              className={`relative ${
                layout === 'large' && filteredStatuses[currentIndex].code === status.code ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Image
                src={`https://http.cat/${status.code}`}
                alt={`HTTP 状态 ${status.code}`}
                width={80}
                height={80}
                className="rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  const newIndex = filteredStatuses.findIndex(s => s.code === status.code)
                  if (newIndex !== -1) {
                    setCurrentIndex(newIndex)
                    setLayout('large')
                    setActiveTab(`${Math.floor(status.code / 100)}xx`)
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}