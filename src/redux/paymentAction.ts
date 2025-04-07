export const initiateMpesaPayment = async (phone: string, amount: number) => {
    try {
        const response = await fetch("https://mindful-app-r8ur.onrender.com/api/initiate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, amount }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Payment Error:", error);
        return { error: "Payment request failed" };
    }
};
