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
  const availableTools = tools.filter(tool => tool.available)
  const categories = Array.from(new Set(availableTools.map(tool => tool.category)))

  return (
    <div className="space-y-8">

      {categories.map(category => (
        <div key={category}>
          <h2 className="text-xl font-semibold text-foreground mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTools
              .filter(tool => tool.category === category)
              .map((tool) => {
                const Icon = tool.icon
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
              })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default HomePage