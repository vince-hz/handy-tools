import React, { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Copy, Check, FileText, Braces, Edit3, Eye } from 'lucide-react'

interface JsonNodeProps {
  data: any
  keyName?: string
  level: number
  isExpanded: boolean
  onToggle: () => void
  editMode: boolean
  onChange?: (path: string[], value: any) => void
  path: string[]
  expandedNodes: Set<string>
  setExpandedNodes: React.Dispatch<React.SetStateAction<Set<string>>>
}

const JsonNode: React.FC<JsonNodeProps> = ({
  data,
  keyName,
  level,
  isExpanded,
  onToggle,
  editMode,
  onChange,
  path,
  expandedNodes,
  setExpandedNodes
}) => {
  const isArray = Array.isArray(data)
  const isObject = typeof data === 'object' && data !== null && !isArray
  const hasChildren = isObject || isArray

  const getTypeColor = (value: any) => {
    if (value === null) return 'text-red-500'
    if (typeof value === 'boolean') return 'text-purple-500'
    if (typeof value === 'number') return 'text-blue-500'
    if (typeof value === 'string') return 'text-green-500'
    return 'text-gray-500'
  }

  const getValueDisplay = (value: any) => {
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    if (typeof value === 'string') return `"${value}"`
    if (typeof value === 'boolean') return value.toString()
    if (typeof value === 'number') return value.toString()
    return typeof value
  }

  const handleValueChange = (newValue: string) => {
    if (!onChange || !path.length) return

    try {
      // 尝试解析新值
      let parsedValue: any = newValue
      if (newValue.startsWith('"') && newValue.endsWith('"')) {
        parsedValue = newValue.slice(1, -1)
      } else if (newValue === 'true') {
        parsedValue = true
      } else if (newValue === 'false') {
        parsedValue = false
      } else if (newValue === 'null') {
        parsedValue = null
      } else if (!isNaN(Number(newValue)) && newValue !== '') {
        parsedValue = Number(newValue)
      }

      onChange(path, parsedValue)
    } catch (error) {
      // 如果解析失败，作为字符串处理
      onChange(path, newValue)
    }
  }

  
  if (!hasChildren) {
    return (
      <div className="flex items-center py-0.5" style={{ paddingLeft: `${level * 20}px` }}>
        {keyName && (
          <>
            <span className="text-blue-600 dark:text-blue-400 font-medium">{keyName}:</span>
            <span className="mx-2">:</span>
          </>
        )}
        {editMode ? (
          <input
            type="text"
            value={data === null ? 'null' : data === undefined ? 'undefined' : String(data)}
            onChange={(e) => handleValueChange(e.target.value)}
            className="px-1 py-0 text-sm border rounded bg-background"
            style={{ outline: 'none' }}
          />
        ) : (
          <span className={getTypeColor(data)}>
            {getValueDisplay(data)}
          </span>
        )}
      </div>
    )
  }

  const entries = Object.entries(data)

  return (
    <div>
      <div
        className="flex items-center py-0.5 cursor-pointer hover:bg-muted/50 rounded"
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={onToggle}
      >
        <span className="mr-1">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </span>
        {keyName && (
          <>
            <span className="text-blue-600 dark:text-blue-400 font-medium">{keyName}</span>
            <span className="mx-2">:</span>
          </>
        )}
        <span className="text-gray-600 dark:text-gray-400">
          {isArray ? '[' : '{'}
          {entries.length}
          {isArray ? ']' : '}'}
        </span>
      </div>

      {isExpanded && (
        <div>
          {entries.map(([key, value]) => {
            const nodePath = [...path, key]
            const nodePathKey = nodePath.length === 1 ? `root.${key}` : nodePath.join('.')
            return (
              <JsonNode
                key={key}
                data={value}
                keyName={key}
                level={level + 1}
                isExpanded={expandedNodes.has(nodePathKey)}
                onToggle={() => {
                  const newExpanded = new Set(expandedNodes)
                  if (newExpanded.has(nodePathKey)) {
                    newExpanded.delete(nodePathKey)
                  } else {
                    newExpanded.add(nodePathKey)
                  }
                  setExpandedNodes(newExpanded)
                }}
                editMode={editMode}
                onChange={onChange}
                path={nodePath}
                expandedNodes={expandedNodes}
                setExpandedNodes={setExpandedNodes}
              />
            )
          })}
          <div style={{ paddingLeft: `${(level + 1) * 20}px` }}>
            {isArray ? ']' : '}'}
          </div>
        </div>
      )}
    </div>
  )
}

