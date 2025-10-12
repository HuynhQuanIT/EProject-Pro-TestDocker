# Test Order với Quantity Management

## 1. Tạo sản phẩm với quantity
```bash
POST http://localhost:3001/api/products
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "name": "Laptop Dell",
  "price": 15000000,
  "description": "Laptop Dell Inspiron 15",
  "quantity": 10
}
```

## 2. Kiểm tra sản phẩm
```bash
GET http://localhost:3001/api/products
Authorization: Bearer <your-jwt-token>
```

## 3. Tạo đơn hàng với quantity
```bash
POST http://localhost:3001/api/products/buy
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "<product-id>",
      "quantity": 2
    }
  ]
}
```

## 4. Kiểm tra quantity đã giảm
```bash
GET http://localhost:3001/api/products/<product-id>
Authorization: Bearer <your-jwt-token>
```

## 5. Cập nhật quantity sản phẩm (thêm hàng vào kho)
```bash
PUT http://localhost:3001/api/products/<product-id>/quantity
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "quantity": 20
}
```

## Cách hoạt động:

1. **Tạo sản phẩm**: Sản phẩm được tạo với quantity (số lượng tồn kho)
2. **Kiểm tra tồn kho**: Khi tạo order, hệ thống sẽ kiểm tra xem có đủ quantity không
3. **Tạo đơn hàng**: Đơn hàng được tạo với quantity cụ thể cho từng sản phẩm
4. **Giảm tồn kho**: Sau khi order được xử lý, quantity sẽ được giảm tự động
5. **Cập nhật kho**: Admin có thể cập nhật quantity để nhập hàng mới

## Lưu ý:
- Nếu quantity không đủ, hệ thống sẽ trả về lỗi
- Quantity không thể âm
- Order sẽ được gửi qua RabbitMQ để xử lý bất đồng bộ
- Product service sẽ nhận message từ Order service và tự động giảm quantity