import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card.jsx'

function MenuItemDetailsModal({ item, open, onClose }) {
  if (!open || !item) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }} className="border w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle style={{ color: 'var(--text-primary)' }}>Menu Item Details</CardTitle>
          <button onClick={onClose} className="text-2xl" style={{ color: 'var(--text-secondary)' }}>✕</button>
        </CardHeader>
        <CardContent className="space-y-4">
          {item.imageUrl && (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Image</p>
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-full h-48 object-cover rounded-lg mt-2"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          )}
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Item Name</p>
            <p style={{ color: 'var(--text-primary)' }} className="font-semibold text-lg">{item.name}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Category</p>
            <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{item.categoryName}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Description</p>
            <p style={{ color: 'var(--text-primary)' }} className="text-sm">{item.description || 'No description'}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Price</p>
            <p style={{ color: '#28a745' }} className="font-semibold text-lg">${item.price?.toFixed(2) || '0.00'}</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Availability</p>
            <span className={`px-3 py-1 rounded text-sm font-semibold inline-block ${item.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {item.isAvailable ? 'Available' : 'Unavailable'}
            </span>
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

export default MenuItemDetailsModal
