import { cn } from '../lib/utils/clsx'

const previewMessages = [
  { _id: '1', content: 'Hello. Are you there?', isSent: false },
  { _id: '2', content: 'Yes. I am already here. How are you today?', isSent: true },
]

const PreviewMessages = () => {

  return (
    <>
      <h3 className="text-lg font-semibold mb-3">Preview</h3>
      <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
        <div className="p-4 bg-base-200">
          <div className="max-w-lg mx-auto">
            {/* Mock Chat UI */}
            <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-primary f-center text-primary-content font-medium">
                    J
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">John Doe</h3>
                    <p className="text-xs text-base-content/70">Online</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                {previewMessages.map((m) => (
                  <div
                    key={m._id}
                    className={cn('flex', m.isSent ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-xl p-3 shadow-sm',
                        m.isSent ? 'bg-primary text-primary-content' : 'bg-base-300',
                      )}
                    >
                      <p className="text-sm">{m.content}</p>
                      <p
                        className={cn(
                          'text-[10px] mt-1.5',
                          m.isSent ? 'text-primary-content/70' : 'text-base-content/70',
                        )}
                      >
                        12:00 PM
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PreviewMessages
