import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BiErrorCircle } from "react-icons/bi"


export function Modal({isDialogOpen,setIsDialogOpen,errormsg}) {
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <AlertDialogContent className="bg-red-600 text-white p-4 sm:p-6 lg:p-8 rounded-lg max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
      <AlertDialogHeader>
        <div className="flex items-center">
          <BiErrorCircle className="w-9 h-9 mr-2" />
          <AlertDialogTitle className="text-xl sm:text-2xl lg:text-xl">Error</AlertDialogTitle>
        </div>
        <AlertDialogDescription className="text-white text-sm sm:text-lg lg:text-lg mt-10">
          {errormsg}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-dark p-2 rounded" onClick={() => setIsDialogOpen(false)}>
          OK
        </AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

  )
}
