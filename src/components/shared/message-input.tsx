import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { useChatStore } from '../../store/use-chat.store'
import toast from 'react-hot-toast'
import { handleApiError } from '../../lib/utils/handle-api-errors'
import { Image, Send, X } from 'lucide-react'
import { cn } from '../../lib/utils/clsx'

const MessageInput = () => {
  const [text, setText] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { sendMessage, startTyping, stopTyping } = useChatStore()

  useEffect(() => {
    let typingTimer: NodeJS.Timeout | null = null
    if (text.trim()) {
      startTyping()
      typingTimer = setTimeout(() => {
        stopTyping()
      }, 3000)
    } else {
      stopTyping()
    }

    return () => {
      if (typingTimer) clearTimeout(typingTimer)

      stopTyping()
    }
  }, [text, startTyping, stopTyping])

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      if (!file.type.match(/^image\/jpeg$/)) {
        toast.error('Only JPEG/JPG images are allowed.')
        return
      }
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (text.trim() || fileInputRef.current) {
        stopTyping()

        sendMessage({ text: text.trim(), image: fileInputRef.current?.files?.[0] })
        setText('')
        removeImage()
      }
    } catch (error) {
      const message = handleApiError(error)
      toast.error(message)
    }
  }

  return (
    <div className="p-2 pe-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="size-20 object-cover rounded-box border border-neutral-content"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 f-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => handleSendMessage(e)}
        encType="multipart/form-data"
        className="flex items-center gap-2"
      >
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="input input-bordered w-full input-sm sm:input-md"
          />
          <input
            type="file"
            accept="image/jpeg"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'hidden btn btn-circle sm:flex',
              imagePreview ? 'text-success' : 'text-neutral-content',
            )}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-circle max-sm:btn-sm"
          disabled={!text.trim() && !imagePreview}
        >
          <Send className="max-sm:size-4 size-5" />
        </button>
      </form>
    </div>
  )
}

export default MessageInput
