/**
 * Lifecycle is Pending -> Confirmed -> Shipped -> Completed
 * Can be canceled at any time
 * Taken from mk-order, should probably be in the shared folder
 */
enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

export default OrderStatus;
