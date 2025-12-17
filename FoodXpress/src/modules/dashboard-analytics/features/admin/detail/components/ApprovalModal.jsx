import { useState } from 'react'
import Modal from '../../../../components/ui/Modal.jsx'
import Input from '../../../../components/ui/Input.jsx'
import Button from '../../../../components/ui/Button.jsx'

function ApprovalModal({ isOpen, onClose, onApprove, onReject, restaurantName }) {
  const [rejectionReason, setRejectionReason] = useState('')
  const [action, setAction] = useState(null) // 'approve' or 'reject'

  const handleApprove = () => {
    setAction('approve')
  }

  const handleReject = () => {
    setAction('reject')
  }

  const handleConfirm = () => {
    if (action === 'approve') {
      onApprove()
    } else if (action === 'reject') {
      if (!rejectionReason.trim()) {
        alert('Please provide a rejection reason')
        return
      }
      onReject(rejectionReason)
    }
    setAction(null)
    setRejectionReason('')
    onClose()
  }

  const handleCancel = () => {
    setAction(null)
    setRejectionReason('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={
        action === 'approve'
          ? 'Approve Restaurant'
          : action === 'reject'
          ? 'Reject Restaurant'
          : 'Restaurant Action'
      }
      size="md"
    >
      <div className="approval-modal-content">
        {!action ? (
          <>
            <p className="modal-text">
              What would you like to do with <strong>{restaurantName}</strong>?
            </p>
            <div className="modal-actions">
              <Button variant="success" onClick={handleApprove}>
                Approve
              </Button>
              <Button variant="danger" onClick={handleReject}>
                Reject
              </Button>
            </div>
          </>
        ) : action === 'reject' ? (
          <>
            <p className="modal-text">Please provide a reason for rejection:</p>
            <div className="form-group">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="form-textarea"
                rows={4}
                placeholder="Enter rejection reason..."
                required
              />
            </div>
            <div className="modal-actions">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirm}>
                Confirm Rejection
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="modal-text">
              Are you sure you want to approve <strong>{restaurantName}</strong>?
            </p>
            <div className="modal-actions">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleConfirm}>
                Confirm Approval
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default ApprovalModal


