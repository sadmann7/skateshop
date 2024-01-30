import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"

export default function ModalLayout({ children }: React.PropsWithChildren) {
  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent className="max-w-3xl overflow-hidden p-0">
        {children}
      </AlertDialogContent>
    </AlertDialog>
  )
}
