type TermsAndConditionsModalProps = {
  isOpen: boolean
  onClose: () => void
}

const TermsAndConditionsModal = ({ isOpen, onClose }: TermsAndConditionsModalProps) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-xl border bg-background p-6 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-semibold">Terms & Conditions</div>
          <button aria-label="Close" className="h-8 w-8 rounded-md border hover:bg-muted" onClick={onClose}>✕</button>
        </div>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <p>By creating an account, you agree to Athletix's Terms and Privacy Policy. Please review how we process your data and the rules of using our platform.</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-4 h-9 rounded-md bg-primary text-primary-foreground" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditionsModal




