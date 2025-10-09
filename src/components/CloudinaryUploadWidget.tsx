// src/components/CloudinaryUploadWidget.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Upload, Loader2, Image, Video, FileText } from 'lucide-react'

interface CloudinaryUploadWidgetProps {
  onUpload: (result: any) => void
  resourceType?: 'image' | 'video' | 'raw'
  folder?: string
  buttonText?: string
  className?: string
}

declare global {
  interface Window {
    cloudinary: any
  }
}

export function CloudinaryUploadWidget({
  onUpload,
  resourceType = 'image',
  folder = 'lms',
  buttonText,
  className = ''
}: CloudinaryUploadWidgetProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [widget, setWidget] = useState<any>(null)

  useEffect(() => {
    // Load Cloudinary widget script
    const script = document.createElement('script')
    script.src = 'https://upload-widget.cloudinary.com/global/all.js'
    script.async = true
    script.onload = () => {
      initializeWidget()
    }
    document.body.appendChild(script)

    return () => {
      if (widget) {
        widget.destroy()
      }
      document.body.removeChild(script)
    }
  }, [resourceType, folder])

  const initializeWidget = () => {
    if (!window.cloudinary) return

    const uploadWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        folder: folder,
        resourceType: resourceType,
        multiple: false,
        clientAllowedFormats: resourceType === 'image' 
          ? ['jpg', 'jpeg', 'png', 'webp', 'gif']
          : resourceType === 'video'
          ? ['mp4', 'mov', 'avi', 'webm', 'mkv']
          : ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'],
        maxFileSize: resourceType === 'image' 
          ? 10000000 // 10MB for images
          : resourceType === 'video'
          ? 500000000 // 500MB for videos
          : 50000000, // 50MB for documents
        showPoweredBy: false,
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1"
          }
        }
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          onUpload({
            url: result.info.secure_url,
            public_id: result.info.public_id,
            format: result.info.format,
            resource_type: result.info.resource_type,
            width: result.info.width,
            height: result.info.height,
            bytes: result.info.bytes,
            duration: result.info.duration
          })
          setIsLoading(false)
        }
        
        if (error) {
          console.error('Upload error:', error)
          setIsLoading(false)
        }
        
        if (result && result.event === "show") {
          setIsLoading(false)
        }
        
        if (result && result.event === "close") {
          setIsLoading(false)
        }
      }
    )

    setWidget(uploadWidget)
  }

  const handleUploadClick = () => {
    setIsLoading(true)
    if (widget) {
      widget.open()
    }
  }

  const getIcon = () => {
    switch (resourceType) {
      case 'image':
        return <Image className="h-4 w-4 mr-2" />
      case 'video':
        return <Video className="h-4 w-4 mr-2" />
      case 'raw':
        return <FileText className="h-4 w-4 mr-2" />
      default:
        return <Upload className="h-4 w-4 mr-2" />
    }
  }

  const getButtonText = () => {
    if (buttonText) return buttonText
    
    switch (resourceType) {
      case 'image':
        return 'Upload Image'
      case 'video':
        return 'Upload Video'
      case 'raw':
        return 'Upload Document'
      default:
        return 'Upload File'
    }
  }

  return (
    <Button
      type="button"
      onClick={handleUploadClick}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        getIcon()
      )}
      {isLoading ? 'Opening Upload...' : getButtonText()}
    </Button>
  )
}