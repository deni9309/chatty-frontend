import { useRef, useState } from 'react'

const MessageInput = () => {
  const [text, setText] = useState<string>('')
  const [imagePreview, setImagePreview] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return <div>MessageInput</div>
}

export default MessageInput
