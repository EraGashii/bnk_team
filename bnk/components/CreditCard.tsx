import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CreditCardInfoProps {
  cardType: "visa" | "mastercard"
  lastFourDigits: string
  balance: number
  availableCredit: number
  dueDate: string
}

export function CreditCardInfo({ cardType, lastFourDigits, balance, availableCredit, dueDate }: CreditCardInfoProps) {
  const cardStyles = {
    visa: {
      background: "bg-gradient-to-br from-blue-600 to-blue-900",
      text: "text-blue-50",
      highlight: "text-blue-200",
    },
    mastercard: {
      background: "bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500",
      text: "text-red-50",
      highlight: "text-yellow-200",
    },
  }

  const style = cardStyles[cardType]

  return (
    <Card className={`overflow-hidden ${style.background}`}>
      <CardHeader>
        <CardTitle className={`${style.highlight} font-bold`}>Credit Card</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <p className={`text-2xl font-bold ${style.text}`}>**** **** **** {lastFourDigits}</p>
            <span className={`text-lg font-semibold capitalize ${style.highlight}`}>{cardType}</span>
          </div>
          <div className={`space-y-2 ${style.text}`}>
            <p>Balance: ${balance.toFixed(2)}</p>
            <p>Available Credit: ${availableCredit.toFixed(2)}</p>
            <p>Due Date: {dueDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

