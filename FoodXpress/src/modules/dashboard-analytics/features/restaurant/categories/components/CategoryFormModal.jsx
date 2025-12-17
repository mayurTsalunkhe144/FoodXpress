import { useState, useEffect } from 'react'
import Modal from '../../../../components/ui/Modal.jsx'
import Input from '../../../../components/ui/Input.jsx'

function CategoryFormModal({ onClose, onSave, category }) {
  const [formData, setFormData] = useState({
    name: '',
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
      })
    } else {
      setFormData({
        name: '',
      })
    }
  }, [category])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={category ? '✏️ Edit Category' : '➕ Add Category'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Category Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

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
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {category ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default CategoryFormModal
