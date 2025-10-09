// src/components/VideoUploadWidget.tsx
'use client'

import { useState } from 'react'
import { CloudinaryUploadWidget } from './CloudinaryUploadWidget'
import { Button } from '@/components/ui/Button'
import { Video, Trash2, Play } from 'lucide-react'

interface VideoUploadWidgetProps {
  onVideoUpload: (result: any) => void
  currentVideoUrl?: string
  currentThumbnailUrl?: string
}

export function VideoUploadWidget({ 
  onVideoUpload, 
  currentVideoUrl, 
  currentThumbnailUrl 
}: VideoUploadWidgetProps) {
  const [showVideo, setShowVideo] = useState(false)

  if (currentVideoUrl) {
    return (
      <div className="space-y-3">
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-black">
          {showVideo ? (
            <video 
              src={currentVideoUrl} 
              controls 
              className="w-full h-48 object-contain"
            />
          ) : (
            <div 
              className="w-full h-48 bg-cover bg-center cursor-pointer relative"
              style={{ backgroundImage: `url(${currentThumbnailUrl})` }}
              onClick={() => setShowVideo(true)}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <Play className="h-12 w-12 text-white" />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <CloudinaryUploadWidget
            onUpload={onVideoUpload}
            resourceType="video"
            folder="lms/course-videos"
            buttonText="Change Video"
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={() => {
              onVideoUpload({ url: '', public_id: '' })
              setShowVideo(false)
            }}
            className="text-red-600 border-red-300"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
      <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-600 mb-2">
        Upload course video
      </p>
      <p className="text-xs text-gray-500 mb-3">
        Supported: MP4, MOV, AVI, WebM • Max 500MB
      </p>
      <CloudinaryUploadWidget
        onUpload={onVideoUpload}
        resourceType="video"
        folder="lms/course-videos"
        buttonText="Choose Video File"
        className="w-full border-gray-300"
      />
    </div>
  )
}