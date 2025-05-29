"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  Download,
  Receipt,
  Calendar,
  Clock,
  Coffee,
  X,
  Loader2,
} from "lucide-react"

interface PaymentItem {
  id: string
  name: string
  price: number
  quantity?: number
  type: "food" | "room"
  details?: any
}

interface PaymentGatewayProps {
  items: PaymentItem[]
  totalAmount: number
  onPaymentSuccess: (paymentData: any) => void
  onClose: () => void
  userPoints: number
  type: "food" | "room"
}

export function PaymentGateway({
  items,
  totalAmount,
  onPaymentSuccess,
  onClose,
  userPoints,
  type,
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState("card")
  const [loading, setLoading] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [usePoints, setUsePoints] = useState(false)

  // Payment form states
  const [cardForm, setCardForm] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const [upiForm, setUpiForm] = useState({
    upiId: "",
  })

  const [netBankingForm, setNetBankingForm] = useState({
    bank: "",
  })

  // Calculate final amount after points discount
  const pointsDiscount = usePoints ? Math.min(userPoints * 0.1, totalAmount * 0.5) : 0 // 1 point = ₹0.10, max 50% discount
  const finalAmount = totalAmount - pointsDiscount
  const pointsUsed = Math.floor(pointsDiscount / 0.1)

  const handlePayment = async () => {
    setLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const transactionId = `TXN${Date.now()}`
    const paymentInfo = {
      transactionId,
      method: selectedMethod,
      amount: finalAmount,
      originalAmount: totalAmount,
      pointsUsed,
      pointsDiscount,
      items,
      timestamp: new Date(),
      status: "success",
      type,
    }

    setPaymentData(paymentInfo)
    setPaymentComplete(true)
    setLoading(false)

    // Call success callback after a short delay
    setTimeout(() => {
      onPaymentSuccess(paymentInfo)
    }, 1000)
  }

  const generatePaymentSlip = () => {
    const slip = `
FACILITYCONNECT PAYMENT RECEIPT
================================

Transaction ID: ${paymentData.transactionId}
Date: ${paymentData.timestamp.toLocaleDateString()}
Time: ${paymentData.timestamp.toLocaleTimeString()}

ITEMS:
${paymentData.items
  .map(
    (item: PaymentItem) =>
      `- ${item.name} ${item.quantity ? `x${item.quantity}` : ""} - ₹${(item.price / 100).toFixed(2)}`,
  )
  .join("\n")}

PAYMENT SUMMARY:
Subtotal: ₹${(paymentData.originalAmount / 100).toFixed(2)}
${paymentData.pointsUsed > 0 ? `Points Discount (${paymentData.pointsUsed} pts): -₹${(paymentData.pointsDiscount / 100).toFixed(2)}` : ""}
Final Amount: ₹${(paymentData.amount / 100).toFixed(2)}

Payment Method: ${paymentData.method.toUpperCase()}
Status: ${paymentData.status.toUpperCase()}

Thank you for using FacilityConnect!
For support, contact: support@facilityconnect.com
================================
    `

    const blob = new Blob([slip], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payment-receipt-${paymentData.transactionId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (paymentComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-gray-600">Transaction ID</p>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">{paymentData.transactionId}</p>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-bold">₹{(paymentData.amount / 100).toFixed(2)}</span>
              </div>
              {paymentData.pointsUsed > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Points Used:</span>
                  <span>{paymentData.pointsUsed} pts</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="capitalize">{paymentData.method}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={generatePaymentSlip} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button onClick={onClose} className="w-full">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-in fade-in">
      <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5" />
              <span>Payment Gateway</span>
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center">
              {type === "food" ? <Coffee className="h-4 w-4 mr-2" /> : <Calendar className="h-4 w-4 mr-2" />}
              Order Summary
            </h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    {item.quantity && <span className="text-gray-500 ml-2">x{item.quantity}</span>}
                    {item.details && type === "room" && (
                      <div className="text-xs text-gray-500 mt-1">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {item.details.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.details.time}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="font-bold">₹{(item.price / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-3">
              <div className="flex justify-between items-center">
                <span>Subtotal:</span>
                <span>₹{(totalAmount / 100).toFixed(2)}</span>
              </div>
              {usePoints && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Points Discount ({pointsUsed} pts):</span>
                  <span>-₹{(pointsDiscount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total:</span>
                <span>₹{(finalAmount / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Points Usage Option */}
          {userPoints > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-yellow-800">Use Reward Points</h4>
                  <p className="text-sm text-yellow-700">
                    You have {userPoints} points (₹{(userPoints * 0.1).toFixed(2)} value)
                  </p>
                </div>
                <Button variant={usePoints ? "default" : "outline"} size="sm" onClick={() => setUsePoints(!usePoints)}>
                  {usePoints ? "Remove Points" : "Use Points"}
                </Button>
              </div>
            </div>
          )}

          {/* Payment Methods */}
          <div>
            <h3 className="font-semibold mb-4">Select Payment Method</h3>
            <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="card" className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Card</span>
                </TabsTrigger>
                <TabsTrigger value="upi" className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span>UPI</span>
                </TabsTrigger>
                <TabsTrigger value="netbanking" className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>Net Banking</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardForm.number}
                      onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                      maxLength={19}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardForm.name}
                      onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Badge variant="outline">Visa</Badge>
                  <Badge variant="outline">Mastercard</Badge>
                  <Badge variant="outline">RuPay</Badge>
                </div>
              </TabsContent>

              <TabsContent value="upi" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourname@paytm"
                    value={upiForm.upiId}
                    onChange={(e) => setUpiForm({ ...upiForm, upiId: e.target.value })}
                  />
                </div>
                <div className="flex space-x-2">
                  <Badge variant="outline">PhonePe</Badge>
                  <Badge variant="outline">Google Pay</Badge>
                  <Badge variant="outline">Paytm</Badge>
                  <Badge variant="outline">BHIM</Badge>
                </div>
              </TabsContent>

              <TabsContent value="netbanking" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="bank">Select Bank</Label>
                  <select
                    id="bank"
                    value={netBankingForm.bank}
                    onChange={(e) => setNetBankingForm({ ...netBankingForm, bank: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Choose your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                  </select>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Security Notice */}
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Your payment information is secured with 256-bit SSL encryption. We do not store your payment details.
            </AlertDescription>
          </Alert>

          {/* Payment Button */}
          <Button onClick={handlePayment} disabled={loading} className="w-full h-12 text-lg font-semibold" size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                Pay ₹{(finalAmount / 100).toFixed(2)}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
