import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface AlertDialogProps {
    title: string;
    description: string;
    open: boolean;
    onOpenChange: () => void;
    onContinue: () => void;
}

export function AlertDialogComponent(
    {
        title, description, onOpenChange, open, onContinue
    }: AlertDialogProps
) {
    return (
        <AlertDialog onOpenChange={onOpenChange} open={open}>
            <AlertDialogTrigger>{title}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onContinue}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}