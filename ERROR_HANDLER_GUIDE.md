# Global Error Handler Implementation Guide

## Overview
A centralized error handling system for Express.js that catches all async errors and returns standardized JSON responses.

## Files Modified

### 1. **backend/middleware/errorHandler.js** (NEW)
Exports two things:
- **`AppError`** - Custom error class for throwing errors with status codes
- **`errorHandler`** - Express error handler middleware

#### How to throw custom errors:
```javascript
// In any controller:
throw new AppError("User not found", 404);
throw new AppError("Unauthorized", 401);
throw new AppError("Validation failed", 400);
```

#### Automatic error handling includes:
- Mongoose validation errors → 400 with field details
- Mongoose duplicate key errors → 400 with field name
- JWT errors (invalid/expired) → 401
- Unknown errors → 500

---

### 2. **backend/controllers/user.controller.js** (UPDATED)
All functions now:
- Import `AppError` from errorHandler
- Accept `next` parameter: `async (req, res, next)`
- Use `next(error)` instead of `res.status().json()`
- Throw `AppError` for validation and business logic errors

Example pattern:
```javascript
exports.login = async (req, res, next) => {
  try {
    if (!email || !password) {
      throw new AppError("Email and password required", 400);
    }
    // ... logic ...
    res.json({ success: true, msg: "Login successful" });
  } catch (error) {
    next(error); // Pass to error handler
  }
};
```

---

### 3. **backend/controllers/product.controller.js** (UPDATED)
Same pattern as user controller:
- All functions have `next` parameter
- Throw `AppError` instead of returning error responses
- Consistent error handling across all endpoints

---

### 4. **backend/controllers/cart.controller.js** (UPDATED)
Same pattern:
- Added error imports and next parameter
- Wrapped logic in try/catch with `next(error)`

---

### 5. **backend/index.js** (UPDATED)
- Imported `{ errorHandler }` from middleware
- Added **AFTER all routes**: `app.use(errorHandler);`

**Critical:** The error handler MUST be the last middleware!

```javascript
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// ✅ This goes last
app.use(errorHandler);
```

---

## Response Format

All errors now return consistent JSON:

```json
{
  "success": false,
  "status": 400,
  "message": "Email and password required"
}
```

Success responses also use:
```json
{
  "success": true,
  "msg": "...",
  "data": {}
}
```

---

## Common Error Scenarios

### Validation Error
```javascript
if (!username || !email || !password) {
  throw new AppError("All fields required", 400);
}
// Returns 400 with message
```

### Not Found
```javascript
const user = await User.findById(id);
if (!user) {
  throw new AppError("User not found", 404);
}
// Returns 404 with message
```

### Unauthorized
```javascript
if (!refreshToken) {
  throw new AppError("Refresh token not found", 401);
}
// Returns 401 with message
```

### Database Validation Error
MongoDB validation errors are caught automatically and return 400 with details.

### JWT Errors
Invalid or expired tokens are caught automatically and return 401.

---

## Development vs Production

In **development** mode (NODE_ENV !== "production"):
- Error responses include stack trace for debugging

In **production**:
- Stack traces hidden for security

---

## Summary of Changes

| File | Changes |
|------|---------|
| errorHandler.js | ✨ NEW - Central error handling |
| user.controller.js | Updated 6 functions with error forwarding |
| product.controller.js | Updated 5 functions with error forwarding |
| cart.controller.js | Updated 3 functions with error forwarding |
| index.js | Added errorHandler middleware import and registration |

All controllers now have consistent error handling without inline error responses!
