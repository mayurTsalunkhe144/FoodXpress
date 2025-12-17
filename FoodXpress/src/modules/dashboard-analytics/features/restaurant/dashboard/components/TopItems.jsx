import Table from '../../../../components/ui/Table.jsx'
import Badge from '../../../../components/ui/Badge.jsx'

function TopItems({ items = [] }) {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Item Name</Table.Head>
          <Table.Head>Category</Table.Head>
          <Table.Head>Quantity Sold</Table.Head>
          <Table.Head>Revenue</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={4} className="text-center py-8 text-[var(--muted)]">
              No items found
            </Table.Cell>
          </Table.Row>
        ) : (
          items.map((item) => (
            <Table.Row key={item.menuItemId}>
              <Table.Cell className="font-medium">{item.itemName}</Table.Cell>
              <Table.Cell>
                <Badge variant="secondary">{item.categoryName}</Badge>
              </Table.Cell>
              <Table.Cell>{item.quantitySold}</Table.Cell>
              <Table.Cell className="font-semibold">
                ${item.revenue?.toFixed(2) || '0.00'}
              </Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table>
  )
}

export default TopItems


