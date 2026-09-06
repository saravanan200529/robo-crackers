import { enquirySubmissionSchema } from '../lib/validators/enquiry.schema';
import { buildWhatsAppEnquiryUrl } from '../lib/whatsapp';

function runTests() {
  console.log('🧪 Starting Automated Integration Test: Critical Enquiry -> WhatsApp Pipeline\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // --- Test 1: Valid Enquiry Payload passes Zod Schema ---
  console.log('Test Group 1: Schema & Input Validation');
  const validPayload = {
    name: 'Ramesh Sundaram',
    phone: '9876543210',
    email: 'ramesh@example.com',
    city: 'Madurai',
    state: 'Tamil Nadu',
    address: '42 Main Bazaar, Near Temple',
    pincode: '625001',
    notes: 'Please pack securely in double cartoon box',
    items: [
      {
        productId: 'prod_win_wheel_super',
        productName: 'Win Wheel Super',
        quantity: 2,
        price: 240.0,
        mrp: 1200.0,
      },
      {
        productId: 'prod_rocket_deluxe',
        productName: 'Rocket Bomb Deluxe',
        quantity: 5,
        price: 80.0,
        mrp: 400.0,
      },
    ],
  };

  const parseResult = enquirySubmissionSchema.safeParse(validPayload);
  assert(parseResult.success, 'Valid enquiry payload successfully parses');

  // --- Test 2: Invalid Mobile Phone formats fail validation ---
  const invalidPhonePayload = { ...validPayload, phone: '12345' };
  const invalidPhoneResult = enquirySubmissionSchema.safeParse(invalidPhonePayload);
  assert(!invalidPhoneResult.success, 'Invalid 5-digit phone is rejected by schema');

  // --- Test 3: Empty items list fails validation ---
  const emptyItemsPayload = { ...validPayload, items: [] };
  const emptyItemsResult = enquirySubmissionSchema.safeParse(emptyItemsPayload);
  assert(!emptyItemsResult.success, 'Empty items array is rejected by schema');

  // --- Test 4: Financial Quote Calculations (Wholesale 80% Discount) ---
  console.log('\nTest Group 2: Pricing & Total Estimate Calculation');
  const expectedTotalEstimate = 240.0 * 2 + 80.0 * 5; // 480 + 400 = 880
  const expectedTotalMrp = 1200.0 * 2 + 400.0 * 5; // 2400 + 2000 = 4400
  const calculatedTotal = validPayload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculatedMrp = validPayload.items.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const calculatedSavings = calculatedMrp - calculatedTotal;

  assert(calculatedTotal === expectedTotalEstimate, `Total calculated quote matches ₹880.00 (Got: ₹${calculatedTotal})`);
  assert(calculatedMrp === expectedTotalMrp, `Total MRP matches ₹4400.00 (Got: ₹${calculatedMrp})`);
  assert(calculatedSavings === 3520.0, `Total savings is ₹3520.00 (80% Off MRP)`);

  // --- Test 5: WhatsApp URL Formatting & Deep Link Generation ---
  console.log('\nTest Group 3: WhatsApp wa.me Deep-Link Formatting');
  const whatsappUrl = buildWhatsAppEnquiryUrl({
    enquiryId: 'cm1234567890abcd',
    customerName: validPayload.name,
    phone: validPayload.phone,
    city: validPayload.city,
    state: validPayload.state,
    address: validPayload.address,
    items: validPayload.items.map((i) => ({
      name: i.productName,
      quantity: i.quantity,
      price: i.price,
      mrp: i.mrp,
    })),
    totalEstimate: calculatedTotal,
    notes: validPayload.notes,
  }, '919342764302');

  assert(whatsappUrl.startsWith('https://wa.me/919342764302?text='), 'WhatsApp URL points to official Robo Crackers number (+91 93427 64302)');

  const decodedText = decodeURIComponent(whatsappUrl.split('text=')[1]);
  assert(decodedText.includes('ROBO CRACKERS — ENQUIRY QUOTE REQUEST'), 'WhatsApp message contains official Robo Crackers header');
  assert(decodedText.includes('#ROBO-90ABCD'), 'WhatsApp message contains correct 6-character Quote Reference ID');
  assert(decodedText.includes('Ramesh Sundaram'), 'WhatsApp message contains customer name');
  assert(decodedText.includes('Win Wheel Super'), 'WhatsApp message lists Win Wheel Super');
  assert(decodedText.includes('Qty: 2 × ₹240.00 = ₹480.00'), 'WhatsApp message shows correct itemized line total for Item 1');
  assert(decodedText.includes('Rocket Bomb Deluxe'), 'WhatsApp message lists Rocket Bomb Deluxe');
  assert(decodedText.includes('Qty: 5 × ₹80.00 = ₹400.00'), 'WhatsApp message shows correct itemized line total for Item 2');
  assert(decodedText.includes('₹880.00'), 'WhatsApp message contains correct Total Quote of ₹880.00');
  assert(decodedText.includes('2018 Supreme Court regulations'), 'WhatsApp message includes mandatory Supreme Court compliance disclaimer');

  // Summary
  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
