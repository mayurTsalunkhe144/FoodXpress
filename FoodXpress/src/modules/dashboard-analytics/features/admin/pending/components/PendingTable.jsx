import { useNavigate } from 'react-router-dom'
import Table from '../../../../components/ui/Table.jsx'
import Badge from '../../../../components/ui/Badge.jsx'

function PendingTable({ restaurants = [] }) {
  const navigate = useNavigate()

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Restaurant Name</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Phone</Table.Head>
          <Table.Head>Cuisine Type</Table.Head>
          <Table.Head>Registration Date</Table.Head>
          <Table.Head>Status</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {restaurants.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={6} className="text-center py-8 text-[var(--muted)]">
              No pending restaurants
            </Table.Cell>
          </Table.Row>
        ) : (
          restaurants.map((restaurant) => (
            <Table.Row
              key={restaurant.restaurantId}
              onClick={() => navigate(`/dashboard/admin/restaurant/${restaurant.restaurantId}`)}
            >
              <Table.Cell className="font-medium">{restaurant.restaurantName}</Table.Cell>
              <Table.Cell>{restaurant.email}</Table.Cell>
              <Table.Cell>{restaurant.phone}</Table.Cell>
              <Table.Cell>{restaurant.cuisineType}</Table.Cell>
              <Table.Cell>{restaurant.registrationDate}</Table.Cell>
              <Table.Cell>
                <Badge variant="secondary">{restaurant.status}</Badge>
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  )
}

export default PendingTable


