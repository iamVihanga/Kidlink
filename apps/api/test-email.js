// Test script for email functionality
const BASE_URL = "http://localhost:8000/api";

async function testEmail(type = "welcome", to = "test@example.com") {
  try {
    const response = await fetch(`${BASE_URL}/system/test-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to,
        type
      })
    });

    const result = await response.json();
    console.log(`Test ${type} email result:`, result);
    return result;
  } catch (error) {
    console.error(`Error testing ${type} email:`, error);
    return null;
  }
}

// Test all email types
async function runTests() {
  console.log("🧪 Testing email functionality...\n");

  // Test welcome email
  await testEmail("welcome", "test@example.com");

  // Test password reset email
  await testEmail("reset", "test@example.com");

  // Test email verification
  await testEmail("verification", "test@example.com");

  console.log("\n✅ Email tests completed!");
}

runTests();
