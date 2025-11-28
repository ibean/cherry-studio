import { loggerService } from '@logger'
import { randomUUID } from 'crypto'

const logger = loggerService.withContext('DoubaoService')

export interface DoubaoConfig {
  appId: string
  accessToken: string
  resourceId?: string
}

export class DoubaoService {
  private static instance: DoubaoService

  public static getInstance(): DoubaoService {
    if (!DoubaoService.instance) {
      DoubaoService.instance = new DoubaoService()
    }
    return DoubaoService.instance
  }

  async transcribe(audioData: string, config: DoubaoConfig): Promise<string> {
    const { appId, accessToken, resourceId } = config
    if (!appId || !accessToken) {
      throw new Error('Doubao App ID or Access Token is missing')
    }

    const url = 'https://openspeech.bytedance.com/api/v3/auc/bigmodel/recognize/flash'
    const requestId = randomUUID()

    const headers = {
      'X-Api-App-Key': appId,
      'X-Api-Access-Key': accessToken,
      'X-Api-Resource-Id': resourceId || 'volc.bigasr.auc_turbo',
      'X-Api-Request-Id': requestId,
      'X-Api-Sequence': '-1',
      'Content-Type': 'application/json'
    }

    const body = {
      user: {
        uid: appId
      },
      audio: {
        data: audioData // Base64 encoded audio
      },
      request: {
        model_name: 'bigmodel'
      }
    }

    logger.info(`Sending ASR request to Doubao`, { requestId })
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    logger.info('Doubao ASR response', { data })

    // Check header status code if available in response headers, but fetch response headers are different.
    // Doubao returns status in headers? The doc says "recognize task response header X-Api-Status-Code: 20000000"
    // But usually we check the body or standard HTTP status.
    // The doc says:
    // if 'X-Api-Status-Code' in response.headers: ...
    // Let's check response headers.

    const statusCode = response.headers.get('X-Api-Status-Code')
    if (statusCode && statusCode !== '20000000') {
      // Handle specific error codes if needed
      if (statusCode === '20000003') {
        throw new Error('No speech detected')
      }
      throw new Error(`Doubao API Error: ${statusCode}`)
    }

    // Check body result
    if (data && data.result && data.result.text) {
      return data.result.text
    }

    // Some error handling based on body content if needed?
    // "result": { "text": "..." }

    return ''
  }
}

export const doubaoService = DoubaoService.getInstance()
