import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"

export default function ProductModalLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>{children}</AlertDialogContent>
    </AlertDialog>
  )
}
