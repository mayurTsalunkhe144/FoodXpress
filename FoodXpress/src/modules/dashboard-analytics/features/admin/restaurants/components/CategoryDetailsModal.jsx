import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card.jsx'

function CategoryDetailsModal({ category, open, onClose }) {
  if (!open || !category) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle style={{ color: 'var(--text-primary)' }}>Category Details</CardTitle>
          <button onClick={onClose} className="text-2xl" style={{ color: 'var(--text-secondary)' }}>✕</button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Category Name</p>
            <p style={{ color: 'var(--text-primary)' }} className="font-semibold text-lg">{category.name}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Items Count</p>
            <p style={{ color: 'var(--text-primary)' }} className="font-semibold text-2xl">{category.itemCount || 0}</p>
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-lg font-semibold mt-6"
            style={{ backgroundColor: 'var(--primary-red)', color: 'white' }}
          >
            Close
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoryDetailsModal
