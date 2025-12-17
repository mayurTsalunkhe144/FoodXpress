import { useState } from 'react'

export default function ActionModal({ open, action, restaurant, onConfirm, onClose }) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm(reason)
      setReason('')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  const getTitle = () => {
    switch(action) {
      case 'approve': return 'Approve Restaurant'
      case 'reject': return 'Reject Restaurant'
      case 'activate': return 'Activate Restaurant'
      case 'deactivate': return 'Deactivate Restaurant'
      default: return 'Confirm Action'
    }
  }

  const getButtonColor = () => {
    switch(action) {
      case 'approve': return 'bg-green-500 hover:bg-green-600'
      case 'reject': return 'bg-red-500 hover:bg-red-600'
      case 'activate': return 'bg-blue-500 hover:bg-blue-600'
      case 'deactivate': return 'bg-red-500 hover:bg-red-600'
      default: return 'bg-slate-500 hover:bg-slate-600'
    }
  }

  const showReasonField = action === 'reject' || action === 'deactivate'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-md w-full">
        <div className="border-b border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-slate-300">
            {action === 'approve' && `Approve ${restaurant?.name}?`}
            {action === 'reject' && `Reject ${restaurant?.name}?`}
            {action === 'activate' && `Activate ${restaurant?.name}?`}
            {action === 'deactivate' && `Deactivate ${restaurant?.name}?`}
          </p>

          {showReasonField && (
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason (optional)..."
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              rows="3"
            />
          )}
        </div>

        <div className="border-t border-slate-700 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg font-semibold transition ${getButtonColor()}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
