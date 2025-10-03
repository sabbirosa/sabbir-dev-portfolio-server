#!/bin/bash

# Test script for Sabbir Portfolio v2 API Server
# Usage: ./test-api.sh

API_URL="http://localhost:3001"
echo "🧪 Testing Sabbir Portfolio v2 API Server"
echo "========================================"

# Test 1: Health Check
echo "📋 1. Testing Health Check..."
curl -s "${API_URL}/api/health" | jq '.' || echo "❌ Health check failed"
echo ""

# Test 2: API Root
echo "📋 2. Testing API Root..."
curl -s "${API_URL}/api" | jq '.' || echo "❌ API root failed"
echo ""

# Test 3: Get Demo Credentials
echo "📋 3. Getting Demo Credentials..."
CREDENTIALS=$(curl -s "${API_URL}/api/auth/credentials")
echo $CREDENTIALS | jq '.' || echo "❌ Credentials endpoint failed"
echo ""

# Extract credentials
EMAIL=$(echo $CREDENTIALS | jq -r '.data.email')
PASSWORD=$(echo $CREDENTIALS | jq -r '.data.password')

# Test 4: Login
echo "📋 4. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")

echo $LOGIN_RESPONSE | jq '.' || echo "❌ Login failed"

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
echo ""

# Test 5: Verify Token
echo "📋 5. Testing Token Verification..."
curl -s -X GET "${API_URL}/api/auth/verify" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.' || echo "❌ Token verification failed"
echo ""

# Test 6: Get Profile
echo "📋 6. Testing Get Profile..."
curl -s -X GET "${API_URL}/api/auth/profile" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.' || echo "❌ Get profile failed"
echo ""

# Test 7: Logout
echo "📋 7. Testing Logout..."
curl -s -X POST "${API_URL}/api/auth/logout" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.' || echo "❌ Logout failed"
echo ""

# Test 8: Readiness Check
echo "📋 8. Testing Readiness Check..."
curl -s "${API_URL}/api/health/ready" | jq '.' || echo "❌ Readiness check failed"
echo ""

# Test 9: Liveness Check
echo "📋 9. Testing Liveness Check..."
curl -s "${API_URL}/api/health/live" | jq '.' || echo "❌ Liveness check failed"
echo ""

echo "✅ API Testing Complete!"
echo "========================================"
