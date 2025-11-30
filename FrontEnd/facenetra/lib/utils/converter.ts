/**
 * Utility functions for converting between different data formats
 */

/**
 * Convert base64 string to Uint8Array
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  // Remove data URL prefix if present
  const base64Data = base64.replace(/^data:.*?;base64,/, '')
  
  // Decode base64 to binary string
  const binaryString = atob(base64Data)
  
  // Convert binary string to Uint8Array
  const uint8Array = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i)
  }
  
  return uint8Array
}

/**
 * Convert Uint8Array to base64 string
 */
export function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  let binaryString = ''
  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i])
  }
  return btoa(binaryString)
}

/**
 * Convert Buffer to Uint8Array (Node.js compatibility)
 */
export function bufferToUint8Array(buffer: Buffer): Uint8Array {
  return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
}

/**
 * Convert File to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert file to base64'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Convert File to Uint8Array
 */
export async function fileToUint8Array(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

/**
 * Convert ArrayBuffer to Uint8Array
 */
export function arrayBufferToUint8Array(arrayBuffer: ArrayBuffer): Uint8Array {
  return new Uint8Array(arrayBuffer)
}
