import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import styles from "./videoComponents.module.css";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef((props, ref) => (
  <DialogPrimitive.Overlay ref={ref} className={styles.overlay} {...props} />
));
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef(({ children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content ref={ref} className={styles.content} {...props}>
      {children}
      <DialogClose className={styles.closeButton}>
        <X className={styles.closeIcon} />
        <span className="sr-only">Close</span>
      </DialogClose>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className = "", ...props }) => (
  <div className={`${styles.header} ${className}`} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className = "", ...props }) => (
  <div className={`${styles.footer} ${className}`} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef((props, ref) => (
  <DialogPrimitive.Title ref={ref} className={styles.title} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef((props, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={styles.description}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
