/**
 * 图片处理工具函数
 */

export interface ImageCompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  outputFormat?: 'jpeg' | 'png' | 'webp'
}

/**
 * 压缩图片
 * @param file 原始图片文件
 * @param options 压缩选项
 * @returns 压缩后的图片 Blob
 */
export async function compressImage(file: File, options: ImageCompressionOptions = {}): Promise<Blob> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 1.0, outputFormat = 'jpeg' } = options

  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('无法获取 Canvas 上下文'))
      return
    }

    img.onload = () => {
      // 计算压缩后的尺寸
      let { width, height } = img

      // 计算目标像素总量
      const targetPixels = maxWidth * maxHeight
      const currentPixels = width * height

      // 如果当前像素总量超过目标像素总量，则按比例缩小
      if (currentPixels > targetPixels) {
        const ratio = Math.sqrt(targetPixels / currentPixels)
        width = Math.floor(width * ratio)
        height = Math.floor(height * ratio)
      }

      // 设置 canvas 尺寸
      canvas.width = width
      canvas.height = height

      // 绘制压缩后的图片
      ctx.drawImage(img, 0, 0, width, height)

      // 转换为 Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('图片压缩失败'))
          }
        },
        outputFormat === 'png' ? 'image/png' : `image/${outputFormat}`,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }

    // 加载图片
    img.src = URL.createObjectURL(file)
  })
}

/**
 * 检查文件是否需要压缩（实际上是检查是否为图片，以便进行标准化处理）
 * @param file 文件
 * @returns 是否需要压缩
 */
export function shouldCompressImage(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * 获取图片的基本信息
 * @param file 图片文件
 * @returns 图片信息
 */
export async function getImageInfo(file: File): Promise<{
  width: number
  height: number
  size: number
  type: string
}> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type
      })
    }

    img.onerror = () => {
      reject(new Error('无法加载图片'))
    }

    img.src = URL.createObjectURL(file)
  })
}

/**
 * 将 Blob 转换为 ArrayBuffer
 * @param blob Blob 对象
 * @returns ArrayBuffer
 */
export async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(new Error('读取 Blob 失败'))
    reader.readAsArrayBuffer(blob)
  })
}
