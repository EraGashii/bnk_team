import type React from "react"
import { ArrowRight } from "lucide-react"

const AnimatedTransaction: React.FC = () => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
      <h3 className="text-2xl font-semibold mb-4 text-card-foreground">Quick Transfer</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">From: Your Account</span>
          <span className="font-semibold text-card-foreground">$1000.00</span>
        </div>
        <div className="flex items-center justify-center text-primary">
          <ArrowRight size={24} className="animate-pulse" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">To: John Doe</span>
          <span className="font-semibold text-card-foreground">$500.00</span>
        </div>
        <div className="mt-6">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-progress"></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Transaction in progress...</p>
        </div>
      </div>
      <style jsx>{`
        @keyframes progress {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default AnimatedTransaction

