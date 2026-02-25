import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  createTableColumn,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  TableColumnDefinition,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
} from '@fluentui/react-components'
import {
  ClockRegular,
  CheckmarkCircleFilled,
  DismissCircleFilled,
  DocumentArrowRightRegular,
  DocumentAddRegular,
  DeleteRegular,
  DeleteDismissRegular,
  FolderAddRegular,
  MusicNote1Regular,
  ArrowDownloadRegular,
} from '@fluentui/react-icons'

import { Status, Item, SaveTo } from './types'

const columnsDef: TableColumnDefinition<Item>[] = [
  createTableColumn<Item>({
    columnId: 'status',
    renderHeaderCell: () => <>状态</>,
  }),
  createTableColumn<Item>({
    columnId: 'file',
    renderHeaderCell: () => <>文件名</>,
  }),
  createTableColumn<Item>({
    columnId: 'operation',
    renderHeaderCell: () => <>操作</>,
  }),
]

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    minHeight: '100vh',
    padding: '24px',
    fontFamily: '"Microsoft YaHei", "Segoe UI", sans-serif',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #e94057 0%, #f27121 100%)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(233, 64, 87, 0.3)',
  },
  headerIcon: {
    fontSize: '48px',
    color: 'white',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'white',
    margin: 0,
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  headerSubtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    marginTop: '4px',
  },
  card: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '16px',
  },
  iconGreen: {
    color: tokens.colorPaletteGreenForeground1,
    fontSize: '20px',
  },
  iconRed: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: '20px',
  },
  iconGray: {
    color: tokens.colorNeutralForeground3,
    fontSize: '20px',
  },
  tableContainer: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: tokens.colorNeutralForeground3,
  },
  dropZone: {
    border: `2px dashed ${tokens.colorNeutralStroke2}`,
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    marginBottom: '16px',
    transition: 'all 0.3s ease',
    background: 'rgba(248,248,248,0.8)',
  },
  dropZoneActive: {
    border: `2px dashed ${tokens.colorBrandStroke1}`,
    background: 'rgba(233, 64, 87, 0.05)',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  },
  statusPending: {
    background: 'rgba(107, 107, 107, 0.1)',
    color: '#666',
  },
  statusProcessing: {
    background: 'rgba(233, 64, 87, 0.1)',
    color: '#e94057',
  },
  statusDone: {
    background: 'rgba(16, 124, 16, 0.1)',
    color: '#107c10',
  },
  statusError: {
    background: 'rgba(196, 43, 28, 0.1)',
    color: '#c42b1c',
  },
})

declare global {
  interface Window {
    go: {
      main: {
        App: {
          SelectFiles: () => Promise<string[]>
          SelectFolder: () => Promise<string>
          SelectFilesFromFolder: (ext: string) => Promise<string[]>
          ProcessFiles: (files: { Name: string; Status: string }[], savePath: string) => Promise<void>
        }
      }
    }
    runtime?: {
      EventsOn: (event: string, callback: (...args: any[]) => void) => void
      OnFileDrop: (callback: (x: number, y: number, paths: string[]) => void, openFile: boolean) => void
    }
  }
}

