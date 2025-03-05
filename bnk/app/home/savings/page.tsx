"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { ArrowDownCircle, ArrowUpCircle, CreditCard, DollarSign, PiggyBank, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function SavingsPage() {
  const { isAuthenticated, user, loading } = useAuth()
  const [creditCards, setCreditCards] = useState([])
  const [savingsBalance, setSavingsBalance] = useState(0)
  const [totalDeposits, setTotalDeposits] = useState(0)
  const [selectedCard, setSelectedCard] = useState(null)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [loadingData, setLoadingData] = useState(true)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // "success" or "error"
  const [isProcessing, setIsProcessing] = useState(false)
  const [savingsGoal, setSavingsGoal] = useState(1000) // Default savings goal
  const [savingsHistory, setSavingsHistory] = useState([])

  // Generate some mock savings history for visualization
  useEffect(() => {
    if (savingsBalance > 0) {
      const mockHistory = [
        { date: "2025-02-01", balance: savingsBalance * 0.4 },
        { date: "2025-02-15", balance: savingsBalance * 0.6 },
        { date: "2025-03-01", balance: savingsBalance * 0.8 },
        { date: "2025-03-05", balance: savingsBalance },
      ]
      setSavingsHistory(mockHistory)
    }
  }, [savingsBalance])

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData()
    }
  }, [isAuthenticated])

  const fetchUserData = async () => {
    try {
      // Fetch credit cards for logged-in user
      const ccResponse = await fetch("http://localhost:4000/transactions/getcc", {
        credentials: "include",
      })
      const ccData = await ccResponse.json()
      setCreditCards(Array.isArray(ccData) ? ccData : [ccData])
      setSelectedCard(Array.isArray(ccData) ? ccData[0]?.id : ccData?.id)

      // Fetch savings balance
      const savingsResponse = await fetch("http://localhost:4000/deposit/getSavings", {
        credentials: "include",
      })
      const savingsData = await savingsResponse.json()
      setSavingsBalance(savingsData.balance || 0)

      // Fetch total savings (deposits)
      const depositsResponse = await fetch("http://localhost:4000/deposit/totalDeposits", {
        credentials: "include",
      })
      const depositsData = await depositsResponse.json()
      setTotalDeposits(depositsData.totalDeposits || 0)
    } catch (error) {
      console.error("Error fetching data:", error)
      showMessage("Error loading your account data. Please try again.", "error")
    } finally {
      setLoadingData(false)
    }
  }

  const showMessage = (msg, type = "success") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage("")
    }, 5000)
  }

  const handleDeposit = async () => {
    if (!selectedCard || !depositAmount || Number.parseFloat(depositAmount) <= 0) {
      showMessage("Please enter a valid amount to deposit", "error")
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("http://localhost:4000/deposit/savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          creditCardId: selectedCard,
          amount: Number.parseFloat(depositAmount),
        }),
      })

      const data = await response.json()
      if (response.ok) {
        showMessage("Deposit successful!")
        setSavingsBalance(data.newBalance)
        setDepositAmount("")
        fetchUserData()
      } else {
        showMessage(data.error || "Error processing deposit", "error")
      }
    } catch (error) {
      console.error("Error processing deposit:", error)
      showMessage("Error processing deposit. Please try again.", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWithdraw = async () => {
    if (!selectedCard || !withdrawAmount || Number.parseFloat(withdrawAmount) <= 0) {
      showMessage("Please enter a valid amount to withdraw", "error")
      return
    }

    if (Number.parseFloat(withdrawAmount) > savingsBalance) {
      showMessage("Withdrawal amount exceeds your savings balance", "error")
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch("http://localhost:4000/deposit/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          creditCardId: selectedCard,
          amount: Number.parseFloat(withdrawAmount),
        }),
      })

      const data = await response.json()
      if (response.ok) {
        showMessage("Withdrawal successful!")
        setSavingsBalance(data.newSavingsBalance)
        setWithdrawAmount("")
        fetchUserData()
      } else {
        showMessage(data.error || "Error processing withdrawal", "error")
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error)
      showMessage("Error processing withdrawal. Please try again.", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading your savings account...</p>
        </div>
      </div>
    )
  }

  // Calculate progress towards savings goal
  const goalProgress = Math.min(Math.round((savingsBalance / savingsGoal) * 100), 100)

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Savings Account</h1>
          <p className="text-muted-foreground">Manage your savings and set financial goals</p>
        </div>
        <Button className="mt-4 md:mt-0" variant="outline" onClick={fetchUserData}>
          Refresh Data
        </Button>
      </div>

      {message && (
        <Alert className={`mb-6 ${messageType === "error" ? "bg-destructive/15" : "bg-primary/15"}`}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PiggyBank className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">${savingsBalance.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ArrowDownCircle className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">${totalDeposits.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Interest Earned (Est.)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-amber-500 mr-2" />
              <div className="text-2xl font-bold">${(savingsBalance * 0.025).toFixed(2)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on 2.5% APY</p>
          </CardContent>
        </Card>
      </div>

      {/* Savings Goal Tracker */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Savings Goal Progress</CardTitle>
          <CardDescription>Track your progress towards your savings goal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="font-medium">Goal: ${savingsGoal.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">{goalProgress}% Complete</div>
            </div>
            <Progress value={goalProgress} className="h-2" />

            <div className="flex justify-between text-sm text-muted-foreground">
              <div>Current: ${savingsBalance.toFixed(2)}</div>
              <div>Remaining: ${Math.max(savingsGoal - savingsBalance, 0).toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {goalProgress >= 100
              ? "Congratulations! You've reached your savings goal."
              : `Keep going! You're making great progress.`}
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Update Goal
          </Button>
        </CardFooter>
      </Card>

      {/* Transaction Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Your Savings</CardTitle>
          <CardDescription>Deposit or withdraw funds from your savings account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            </TabsList>

            <div className="mb-4">
              <Label htmlFor="card-select">Select Credit Card</Label>
              <Select value={selectedCard} onValueChange={setSelectedCard}>
                <SelectTrigger id="card-select" className="w-full">
                  <SelectValue placeholder="Select a card" />
                </SelectTrigger>
                <SelectContent>
                  {creditCards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        **** {card.cardNumber.slice(-4)} - ${card.balance.toFixed(2)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="deposit" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Deposit Amount</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-9"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleDeposit}
                    disabled={isProcessing || !depositAmount || Number.parseFloat(depositAmount) <= 0}
                    className="gap-2"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <ArrowDownCircle className="h-4 w-4" /> Deposit
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Funds will be transferred from your selected credit card to your savings account.
              </div>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Withdraw Amount</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-9"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleWithdraw}
                    disabled={
                      isProcessing ||
                      !withdrawAmount ||
                      Number.parseFloat(withdrawAmount) <= 0 ||
                      Number.parseFloat(withdrawAmount) > savingsBalance
                    }
                    variant="outline"
                    className="gap-2"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <ArrowUpCircle className="h-4 w-4" /> Withdraw
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Funds will be transferred from your savings account to your selected credit card.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Savings History */}
      <Card>
        <CardHeader>
          <CardTitle>Savings History</CardTitle>
          <CardDescription>Track your savings growth over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full relative">
            {/* Simple chart visualization */}
            <div className="absolute inset-0 flex items-end">
              {savingsHistory.map((entry, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full max-w-[40px] bg-primary/80 rounded-t-sm mx-auto"
                    style={{ height: `${(entry.balance / savingsGoal) * 100}%`, maxHeight: "90%" }}
                  ></div>
                  <span className="text-xs mt-2 text-muted-foreground">
                    {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
              <span>${savingsGoal.toFixed(0)}</span>
              <span>${(savingsGoal * 0.5).toFixed(0)}</span>
              <span>$0</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            View Detailed Transaction History
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

