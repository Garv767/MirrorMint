# Strategy API Reference

The Strategy entity is the core of the MirrorMint platform.

## Data Model
- **Title:** Descriptive name of the bot.
- **Bot Type:** Arbitrage, Trend, Mean Reversion, or Scalping.
- **Risk Level:** Low, Medium, or High.
- **Target ROI:** Projected percentage return.
- **Ownership:** Every strategy is linked to the `user_id` of its creator.

## Endpoints
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/strategies` | `GET` | List all strategies in the pool. |
| `/api/v1/strategies` | `POST` | Create a new strategy. |
| `/api/v1/strategies/{id}` | `PUT` | Update a strategy (Owner or Admin only). |
| `/api/v1/strategies/{id}` | `DELETE` | Remove a strategy (Owner or Admin only). |
