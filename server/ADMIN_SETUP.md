# Admin orders dashboard

1. Register a normal FoodExpress account in the app.
2. From the `server` directory, run `npm run make-admin -- your-email@example.com`.
3. Log out and sign back in with that account. The sidebar will show **Admin orders**.

The dashboard lists every saved order, customer name and email, delivery address, item quantities and prices, payment method, discounts, final total, and current status. Admins can search/filter orders and change status. Access is checked on the server against the user's database role; registering does not grant admin privileges.

Admin API endpoints:

- `GET /api/orders/admin` — list all orders, newest first.
- `PATCH /api/orders/admin/:id/status` — update an order to `Placed`, `Preparing`, `Delivered`, or `Cancelled`.