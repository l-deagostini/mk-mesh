/**
 * Lifecycle is Pending -> Confirmed -> Shipped -> Completed
 * Can be canceled at any time
 */
enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

export default OrderStatus;
