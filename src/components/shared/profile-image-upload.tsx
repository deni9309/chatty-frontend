import { useState } from 'react'
import { Camera, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProfileImageUploadProps {
  initialImageUrl?: string
  onFileSelect: (file: File | null) => void
  onDeleteImage: () => void
}

export default function ProfileImageUpload({
  initialImageUrl,
  onFileSelect,
  onDeleteImage,
}: ProfileImageUploadProps) {
  const [preview, setPreview] = useState(initialImageUrl || '')

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null
    if (file) {
      if (!file.type.match(/^image\/jpeg$/)) {
        toast.error('Only JPEG/JPG images are allowed.')
        return
      }

      const imageUrl = URL.createObjectURL(file)
      setPreview(imageUrl)
      onFileSelect(file)
    }
  }

  function handleDelete() {
    setPreview('')
    onFileSelect(null)
    onDeleteImage()
  }

  return (
    <div className="relative flex flex-col items-center">
      <label className="relative flex items-center justify-center w-32 h-32 rounded-full overflow-hidden bg-gray-100 cursor-pointer group">
        <input type="file" accept="image/jpeg" className="hidden" onChange={handleFileChange} />

        {preview ? (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="text-gray-500">No Image</div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-10 h-10" />
        </div>
      </label>
      {preview && (
        <button
          type="button"
          onClick={handleDelete}
          className="mt-2 flex items-center text-red-500 hover:text-red-700 transition"
        >
          <div className="tooltip" data-tip={'Delete'}>
            <Trash2 />
          </div>
        </button>
      )}
    </div>
  )
}
