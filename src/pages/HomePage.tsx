import React from 'react'
import { Link } from 'react-router-dom'
import { Code2, Calculator, Palette, FileText, Hash, Lock } from 'lucide-react'

const tools = [
  {
    id: 'json-viewer',
    path: '/json-viewer',
    title: 'JSON 查看器',
    description: '格式化、验证和编辑 JSON 数据',
    icon: Code2,
    category: '开发工具',
    available: true
  },
  {
    id: 'calculator',
    path: '/calculator',
    title: '计算器',
    description: '基础数学计算功能',
    icon: Calculator,
    category: '生活工具',
    available: false
  },
  {
    id: 'color-picker',
    path: '/color-picker',
    title: '颜色选择器',
    description: '选择和转换颜色格式',
    icon: Palette,
    category: '设计工具',
    available: false
  },
  {
    id: 'text-counter',
    path: '/text-counter',
    title: '文本计数器',
    description: '统计文本字符、单词数量',
    icon: FileText,
    category: '文本工具',
    available: false
  },
  {
    id: 'hash-generator',
    path: '/hash-generator',
    title: '哈希生成器',
    description: '生成各种哈希值',
    icon: Hash,
    category: '安全工具',
    available: false
  },
  {
    id: 'password-generator',
    path: '/password-generator',
    title: '密码生成器',
    description: '生成安全密码',
    icon: Lock,
    category: '安全工具',
    available: false
  }
]

const HomePage: React.FC = () => {
  const categories = Array.from(new Set(tools.map(tool => tool.category)))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Handy Tools</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          收集各种实用的小工具，让工作和生活更便捷
        </p>
      </div>

      {categories.map(category => (
        <div key={category}>
          <h2 className="text-xl font-semibold text-foreground mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools
              .filter(tool => tool.category === category)
              .map((tool) => {
                const Icon = tool.icon
                const isAvailable = tool.available

                if (isAvailable) {
                  return (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="block p-6 bg-card border rounded-lg hover:bg-accent hover:border-primary transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-8 h-8 text-primary" />
                        <div>
                          <h3 className="text-lg font-medium text-card-foreground">
                            {tool.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                } else {
                  return (
                    <div
                      key={tool.id}
                      className="p-6 bg-muted/30 border border-dashed rounded-lg opacity-60"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <h3 className="text-lg font-medium text-muted-foreground">
                            {tool.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {tool.description}
                          </p>
                          <span className="inline-block mt-2 text-xs bg-muted px-2 py-1 rounded">
                            即将上线
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
              })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default HomePage