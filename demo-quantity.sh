#!/bin/bash

# Demo script để test chức năng quản lý quantity
# Chạy script này sau khi đã đăng nhập và có JWT token

# Thay YOUR_JWT_TOKEN bằng token thật
JWT_TOKEN="YOUR_JWT_TOKEN"
BASE_URL="http://localhost:3001/api/products"

echo "=== DEMO QUẢN LÝ QUANTITY SẢN PHẨM ==="
echo ""

echo "1. Tạo sản phẩm mới với quantity = 10"
PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming ROG",
    "price": 25000000,
    "description": "Laptop gaming cao cấp ASUS ROG",
    "quantity": 10
  }')

echo "Response: $PRODUCT_RESPONSE"
echo ""

# Lấy product ID từ response (cần jq để parse JSON)
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | jq -r '._id')
echo "Product ID: $PRODUCT_ID"
echo ""

echo "2. Kiểm tra sản phẩm vừa tạo"
curl -s -X GET "$BASE_URL/$PRODUCT_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq '.'
echo ""

echo "3. Tạo đơn hàng với quantity = 3"
ORDER_RESPONSE=$(curl -s -X POST "$BASE_URL/buy" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"items\": [
      {
        \"productId\": \"$PRODUCT_ID\",
        \"quantity\": 3
      }
    ]
  }")

echo "Order Response: $ORDER_RESPONSE"
echo ""

echo "4. Kiểm tra quantity sau khi order (phải giảm từ 10 xuống 7)"
sleep 2 # Đợi message queue xử lý
curl -s -X GET "$BASE_URL/$PRODUCT_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq '.'
echo ""

echo "5. Thử tạo order với quantity > tồn kho (quantity = 10)"
curl -s -X POST "$BASE_URL/buy" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"items\": [
      {
        \"productId\": \"$PRODUCT_ID\",
        \"quantity\": 10
      }
    ]
  }" | jq '.'
echo ""

echo "6. Cập nhật quantity (nhập thêm hàng vào kho)"
curl -s -X PUT "$BASE_URL/$PRODUCT_ID/quantity" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 20
  }' | jq '.'
echo ""

echo "7. Kiểm tra quantity sau khi cập nhật"
curl -s -X GET "$BASE_URL/$PRODUCT_ID" \
  -H "Authorization: Bearer $JWT_TOKEN" | jq '.'
echo ""

echo "=== DEMO HOÀN THÀNH ==="