import { useNavigate } from 'react-router-dom'
import Table from '../../../../components/ui/Table.jsx'
import Badge from '../../../../components/ui/Badge.jsx'

function RecentRegistrations({ registrations = [] }) {
  const navigate = useNavigate()

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success'
      case 'pending':
        return 'secondary'
      case 'rejected':
        return 'danger'
      default:
        return 'default'
    }
  }

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Restaurant Name</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head>Registration Date</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {registrations.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={4} className="text-center py-8 text-[var(--muted)]">
              No recent registrations
            </Table.Cell>
          </Table.Row>
        ) : (
          registrations.map((restaurant) => (
            <Table.Row
              key={restaurant.restaurantId}
              onClick={() => navigate(`/dashboard/admin/restaurant/${restaurant.restaurantId}`)}
            >
              <Table.Cell className="font-medium">{restaurant.restaurantName}</Table.Cell>
              <Table.Cell>{restaurant.email}</Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(restaurant.status)}>
                  {restaurant.status}
                </Badge>
              </Table.Cell>
              <Table.Cell>{restaurant.registrationDate}</Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  )
}

export default RecentRegistrations


