"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Filter, Search, SlidersHorizontal } from "lucide-react"

export function TransactionFilters({ onFilter }: { onFilter: (filters: any) => void }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [date, setDate] = useState<Date | null>(null)
  const [status, setStatus] = useState<string>("all")
  const [amountMin, setAmountMin] = useState("")
  const [amountMax, setAmountMax] = useState("")
  const [dateRange, setDateRange] = useState<string>("all")
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")

  // Debounce search input to avoid excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Apply search filter when debounced value changes
  useEffect(() => {
    if (debouncedSearchQuery !== undefined) {
      applyFilters()
    }
  }, [debouncedSearchQuery])

  // Apply date filter when calendar date changes
  useEffect(() => {
    if (date !== undefined) {
      applyFilters()
    }
  }, [date])

  const applyFilters = () => {
    onFilter({
      searchQuery: debouncedSearchQuery,
      status: status !== "all" ? status : null,
      amountMin: amountMin ? Number.parseFloat(amountMin) : null,
      amountMax: amountMax ? Number.parseFloat(amountMax) : null,
      date: date ? date.toISOString() : null,
      dateRange: dateRange !== "all" ? dateRange : null,
    })
    setIsFilterDialogOpen(false)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setDebouncedSearchQuery("")
    setStatus("all")
    setAmountMin("")
    setAmountMax("")
    setDate(null)
    setDateRange("all")
    onFilter({})
  }

  return (
    <div className="flex items-center gap-2">
      {/* Search Input */}
      <div className="relative w-full md:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search transactions..."
          className="w-full md:w-[200px] lg:w-[300px] pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Date Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`h-9 w-9 p-0 ${date ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
          >
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter by date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              // Clear date range if specific date is selected
              if (newDate) {
                setDateRange("all")
              }
            }}
            initialFocus
            footer={
              date && (
                <div className="px-4 pb-2 pt-0 flex justify-between">
                  <p className="text-sm">Selected: {date.toLocaleDateString()}</p>
                  <Button variant="ghost" size="sm" onClick={() => setDate(null)}>
                    Clear
                  </Button>
                </div>
              )
            }
          />
        </PopoverContent>
      </Popover>

      {/* Advanced Filters */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`h-9 ${
              status !== "all" || amountMin || amountMax || dateRange !== "all"
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : ""
            }`}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Transactions</DialogTitle>
            <DialogDescription>Apply advanced filters to narrow down transactions</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Min Amount */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount-min" className="text-right">
                Min Amount
              </Label>
              <Input
                id="amount-min"
                placeholder="0.00"
                className="col-span-3"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                type="number"
                min="0"
                step="0.01"
              />
            </div>

            {/* Max Amount */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount-max" className="text-right">
                Max Amount
              </Label>
              <Input
                id="amount-max"
                placeholder="1000.00"
                className="col-span-3"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                type="number"
                min="0"
                step="0.01"
              />
            </div>

            {/* Status Filter */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date-range" className="text-right">
                Date Range
              </Label>
              <Select
                value={dateRange}
                onValueChange={(value) => {
                  setDateRange(value)
                  // Clear specific date if date range is selected
                  if (value !== "all") {
                    setDate(null)
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

