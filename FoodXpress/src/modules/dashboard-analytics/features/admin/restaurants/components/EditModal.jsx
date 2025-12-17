import { useState, useEffect } from 'react'

export default function EditModal({ open, restaurant, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    ownerEmail: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name || '',
        description: restaurant.description || '',
        phone: restaurant.phone || '',
        address: restaurant.address || '',
        ownerEmail: restaurant.ownerEmail || ''
      })
    }
  }, [restaurant])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onSave(formData)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-md w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Restaurant</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-2">Owner Email</label>
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
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
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600 transition"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
