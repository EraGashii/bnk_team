"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PlusCircle, TrendingUp, Calendar, Percent, PiggyBank, DollarSign, Edit, Trash2, Eye } from "lucide-react"

// Define types for our data structures
interface Transaction {
  id: number
  date: string
  amount: number
  type: "deposit" | "withdrawal"
}

interface SavingsAccount {
  id: number
  name: string
  balance: number
  interestRate: number
  type: string
  openDate: string
  targetAmount: number
  transactions: Transaction[]
}

interface NewAccountForm {
  name: string
  initialDeposit: string
  interestRate: string
  type: string
  targetAmount: string
}

interface EditAccountForm {
  id: number | null
  name: string
  balance: string
  interestRate: string
  type: string
  targetAmount: string
}

export default function SavingsPage() {
  // Start with empty savings accounts
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([])
  const [selectedAccount, setSelectedAccount] = useState<SavingsAccount | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("actions")

  // Form states
  const [newAccount, setNewAccount] = useState<NewAccountForm>({
    name: "",
    initialDeposit: "",
    interestRate: "",
    type: "",
    targetAmount: "",
  })

  const [editAccount, setEditAccount] = useState<EditAccountForm>({
    id: null,
    name: "",
    balance: "",
    interestRate: "",
    type: "",
    targetAmount: "",
  })

  const [depositAmount, setDepositAmount] = useState("")
  const [depositAccountId, setDepositAccountId] = useState("")

  // Handlers for CRUD operations
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    const newSavingsAccount: SavingsAccount = {
      id: Date.now(), // Use timestamp as unique ID
      name: newAccount.name,
      balance: Number.parseFloat(newAccount.initialDeposit) || 0,
      interestRate: Number.parseFloat(newAccount.interestRate) || 0,
      type: newAccount.type,
      openDate: new Date().toISOString().split("T")[0],
      targetAmount: Number.parseFloat(newAccount.targetAmount) || 0,
      transactions: [],
    }

    // Add initial deposit transaction if amount > 0
    if (Number.parseFloat(newAccount.initialDeposit) > 0) {
      newSavingsAccount.transactions.push({
        id: 1,
        date: new Date().toISOString().split("T")[0],
        amount: Number.parseFloat(newAccount.initialDeposit),
        type: "deposit",
      })
    }

    setSavingsAccounts([...savingsAccounts, newSavingsAccount])

    // Reset form
    setNewAccount({
      name: "",
      initialDeposit: "",
      interestRate: "",
      type: "",
      targetAmount: "",
    })

    // Switch to accounts tab to show the new account
    setActiveTab("accounts")
  }

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault()

    if (editAccount.id === null) return

    const updatedAccounts = savingsAccounts.map((account) => {
      if (account.id === editAccount.id) {
        // Calculate balance difference for transaction history
        const balanceDifference = Number.parseFloat(editAccount.balance) - account.balance

        const updatedAccount = {
          ...account,
          name: editAccount.name,
          balance: Number.parseFloat(editAccount.balance),
          interestRate: Number.parseFloat(editAccount.interestRate),
          type: editAccount.type,
          targetAmount: Number.parseFloat(editAccount.targetAmount),
        }

        // Add a transaction record if balance changed
        if (balanceDifference !== 0) {
          updatedAccount.transactions = [
            ...account.transactions,
            {
              id: account.transactions.length + 1,
              date: new Date().toISOString().split("T")[0],
              amount: Math.abs(balanceDifference),
              type: balanceDifference > 0 ? "deposit" : "withdrawal",
            },
          ]
        }

        return updatedAccount
      }
      return account
    })

    setSavingsAccounts(updatedAccounts)
    setIsEditDialogOpen(false)
  }

  const handleDeleteAccount = (id: number) => {
    const updatedAccounts = savingsAccounts.filter((account) => account.id !== id)
    setSavingsAccounts(updatedAccounts)
    setIsViewDialogOpen(false)
  }

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!depositAccountId || !depositAmount) return

    const amount = Number.parseFloat(depositAmount)

    const updatedAccounts = savingsAccounts.map((account) => {
      if (account.id === Number.parseInt(depositAccountId)) {
        const newTransaction: Transaction = {
          id: account.transactions.length + 1,
          date: new Date().toISOString().split("T")[0],
          amount: amount,
          type: "deposit",
        }

        return {
          ...account,
          balance: account.balance + amount,
          transactions: [...account.transactions, newTransaction],
        }
      }
      return account
    })

    setSavingsAccounts(updatedAccounts)
    setDepositAmount("")
    setDepositAccountId("")
  }

  const handleViewAccount = (account: SavingsAccount) => {
    setSelectedAccount(account)
    setIsViewDialogOpen(true)
  }

  const handleEditClick = (account: SavingsAccount) => {
    setEditAccount({
      id: account.id,
      name: account.name,
      balance: account.balance.toString(),
      interestRate: account.interestRate.toString(),
      type: account.type,
      targetAmount: account.targetAmount.toString(),
    })
    setIsEditDialogOpen(true)
  }

  // Calculate summary statistics
  const totalSavings = savingsAccounts.reduce((sum, account) => sum + account.balance, 0)
  const totalTarget = savingsAccounts.reduce((sum, account) => sum + account.targetAmount, 0)
  const overallProgress = totalTarget > 0 ? (totalSavings / totalTarget) * 100 : 0

  // Calculate projected interest for the year
  const projectedInterest = savingsAccounts.reduce((sum, account) => {
    return sum + account.balance * (account.interestRate / 100)
  }, 0)

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Savings</h1>
            <p className="text-muted-foreground">Manage your savings goals and track your progress</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSavings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across {savingsAccounts.length} accounts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projected Interest</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${projectedInterest.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Annual earnings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
              <Progress value={overallProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">Towards all savings goals</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Goal</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {savingsAccounts.length > 0
                  ? savingsAccounts.sort((a, b) => a.balance / a.targetAmount - b.balance / b.targetAmount)[0].name
                  : "No goals yet"}
              </div>
              <p className="text-xs text-muted-foreground">
                {savingsAccounts.length > 0 ? "Closest to completion" : "Create your first goal"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="accounts">My Accounts</TabsTrigger>
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          </TabsList>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-4">
            {savingsAccounts.length === 0 ? (
              <Card className="p-8 text-center">
                <CardContent className="pt-6 flex flex-col items-center">
                  <PiggyBank className="h-16 w-16 mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">No Savings Accounts Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first savings goal in the Quick Actions tab to get started.
                  </p>
                  <Button onClick={() => setActiveTab("actions")}>Go to Quick Actions</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savingsAccounts.map((account) => (
                  <Card key={account.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle>{account.name}</CardTitle>
                      <CardDescription>{account.type} Savings</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Balance</p>
                          <p className="text-2xl font-bold">${account.balance.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Interest Rate</p>
                          <p className="text-lg font-semibold">{account.interestRate}%</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round((account.balance / account.targetAmount) * 100)}%</span>
                        </div>
                        <Progress value={(account.balance / account.targetAmount) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">Goal: ${account.targetAmount.toLocaleString()}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewAccount(account)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(account)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Deposit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Deposit to {account.name}</DialogTitle>
                            <DialogDescription>Add funds to your savings account.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleDeposit}>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="deposit-amount" className="text-right">
                                  Amount
                                </Label>
                                <Input
                                  id="deposit-amount"
                                  type="number"
                                  placeholder="Enter amount"
                                  value={depositAmount}
                                  onChange={(e) => {
                                    setDepositAmount(e.target.value)
                                    setDepositAccountId(account.id.toString())
                                  }}
                                  className="col-span-3"
                                  required
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Deposit Funds</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Quick Actions Tab */}
          <TabsContent value="actions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Create New Account Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New Savings Goal</CardTitle>
                  <CardDescription>Set up a new savings account for your financial goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateAccount} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Goal Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Vacation Fund"
                        value={newAccount.name}
                        onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initial-deposit">Initial Deposit (optional)</Label>
                      <Input
                        id="initial-deposit"
                        type="number"
                        placeholder="0.00"
                        value={newAccount.initialDeposit}
                        onChange={(e) => setNewAccount({ ...newAccount, initialDeposit: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-amount">Target Amount</Label>
                      <Input
                        id="target-amount"
                        type="number"
                        placeholder="0.00"
                        value={newAccount.targetAmount}
                        onChange={(e) => setNewAccount({ ...newAccount, targetAmount: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-type">Account Type</Label>
                      <Select
                        value={newAccount.type}
                        onValueChange={(value) => {
                          // Set default interest rate based on account type
                          let interestRate = ""
                          if (value === "Standard") interestRate = "1.8"
                          else if (value === "High Yield") interestRate = "2.5"
                          else if (value === "Fixed Term") interestRate = "3.0"

                          setNewAccount({
                            ...newAccount,
                            type: value,
                            interestRate: interestRate,
                          })
                        }}
                        required
                      >
                        <SelectTrigger id="account-type">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard">Standard Savings (1.8%)</SelectItem>
                          <SelectItem value="High Yield">High Yield Savings (2.5%)</SelectItem>
                          <SelectItem value="Fixed Term">Fixed Term Deposit (3.0%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                      <Input
                        id="interest-rate"
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={newAccount.interestRate}
                        onChange={(e) => setNewAccount({ ...newAccount, interestRate: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <PiggyBank className="mr-2 h-4 w-4" />
                      Create Savings Goal
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Deposit to Existing Account Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Make a Deposit</CardTitle>
                  <CardDescription>Add funds to one of your savings accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  {savingsAccounts.length === 0 ? (
                    <div className="text-center py-6">
                      <PiggyBank className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No Accounts Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Create your first savings account to make deposits.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleDeposit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="deposit-account">Select Account</Label>
                        <Select value={depositAccountId} onValueChange={setDepositAccountId} required>
                          <SelectTrigger id="deposit-account">
                            <SelectValue placeholder="Choose an account" />
                          </SelectTrigger>
                          <SelectContent>
                            {savingsAccounts.map((account) => (
                              <SelectItem key={account.id} value={account.id.toString()}>
                                {account.name} (${account.balance.toLocaleString()})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Deposit Funds
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Savings Tips Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Savings Tips</CardTitle>
                  <CardDescription>Strategies to reach your goals faster</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <h3 className="font-medium">50/30/20 Rule</h3>
                    <p className="text-sm text-muted-foreground">
                      Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Automate Your Savings</h3>
                    <p className="text-sm text-muted-foreground">
                      Set up automatic transfers to your savings accounts on payday.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Save Windfalls</h3>
                    <p className="text-sm text-muted-foreground">
                      Put tax refunds, bonuses, and gifts directly into your savings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* View Account Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedAccount && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedAccount.name}</DialogTitle>
                  <DialogDescription>{selectedAccount.type} Savings Account</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Current Balance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">${selectedAccount.balance.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Target Amount</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">${selectedAccount.targetAmount.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round((selectedAccount.balance / selectedAccount.targetAmount) * 100)}%</span>
                    </div>
                    <Progress value={(selectedAccount.balance / selectedAccount.targetAmount) * 100} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Interest Rate</p>
                      <p className="font-medium">{selectedAccount.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Open Date</p>
                      <p className="font-medium">{selectedAccount.openDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Annual Interest</p>
                      <p className="font-medium">
                        ${(selectedAccount.balance * (selectedAccount.interestRate / 100)).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Transaction History</h3>
                    {selectedAccount.transactions.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        No transactions yet. Make your first deposit to get started.
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Type</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedAccount.transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                              <TableCell className="capitalize">{transaction.type}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
                <DialogFooter className="flex justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your savings account and all
                          transaction history.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteAccount(selectedAccount.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Close
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Make Deposit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Deposit to {selectedAccount.name}</DialogTitle>
                          <DialogDescription>Add funds to your savings account.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDeposit}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="quick-deposit-amount" className="text-right">
                                Amount
                              </Label>
                              <Input
                                id="quick-deposit-amount"
                                type="number"
                                placeholder="Enter amount"
                                value={depositAmount}
                                onChange={(e) => {
                                  setDepositAmount(e.target.value)
                                  setDepositAccountId(selectedAccount.id.toString())
                                }}
                                className="col-span-3"
                                required
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Deposit Funds</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Account Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Savings Account</DialogTitle>
              <DialogDescription>Make changes to your savings account details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateAccount}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Account Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editAccount.name}
                    onChange={(e) => setEditAccount({ ...editAccount, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-balance" className="text-right">
                    Balance
                  </Label>
                  <Input
                    id="edit-balance"
                    type="number"
                    value={editAccount.balance}
                    onChange={(e) => setEditAccount({ ...editAccount, balance: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-interest" className="text-right">
                    Interest Rate (%)
                  </Label>
                  <Input
                    id="edit-interest"
                    type="number"
                    step="0.1"
                    value={editAccount.interestRate}
                    onChange={(e) => setEditAccount({ ...editAccount, interestRate: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-type" className="text-right">
                    Account Type
                  </Label>
                  <Select
                    value={editAccount.type}
                    onValueChange={(value) => setEditAccount({ ...editAccount, type: value })}
                    required
                  >
                    <SelectTrigger id="edit-type" className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard Savings</SelectItem>
                      <SelectItem value="High Yield">High Yield Savings</SelectItem>
                      <SelectItem value="Fixed Term">Fixed Term Deposit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-target" className="text-right">
                    Target Amount
                  </Label>
                  <Input
                    id="edit-target"
                    type="number"
                    value={editAccount.targetAmount}
                    onChange={(e) => setEditAccount({ ...editAccount, targetAmount: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

