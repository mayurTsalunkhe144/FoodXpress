import { useState, useEffect } from 'react'
import Modal from '../../../../components/ui/Modal.jsx'
import Input from '../../../../components/ui/Input.jsx'
import FileUpload from '../../../../components/ui/FileUpload.jsx'

function MenuFormModal({ isOpen, onClose, onSubmit, menuItem, categories = [] }) {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    price: '',
    categoryId: '',
    isAvailable: true,
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (menuItem) {
      const matchedCategory = categories.find(cat => 
        (cat.categoryName || cat.name) === menuItem.categoryName
      )
      const categoryId = matchedCategory ? String(matchedCategory.categoryId) : ''
      
      setFormData({
        itemName: menuItem.itemName || menuItem.name || '',
        description: menuItem.description || '',
        price: menuItem.price || '',
        categoryId: categoryId,
        isAvailable: menuItem.isAvailable !== undefined ? menuItem.isAvailable : true,
      })
    } else if (!menuItem) {
      setFormData({
        itemName: '',
        description: '',
        price: '',
        categoryId: '',
        isAvailable: true,
      })
    }
  }, [menuItem, categories, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        image: selectedFile
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={menuItem ? '✏️ Edit Menu Item' : '➕ Add Menu Item'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Item Name"
          value={formData.itemName}
          onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:bg-slate-800 transition"
            rows={4}
            required
          />
        </div>

        <Input
          label="Price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-400 focus:bg-slate-800 transition"
            required
          >
            <option value="">Select a category</option>
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.categoryId} value={String(cat.categoryId)}>
                  {cat.categoryName || cat.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Menu Item Image</label>
          {menuItem?.imageUrl && (
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-2">Current Image:</p>
              <img 
                src={menuItem.imageUrl} 
                alt={menuItem.name}
                className="w-32 h-32 object-cover rounded-lg border border-slate-600"
              />
            </div>
          )}
          <FileUpload
            label={menuItem?.imageUrl ? "Replace Image" : "Upload Image"}
            onChange={setSelectedFile}
            value={selectedFile}
            accept="image/*"
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <input
            type="checkbox"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="w-4 h-4 rounded border-slate-600 bg-slate-800 cursor-pointer"
          />
          <label className="text-sm font-medium text-slate-300 cursor-pointer">
            Item is Available
          </label>
        </div>

        <div className="flex gap-4 pt-6 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? 'Saving...' : (menuItem ? 'Update Item' : 'Create Item')}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default MenuFormModal
