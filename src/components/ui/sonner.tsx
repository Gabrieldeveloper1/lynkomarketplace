import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      expand
      closeButton
      offset={16}
      toastOptions={{
        duration: 2500,
        classNames: {
          toast:
            "lynko-toast group toast font-display group-[.toaster]:border group-[.toaster]:rounded-2xl group-[.toaster]:backdrop-blur-xl group-[.toaster]:bg-card/90 group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-glow group-[.toaster]:gap-3 group-[.toaster]:pr-12",
          title: "group-[.toast]:text-sm group-[.toast]:font-bold group-[.toast]:tracking-tight",
          description: "group-[.toast]:text-xs group-[.toast]:text-muted-foreground",
          icon: "group-[.toast]:[&>svg]:h-5 group-[.toast]:[&>svg]:w-5",
          actionButton:
            "group-[.toast]:bg-gradient-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:font-semibold",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl",
          closeButton:
            "group-[.toast]:right-2 group-[.toast]:left-auto group-[.toast]:top-2 group-[.toast]:z-20 group-[.toast]:grid group-[.toast]:h-8 group-[.toast]:w-8 group-[.toast]:place-items-center group-[.toast]:rounded-lg group-[.toast]:bg-card group-[.toast]:border-border group-[.toast]:cursor-pointer group-[.toast]:pointer-events-auto",
          success: "lynko-toast-success",
          error: "lynko-toast-error",
          warning: "lynko-toast-warning",
          info: "lynko-toast-info",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
