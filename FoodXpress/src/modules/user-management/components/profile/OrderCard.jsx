const OrderCard = ({ order }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6 font-outfit hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        <img 
          src={order.image} 
          alt={order.restaurant}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIGZpbGw9IiNEREREREQiLz4KPC9zdmc+';
          }}
        />
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{order.restaurant}</h3>
              <p className="text-gray-600">{order.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">ORDER #{order.orderId}</p>
              <p className="text-sm text-green-600 font-medium">Delivered on {formatDate(order.deliveredAt)}</p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            {order.items.join(', ')}
          </p>
          
          <div className="flex justify-between items-center mb-3">
            <p className="font-bold text-gray-900 text-lg">₹{order.total}</p>
            <div className="flex gap-2">
              <button className="page-btn page-btn-danger">
                Reorder
              </button>
              <button className="page-btn page-btn-secondary">
                Help
              </button>
            </div>
          </div>
          
          <button className="text-red-500 font-semibold hover:underline">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;