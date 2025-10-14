import { createContext, useContext, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import { toast } from "sonner"

// Context
const DialogContext = createContext();

// Global reference to showDialog (this will be exported)
let showDialog = ({
    title = "Tem certeza?",
    description = '',
    cancelText = "Cancelar",
    actionText = "Confirmar",
    showCancelButton = true,
    typeToConfirmLabel = "Por favor, confirme:",
    typeToConfirmPlaceholderPrefix = "Digite aqui: ",
    typeToConfirmPlaceholder = '',
    typeToConfirmContent = '',
    titleClassName = "",
    descriptionClassName = "",
    actionButtonClassName = "",
    cancelButtonClassName = "",
    onCancel = () => {},
    onAction = () => {},
}) => {};

export const DialogProvider = ({ children }) => {
    const [dialog, setDialog] = useState({
        isOpen: false,
        title: "Tem certeza?",
        description: null,
        cancelText: "Cancelar",
        actionText: "Confirmar",
        typeToConfirmLabel: "Por favor, confirme:",
        typeToConfirmPlaceholderPrefix: "Digite aqui: ",
        typeToConfirmPlaceholder: null,
        typeToConfirmContent: null,
        showCancelButton: true,
        titleClassName: "",
        descriptionClassName: "",
        actionButtonClassName: "",
        cancelButtonClassName: "",
        onCancel: () => {},
        onAction: () => {},
    });

    // New state for confirmation input
    const [confirmationInput, setConfirmationInput] = useState("");

    const showDialogHandler = ({
        title = "Tem certeza?",
        description = null,
        cancelText = "Cancelar",
        actionText = "Confirmar",
        typeToConfirmLabel = "Por favor, confirme:",
        typeToConfirmPlaceholderPrefix = "Digite aqui: ",
        typeToConfirmPlaceholder = null,
        typeToConfirmContent = null,
        showCancelButton = true,
        titleClassName = "",
        descriptionClassName = "",
        actionButtonClassName = "",
        cancelButtonClassName = "",
        onCancel,
        onAction,
    }) => {
        setDialog({
            isOpen: true,
            title,
            description,
            cancelText,
            actionText,
            typeToConfirmLabel,
            typeToConfirmPlaceholderPrefix,
            typeToConfirmPlaceholder,
            typeToConfirmContent,
            showCancelButton,
            titleClassName,
            descriptionClassName,
            actionButtonClassName,
            cancelButtonClassName,
            onCancel: onCancel || (() => {}),
            onAction: onAction || (() => {}),
        });
        // Reset the confirmation input whenever dialog is shown
        setConfirmationInput("");
    };

    // Save reference globally
    showDialog = showDialogHandler;

    const hideDialog = () => {
        setDialog((prev) => ({ ...prev, isOpen: false }));
        setConfirmationInput("");
    };

    return (
        <DialogContext.Provider value={{ showDialog }}>
            {children}

            {/* Global Dialog Component */}
            <AlertDialog
                open={dialog.isOpen}
                onOpenChange={hideDialog}
                className="z-[99999]"
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className={dialog.titleClassName}>
                            {dialog.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription
                            className={dialog.descriptionClassName}
                        >
                            {dialog.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {/* Render confirmation input if typeToConfirmContent is provided */}
                    {dialog.typeToConfirmContent && (
                        <div className="mt-4">
                            <Label className="block mb-1">
                                {dialog.typeToConfirmLabel}
                            </Label>
                            <Input
                                type="text"
                                placeholder={
                                    dialog.typeToConfirmPlaceholder
                                        ? dialog.typeToConfirmPlaceholder
                                        : dialog.typeToConfirmPlaceholderPrefix +
                                          dialog.typeToConfirmContent
                                }
                                onPaste={(e) => {
                                    toast.error("Não... não pode. Tem que digitar mesmo 😊");

                                    if (import.meta.env.VITE_APP_ENV == "local") {
                                        return;
                                    }

                                    e.preventDefault();
                                }}
                                
                                value={confirmationInput}
                                onChange={(e) =>
                                    setConfirmationInput(e.target.value)
                                }
                            />
                        </div>
                    )}

                    <AlertDialogFooter>
                        {dialog.showCancelButton && (
                            <AlertDialogCancel
                                className={dialog.cancelButtonClassName}
                                onClick={() => {
                                    hideDialog();
                                    dialog.onCancel();
                                }}
                            >
                                {dialog.cancelText}
                            </AlertDialogCancel>
                        )}
                        <AlertDialogAction
                            className={dialog.actionButtonClassName}
                            onClick={() => {
                                hideDialog();
                                dialog.onAction();
                            }}
                            // Disable action if confirmation is required and does not match
                            disabled={
                                dialog.typeToConfirmContent
                                    ? confirmationInput !==
                                      dialog.typeToConfirmContent
                                    : false
                            }
                        >
                            {dialog.actionText}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DialogContext.Provider>
    );
};

// Export helper function
export { showDialog };

// Hook (optional, if needed)
export const useDialog = () => useContext(DialogContext);