export const App = () => {
  const styles = useStyles()

  const [items, setItems] = useState<Item[]>([])
  const isProcessing = useMemo(() => {
    return items.some(item => item.status === 'processing')
  }, [items])

  const [saveTo, setSaveTo] = useState<SaveTo>('original')
  const [savePath, setSavePath] = useState('')

  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const [columns] = useState<TableColumnDefinition<Item>[]>(columnsDef)

  const processedCount = useMemo(() => {
    return items.filter(item => item.status === 'done').length
  }, [items])

  const statusMapIcon = (status: Status) => {
    switch (status) {
      case 'pending':
        return <ClockRegular className={styles.iconGray} />
      case 'processing':
        return <Spinner size="tiny" />
      case 'done':
        return <CheckmarkCircleFilled className={styles.iconGreen} />
      case 'error':
        return <DismissCircleFilled className={styles.iconRed} />
    }
  }

  const statusMapText = (status: Status) => {
    switch (status) {
      case 'pending': return '等待转换'
      case 'processing': return '转换中'
      case 'done': return '转换完成'
      case 'error': return '转换失败'
    }
  }

  const statusBadgeClass = (status: Status) => {
    switch (status) {
      case 'pending': return styles.statusPending
      case 'processing': return styles.statusProcessing
      case 'done': return styles.statusDone
      case 'error': return styles.statusError
    }
  }

  const selectFiles = () => {
    if (isProcessing || !window.go?.main?.App) return
    window.go.main.App.SelectFiles().then((files: string[]) => {
      for (const file of files) {
        setItems(prev => [...prev, { file, status: 'pending' }])
      }
    })
  }

  const selectFilesFromFolder = () => {
    if (isProcessing || !window.go?.main?.App) return
    window.go.main.App.SelectFilesFromFolder('ncm').then((files: string[]) => {
      for (const file of files) {
        setItems(prev => [...prev, { file, status: 'pending' }])
      }
    })
  }

  const selectFolder = () => {
    if (!window.go?.main?.App) return
    window.go.main.App.SelectFolder().then((path: string) => {
      if (path) setSavePath(path)
    })
  }

  const showDialog = (msg: string) => {
    setMessage(msg)
    setOpen(true)
  }

  const startProcess = async () => {
    if (!window.go?.main?.App) return
    if (items.length === 0) {
      showDialog('请先添加NCM文件！')
      return
    }
    const hasPending = items.some(item => item.status === 'pending')
    if (!hasPending) {
      showDialog('所有文件已处理完成，请添加新文件！')
      return
    }
    if (saveTo === 'custom' && savePath === '') {
      showDialog('请选择保存目录！')
      return
    }
    const ncmFiles: { Name: string; Status: string }[] = items.map(item => ({
      Name: item.file,
      Status: item.status,
    }))
    window.go.main.App.ProcessFiles(ncmFiles, savePath).then(() => {})
  }

  useEffect(() => {
    const handleStatusChange = (index: number, status: Status) => {
      setItems(prev => {
        const newItems = [...prev]
        newItems[index].status = status
        return newItems
      })
    }
    
    if (window.runtime?.EventsOn) {
      window.runtime.EventsOn('file-status-changed', handleStatusChange)
    }
  }, [])

  useEffect(() => {
    const handleFileDrop = (_x: number, _y: number, paths: string[]) => {
      for (const path of paths) {
        if (!path.toLowerCase().endsWith('.ncm')) continue
        setItems(prev => [...prev, { file: path, status: 'pending' }])
      }
    }
    
    if (window.runtime?.OnFileDrop) {
      window.runtime.OnFileDrop(handleFileDrop, false)
    }
  }, [])

  const getFileName = (path: string) => {
    const parts = path.split(/[/\\]/)
    return parts[parts.length - 1]
  }

  return (
    <div className={styles.root}>
      <Dialog open={open} onOpenChange={(event, data) => setOpen(data.open)}>
        <DialogSurface style={{ width: '380px', borderRadius: '16px' }}>
          <DialogBody>
            <DialogTitle style={{ fontWeight: 600 }}>提示</DialogTitle>
            <DialogContent style={{ padding: '16px 0', color: '#666' }}>
              {message}
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="primary" style={{ borderRadius: '8px' }}>知道了</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <div className={styles.container}>
        <div className={styles.header}>
          <img src="/appicon.png" alt="logo" style={{ width: '48px', height: '48px', borderRadius: '8px' }} />
          <div>
            <h1 className={styles.headerTitle}>网易云音乐NCM转换器</h1>
            <p className={styles.headerSubtitle}>支持NCM转MP3/FLAC，保留歌曲信息和专辑封面</p>
          </div>
        </div>

        <div className={styles.card}>
          <div 
            className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ''}`}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={() => setIsDragging(false)}
          >
            <DocumentArrowRightRegular style={{ fontSize: '36px', color: '#e94057', marginBottom: '8px' }} />
            <div style={{ color: '#666', fontSize: '14px' }}>
              拖拽NCM文件到此处，或点击下方按钮添加
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <Button 
              onClick={selectFiles} 
              icon={<DocumentAddRegular />}
              style={{ 
                background: 'white', 
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '8px 16px'
              }}
            >
              添加文件
            </Button>
            <Button 
              onClick={selectFilesFromFolder} 
              icon={<FolderAddRegular />}
              style={{ 
                background: 'white', 
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '8px 16px'
              }}
            >
              添加文件夹
            </Button>
            <Button 
              onClick={() => !isProcessing && setItems([])} 
              icon={<DeleteDismissRegular />}
              disabled={isProcessing}
              style={{ 
                background: 'white', 
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '8px 16px'
              }}
            >
              清空列表
            </Button>
            <Button 
              appearance="primary"
              onClick={startProcess}
              disabled={isProcessing}
              icon={<ArrowDownloadRegular />}
              style={{ 
                background: isProcessing ? '#ccc' : 'linear-gradient(135deg, #e94057 0%, #f27121 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 20px',
                fontWeight: 600,
              }}
            >
              {isProcessing ? '转换中...' : '开始转换'}
            </Button>
          </div>

          <Field label="保存位置" style={{ marginTop: '8px' }}>
            <RadioGroup
              layout="horizontal"
              value={saveTo}
              onChange={(_, data) => {
                setSaveTo(data.value as SaveTo)
                if (data.value === 'original') setSavePath('')
              }}
              style={{ gap: '16px' }}
            >
              <Radio value="original" label="源文件目录" />
              <Radio value="custom" label="自定义目录" />
              {saveTo === 'custom' && (
                <Input
                  placeholder="点击选择保存目录"
                  value={savePath}
                  readOnly
                  style={{ width: '200px', borderRadius: '8px' }}
                  onClick={selectFolder}
                />
              )}
            </RadioGroup>
          </Field>
        </div>

        {items.length > 0 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '12px',
            padding: '0 8px'
          }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              共 {items.length} 个文件
            </span>
            <span style={{ color: '#4ade80', fontSize: '14px' }}>
              已完成: {processedCount}/{items.length}
            </span>
          </div>
        )}

        <div className={styles.tableContainer}>
          <Table style={{ minWidth: '500px' }} size="small">
            <TableHeader>
              <TableRow>
                {columns.map(column => (
                  <TableHeaderCell key={column.columnId}>
                    {column.renderHeaderCell()}
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span className={`${styles.statusBadge} ${statusBadgeClass(file.status)}`}>
                      {statusMapIcon(file.status)}
                      {statusMapText(file.status)}
                    </span>
                  </TableCell>
                  <TableCell style={{ maxWidth: '300px' }}>
                    <div style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      fontSize: '13px'
                    }} title={file.file}>
                      {getFileName(file.file)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      icon={<DeleteRegular />}
                      appearance="transparent"
                      onClick={() => setItems(prev => prev.filter((_, i) => i !== index))}
                      disabled={isProcessing}
                      style={{ borderRadius: '6px' }}
                    >
                      删除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className={styles.emptyState}>
                    <MusicNote1Regular style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }} />
                    <div>还没有文件，点击上方按钮添加NCM文件</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '24px', 
          color: 'rgba(255,255,255,0.5)',
          fontSize: '12px'
        }}>
          网易云音乐NCM转换器 v1.0.0 | 基于 Wails + React 构建
        </div>
      </div>
    </div>
  )
}

export default App
