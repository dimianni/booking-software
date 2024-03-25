// Define a type for the error response expected from the server
interface ErrorResponse {
    status: number;
    code: string;
    summary: string;
}

// Define a type for the successful payment response, based on what you've described
interface PaymentResult {
    paymentData: {
    _links?: {
        redirect: {
            href: string;
        };
    };
    }
}

interface CartItem {
  name: string;
  quantity: number;
  price: number;
}

interface PaymentCartInfo {
  amount: number;
  products: CartItem[];
}

interface HostedPaymentProps {
  cartData: PaymentCartInfo;
}

export default function HostedPayment({cartData}: HostedPaymentProps) {    
    const initiatePayment = async () => {
        try {
            const response = await fetch('/api/checkout/payment-hosted', {
                method: 'POST',
                body: JSON.stringify(cartData),
            });

            console.log(response);

            if (!response.ok) {
                const errorData: { errorResponse: ErrorResponse } = await response.json();
                throw new Error(`Payment initiation failed with status ${errorData.errorResponse.status}. Response code: ${errorData.errorResponse.code}. ${errorData.errorResponse.summary}.`);
            }

            const paymentResult: PaymentResult = await response.json();

            if (paymentResult.paymentData._links && paymentResult.paymentData._links.redirect) {                
                window.location.href = paymentResult.paymentData._links.redirect.href;
            } else {
                // Handle other outcomes (e.g., direct success, error messages)
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <button className="w-full btn btn-primary" onClick={initiatePayment}>Proceed to payment</button>
        </>
    );
};