const JsonViewer: React.FC = () => {
  const [jsonInput, setJsonInput] = useState(`{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "isActive": true,
  "balance": null
}`)
  const [parsedData, setParsedData] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [editMode, setEditMode] = useState(false)
  const [copied, setCopied] = useState(false)

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedData = localStorage.getItem('json-viewer-data')
    if (savedData) {
      setJsonInput(savedData)
    }
  }, [])

  // 解析 JSON
  useEffect(() => {
    try {
      const parsed = JSON.parse(jsonInput)
      setParsedData(parsed)
      setError('')

      // 自动展开根节点
      setExpandedNodes(new Set(['root']))
    } catch (err) {
      setError(err instanceof Error ? err.message : '无效的 JSON 格式')
      setParsedData(null)
    }
  }, [jsonInput])

  // 保存到 localStorage
  const saveToLocalStorage = (data: string) => {
    localStorage.setItem('json-viewer-data', data)
  }

  const handleInputChange = (value: string) => {
    setJsonInput(value)
    saveToLocalStorage(value)
  }

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonInput(formatted)
      saveToLocalStorage(formatted)
    } catch (err) {
      setError('无法格式化：JSON 格式无效')
    }
  }

  const compressJson = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      const compressed = JSON.stringify(parsed)
      setJsonInput(compressed)
      saveToLocalStorage(compressed)
    } catch (err) {
      setError('无法压缩：JSON 格式无效')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonInput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setJsonInput('')
    localStorage.removeItem('json-viewer-data')
    setParsedData(null)
    setError('')
  }

  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedNodes(newExpanded)
  }

  const handleDataChange = (path: string[], value: any) => {
    // 深度更新对象
    const updateNested = (obj: any, path: string[], value: any): any => {
      if (path.length === 0) return value

      const [key, ...rest] = path
      if (Array.isArray(obj)) {
        const newObj = [...obj]
        newObj[parseInt(key)] = updateNested(obj[parseInt(key)], rest, value)
        return newObj
      } else {
        return {
          ...obj,
          [key]: updateNested(obj[key], rest, value)
        }
      }
    }

    const newData = updateNested(parsedData, path, value)
    const newJson = JSON.stringify(newData, null, 2)
    setJsonInput(newJson)
    saveToLocalStorage(newJson)
  }

  const expandAll = () => {
    const getAllPaths = (obj: any, prefix = 'root'): string[] => {
      const paths = []

      if (typeof obj === 'object' && obj !== null) {
        paths.push(prefix)
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            paths.push(...getAllPaths(item, `${prefix}.${index}`))
          })
        } else {
          Object.entries(obj).forEach(([key, value]) => {
            paths.push(...getAllPaths(value, `${prefix}.${key}`))
          })
        }
      }

      return paths
    }

    if (parsedData) {
      const allPaths = getAllPaths(parsedData)
      setExpandedNodes(new Set(allPaths))
    }
  }

  const collapseAll = () => {
    setExpandedNodes(new Set(['root']))
  }

  return (
    <div className="h-full">
      {/* 工具栏 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={formatJson}
          disabled={!parsedData}
          className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          格式化
        </button>
        <button
          onClick={compressJson}
          disabled={!parsedData}
          className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          压缩
        </button>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 flex items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          复制
        </button>
        <button
          onClick={clearAll}
          className="px-3 py-1.5 text-sm bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
        >
          清空
        </button>
        <div className="border-l mx-2" />
        <button
          onClick={expandAll}
          disabled={!parsedData}
          className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          展开全部
        </button>
        <button
          onClick={collapseAll}
          disabled={!parsedData}
          className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          折叠全部
        </button>
        <div className="border-l mx-2" />
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-3 py-1.5 text-sm rounded flex items-center gap-2 ${
            editMode
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
          }`}
        >
          {editMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {editMode ? '编辑模式' : '查看模式'}
        </button>
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)]">
        {/* 左侧输入区 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">JSON 输入</span>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={jsonInput}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="在此粘贴或输入 JSON 数据..."
            />
            {error && (
              <div className="absolute bottom-2 left-2 right-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive text-xs">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* 右侧显示区 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Braces className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              结构化视图 {editMode && '(可编辑)'}
            </span>
          </div>
          <div className="flex-1 p-4 border rounded-lg overflow-auto bg-background">
            {parsedData ? (
              <JsonNode
                data={parsedData}
                level={0}
                isExpanded={expandedNodes.has('root')}
                onToggle={() => toggleNode('root')}
                editMode={editMode}
                onChange={handleDataChange}
                path={[]}
                expandedNodes={expandedNodes}
                setExpandedNodes={setExpandedNodes}
              />
            ) : (
              <div className="text-muted-foreground text-center mt-8">
                {error ? (
                  <div className="text-destructive">
                    <p className="font-medium">JSON 格式错误</p>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                ) : (
                  <p>输入有效的 JSON 数据以查看结构化视图</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JsonViewer