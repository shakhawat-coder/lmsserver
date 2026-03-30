import axios from "axios";

const STORE_ID = process.env.SSLC_STORE_ID || "testbox"; 
const STORE_PASSWORD = process.env.SSLC_STORE_PASSWORD || "qwerty";
const IS_LIVE = process.env.SSLC_IS_LIVE === "true"; 

export const initiateSSLCommerzPayment = async (paymentData: {
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_city: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
  product_name: string;
  product_category: string;
  product_profile: string;
}) => {
  const data = new URLSearchParams({
    store_id: STORE_ID,
    store_passwd: STORE_PASSWORD,
    total_amount: String(paymentData.total_amount),
    currency: paymentData.currency,
    tran_id: paymentData.tran_id,
    success_url: paymentData.success_url,
    fail_url: paymentData.fail_url,
    cancel_url: paymentData.cancel_url,
    ipn_url: paymentData.ipn_url,
    cus_name: paymentData.cus_name,
    cus_email: paymentData.cus_email,
    cus_add1: paymentData.cus_add1,
    cus_city: paymentData.cus_city,
    cus_postcode: paymentData.cus_postcode,
    cus_country: paymentData.cus_country,
    cus_phone: paymentData.cus_phone,
    product_name: paymentData.product_name,
    product_category: paymentData.product_category,
    product_profile: paymentData.product_profile,
    shipping_method: "NO",
    num_of_item: "1",
    weight_of_item: "0",
    value_a: "ref_1",
    value_b: "ref_2",
    value_c: "ref_3",
    value_d: "ref_4",
  });

  const apiBaseUri = IS_LIVE
    ? "https://securepay.sslcommerz.com"
    : "https://sandbox.sslcommerz.com";

  try {
    const response = await axios({
      method: "POST",
      url: `${apiBaseUri}/gwprocess/v4/api.php`,
      data: data.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log("SSLCommerz Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("SSLCommerz Initialization Error:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.failedreason || "Failed to initialize payment with SSLCommerz");
  }
};
